const axios = require('axios');

const API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE'; // Replace with your Google Cloud YouTube Data API key
const QUERY = 'metaverse tutorial'; // Test search query

async function testYouTubeAPI() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: QUERY,
        type: 'video',
        maxResults: 5,
        key: API_KEY,
      },
    });
    console.log('API Response:', response.data.items.map(item => item.snippet.title));
    console.log('Success! Check Cloud Logs Explorer for activity.');
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testYouTubeAPI();
