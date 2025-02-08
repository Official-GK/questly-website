const API_KEY = 'AIzaSyCcBlyoXAQSCWf3nWUHS3DYyqqB_DNWQ2Y';
const VIDEO_ID = 'dQw4w9WgXcQ'; // A known valid YouTube video ID

async function testYouTubeAPI() {
    try {
        const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${API_KEY}`;
        console.log('Testing URL:', url);

        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
        
        if (data.error) {
            console.error('API Error:', data.error.message);
        } else if (data.items && data.items.length > 0) {
            console.log('Success! Video title:', data.items[0].snippet.title);
        } else {
            console.log('No video found with this ID');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testYouTubeAPI();
