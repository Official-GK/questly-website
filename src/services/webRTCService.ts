import { rtdb } from '@/config/firebase';
import { getDatabase, ref, set, onValue, off, remove, onChildAdded } from 'firebase/database';

const rtcConfiguration = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    {
      urls: 'turn:numb.viagenie.ca',
      username: 'webrtc@live.com',
      credential: 'muazkh'
    },
    {
      urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
      username: 'webrtc',
      credential: 'webrtc'
    }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
  iceTransportPolicy: 'all'
};

interface PeerConnection {
  pc: RTCPeerConnection;
  audioTrack?: MediaStreamTrack;
}

class WebRTCService {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private roomId: string | null = null;
  private userId: string;
  private onParticipantJoined: (userId: string) => void;
  private onParticipantLeft: (userId: string) => void;
  private database: any;
  private roomRef: any;
  private initialized: boolean = false;
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private connected: boolean = false;
  private muted: boolean = false;

  public isConnected(): boolean {
    return this.connected;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  constructor(
    userId: string,
    onParticipantJoined: (userId: string) => void,
    onParticipantLeft: (userId: string) => void
  ) {
    this.userId = userId;
    this.onParticipantJoined = onParticipantJoined;
    this.onParticipantLeft = onParticipantLeft;
  }

  async joinRoom(roomId: string) {
    // Reset connection state
    this.connected = false;
    
    // Clean up any existing connections
    if (this.roomId) {
      await this.leaveRoom();
    }
    console.log('Joining room:', roomId);
    this.roomId = roomId;
    this.database = getDatabase();
    
    try {
      // Request audio permissions with fallback options
      console.log('Requesting audio permission...');
      try {
        const constraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
            sampleRate: 48000,
            sampleSize: 16
          },
          video: false
        };
        
        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Audio permission granted with enhanced features');
      } catch (err) {
        console.warn('Enhanced audio failed, trying basic audio:', err);
        this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Basic audio permission granted');
      }
      
      // Verify we have an audio track
      const audioTracks = this.localStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio track available');
      }
      console.log('Audio tracks:', audioTracks.map(track => track.label));
      
      // Set up room reference
      this.roomRef = ref(rtdb, `rooms/${roomId}`);
      const participantsRef = ref(rtdb, `rooms/${roomId}/participants`);
      
      // Listen for new participants
      onValue(participantsRef, (snapshot) => {
        console.log('Participants changed:', snapshot.val());
        const participants = snapshot.val() || {};
        
        // Handle new participants
        Object.keys(participants).forEach((participantId) => {
          if (participantId !== this.userId && !this.peerConnections.has(participantId)) {
            this.createPeerConnection(participantId);
            this.onParticipantJoined(participantId);
          }
        });

        // Handle participants who left
        this.peerConnections.forEach((_, id) => {
          if (!participants[id]) {
            this.removePeerConnection(id);
            this.onParticipantLeft(id);
          }
        });
      });

      // Add yourself to the room
      await set(ref(this.database, `rooms/${roomId}/participants/${this.userId}`), {
        timestamp: Date.now(),
        muted: this.muted
      });
      
      this.connected = true;
      console.log('Successfully connected to room');

    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  private async createPeerConnection(participantId: string) {
    console.log('Creating peer connection for:', participantId);
    const pc = new RTCPeerConnection(rtcConfiguration);
    
    // Add all local tracks to the peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log('Adding local track to peer connection:', track.kind);
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      const [remoteStream] = event.streams;
      
      // Create or get existing audio element
      let audioElement = this.audioElements.get(participantId);
      if (!audioElement) {
        audioElement = new Audio();
        audioElement.autoplay = true;
        audioElement.playsInline = true;
        this.audioElements.set(participantId, audioElement);
      }
      
      audioElement.srcObject = remoteStream;
      
      // Ensure audio plays on mobile devices
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio playback failed:', error);
          // Try playing again on user interaction
          document.addEventListener('click', () => {
            audioElement?.play();
          }, { once: true });
        });
      }
    };

    // Handle ICE candidate events
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
        set(ref(this.database, `rooms/${this.roomId}/candidates/${this.userId}/${participantId}`), {
          ...event.candidate.toJSON(),
          timestamp: Date.now()
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state changed to: ${pc.connectionState}`);
      if (pc.connectionState === 'failed') {
        console.log('Connection failed, attempting to restart ICE');
        pc.restartIce();
      }
    };

    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      console.log(`ICE connection state changed to: ${state}`);
      
      if (state === 'disconnected' || state === 'failed') {
        console.log('Attempting to reconnect...');
        pc.restartIce();
      }
    };

    // Listen for ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state changed to: ${pc.iceConnectionState}`);
    };
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    });

    // Add local audio track
    this.localStream?.getAudioTracks().forEach(track => {
      pc.addTrack(track, this.localStream!);
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      console.log('New ICE candidate:', event.candidate);
      if (event.candidate) {
        set(
          ref(rtdb, `rooms/${this.roomId}/candidates/${this.userId}/${participantId}/${Date.now()}`),
          event.candidate.toJSON()
        );
      }
    };

      // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      const [remoteStream] = event.streams;
      
      // Create or get existing audio element
      let audioElement = this.audioElements.get(participantId);
      if (!audioElement) {
        audioElement = new Audio();
        audioElement.autoplay = true;
        audioElement.playsInline = true;
        this.audioElements.set(participantId, audioElement);
      }
      
      // Set the remote stream as the source
      audioElement.srcObject = remoteStream;
      
      // Ensure audio plays on mobile devices
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio playback failed:', error);
          // Try playing again on user interaction
          document.addEventListener('click', () => {
            audioElement?.play();
          }, { once: true });
        });
      }

      // Store the connection with audio track
      const audioTrack = remoteStream.getAudioTracks()[0];
      this.peerConnections.set(participantId, { pc, audioTrack });
      console.log('Added remote audio track to peer connection');
    };

    this.peerConnections.set(participantId, { pc });

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await set(
      ref(db, `rooms/${this.roomId}/offers/${this.userId}/${participantId}`),
      { sdp: offer.sdp, type: offer.type }
    );

    // Listen for answer
    onValue(
      ref(db, `rooms/${this.roomId}/answers/${participantId}/${this.userId}`),
      async (snapshot) => {
        const answer = snapshot.val();
        if (answer && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      }
    );

    return pc;
  }

  private async removePeerConnection(participantId: string) {
    // Clean up peer connection
    const connection = this.peerConnections.get(participantId);
    if (connection) {
      connection.pc.close();
      this.peerConnections.delete(participantId);
    }

    // Clean up audio element
    const audioElement = this.audioElements.get(participantId);
    if (audioElement) {
      audioElement.srcObject = null;
      audioElement.remove();
      this.audioElements.delete(participantId);
    }
      this.peerConnections.delete(participantId);
    }
  }

  async leaveRoom() {
    this.connected = false;
    if (this.roomId) {
      // Remove yourself from the room
      await remove(ref(db, `rooms/${this.roomId}/participants/${this.userId}`));
      
      // Close all peer connections
      this.peerConnections.forEach((connection, participantId) => {
        this.removePeerConnection(participantId);
      });

      // Stop local stream
      this.localStream?.getTracks().forEach(track => track.stop());
      this.localStream = null;
      this.roomId = null;
    }
  }

  toggleMute(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      return audioTrack.enabled;
    }
    return false;
  }
}

export default WebRTCService;
