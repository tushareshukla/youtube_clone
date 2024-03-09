const apiKey = 'AIzaSyB22UyjTeUON0crGdrtihb5NqX79QbAxnM';
const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
const videoUrl = 'https://www.googleapis.com/youtube/v3/videos';

async function fetchVideos(query) {
  const response = await fetch(`${searchUrl}?part=snippet&type=video&maxResults=10&q=${query}&key=${apiKey}`);
  const data = await response.json();
  return data.items;
}

async function fetchVideoStatistics(videoId) {
  const response = await fetch(`${videoUrl}?part=statistics&id=${videoId}&key=${apiKey}`);
  const data = await response.json();
  return data.items[0].statistics;
}

async function displayVideos(videos) {
  const videosContainer = document.getElementById('videos-container');
  videosContainer.innerHTML = '';
  for (const video of videos) {
    const videoDiv = document.createElement('div');
    videoDiv.classList.add('video');
    const statistics = await fetchVideoStatistics(video.id.videoId);
    videoDiv.innerHTML = `
      <img src="${video.snippet.thumbnails.high.url}" alt="Thumbnail">
      <div class="video-content">
        <h2>${video.snippet.title}</h2>
        <p>${video.snippet.description}</p>
        <p>Views: ${statistics.viewCount}</p>
        <p>Likes: ${statistics.likeCount}</p>
        <p>Comments: ${statistics.commentCount}</p>
        <p><a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">Watch on YouTube</a></p>
      </div>
    `;
    videosContainer.appendChild(videoDiv);
  }
}

async function searchVideos() {
  const query = document.getElementById('search-input').value;
  try {
    const videos = await fetchVideos(query);
    displayVideos(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
}
