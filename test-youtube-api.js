const API_KEY = 'AIzaSyCcBlyoXAQSCWf3nWUHS3DYyqqB_DNWQ2Y';
const VIDEO_ID = 'dQw4w9WgXcQ'; // A known valid YouTube video ID

async function testYouTubeAPI() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${API_KEY}`
        );
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testYouTubeAPI();
