const video = document.getElementById('video');
const videoPlayer = document.getElementById('video-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const timeText = document.getElementById('time');
const progressBar = document.getElementById('progress');
const progressBarBar = document.getElementById('progress-bar');
const volumeWrapper = document.getElementById('volume-wrapper');
const volumeBtn = document.getElementById('volume-btn');
// const volumeBar = document.getElementById('volume');
const volumebar = document.getElementById('volume-bar');
const captionBtn = document.getElementById('caption-btn');
const theaterBtn = document.getElementById('theater-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const settingsBtn = document.getElementById('settings-btn');
const slider = document.getElementById("VolumeRange");
const settings = document.getElementById("settings-btn");
playPauseBtn.addEventListener('click', togglePlayPause);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener("load", updateProgress)
progressBarBar.addEventListener('click', seek);
settings.addEventListener("click" , setting);
volumeBtn.addEventListener('click', toggleMute);
// volumeBar.addEventListener('click', adjustVolume);
captionBtn.addEventListener('click', toggleCaption);
theaterBtn.addEventListener('click', toggleTheaterMode);
fullscreenBtn.addEventListener('click', toggleFullscreen);
slider.oninput = function() {
    video.volume = this.value / 100;
  }

// Tooltip handling
const tooltips = document.querySelectorAll('[data-tooltip]');
tooltips.forEach((tooltip) => {
  tooltip.addEventListener('mouseenter', showTooltip);
  tooltip.addEventListener('mouseleave', hideTooltip);
});

const    rangeInput = document.querySelector('.range input');
const rangeSpan = document.querySelector('.range span');

rangeInput.addEventListener('mousemove', function() {
  var getValRange = rangeInput.value;
  rangeSpan.textContent = getValRange + '%';
});

let isSeeking = false;
function setting(){
  // settings.style.rotate = "50"
}
function showTooltip() {
  const tooltip = this.dataset.tooltip;
  const tooltipElement = document.createElement('div');
  tooltipElement.classList.add('tooltip');
  tooltipElement.textContent = tooltip;
  this.appendChild(tooltipElement);
  setTimeout(() => {
    tooltipElement.style.opacity = '1';
  }, 10);
}

function hideTooltip() {
  const tooltipElement = this.querySelector('.tooltip');
  tooltipElement.style.opacity = '0';
  setTimeout(() => {
    this.removeChild(tooltipElement);
  }, 300);
}

function togglePlayPause() {
  if (video.paused || video.ended) {
    video.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playPauseBtn.dataset.tooltip = 'pause';
  } else {
    video.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    playPauseBtn.dataset.tooltip = 'play';
  }
}

function updateProgress() {
  const currentTime = formatTime(video.currentTime);
  const totalTime = formatTime(video.duration);
  timeText.textContent = `${currentTime} / ${totalTime}`;
  const progress = (video.currentTime / video.duration) * 100;
  console.log(totalTime);
  progressBar.style.width = `${progress}%`;
}

function seek(event) {
  if (!isSeeking) {
    const clickedTime = (event.offsetX / progressBarBar.offsetWidth) * video.duration;
    video.currentTime = clickedTime;
  }
}


function toggleMute() {
  if (video.muted) {
    video.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeBtn.dataset.tooltip = 'Mute';
  } else {
    video.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeBtn.dataset.tooltip = 'Unmute';
  }
}


function toggleCaption() {
  if (video.textTracks.length > 0) {
    const textTrack = video.textTracks[0];
    textTrack.mode = (textTrack.mode === 'showing') ? 'hidden' : 'showing';
    captionBtn.textContent = (textTrack.mode === 'showing') ? 'Caption: On' : 'Caption: Off';
  }
}
function toggleTheaterMode() {
  const videoPlayer = document.getElementById('video-player');
  const theaterControls = document.getElementById('theater-controls');

  if (!videoPlayer.classList.contains('theater-mode')) {
    video.classList.add('theater-mode');
    videoPlayer.classList.add('theater-mode-controls');
    theaterBtn.dataset.tooltip = 'Default View';
  } else {
    videoPlayer.classList.remove('theater-mode');
    videoPlayer.classList.remove('theater-mode-controls');
    theaterBtn.dataset.tooltip = 'Theater Mode';
  }
}

function toggleFullscreen() {
  if (video.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    videoPlayer.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    videoPlayer.msRequestFullscreen();
  }
  videoPlayer.style.backgroundColor = "white";
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${(seconds < 10) ? '0' : ''}${seconds}`;
}

video.addEventListener('ended', () => {
  playPauseBtn.innerHTML = '<i class="fas fa-redo"></i>';
  playPauseBtn.dataset.tooltip = "replay"
});
