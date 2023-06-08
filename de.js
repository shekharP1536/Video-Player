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
const seeker = document.getElementById("seeker");
const videoContainer = document.getElementById("videoContainer");
videoContainer.addEventListener("click", togglePlayPause);
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
// Get the progress bar element


// Get the tooltip element
var tooltip = document.querySelector(".tooltipsForTimestamp");

// Add a mousemove event listener to the progress bar
progressBarBar.addEventListener("mousemove", function(e) {
  // Get the mouse x coordinate relative to the progress bar
  var mouseX = e.offsetX;

  // Get the width of the progress bar
  var progressBarWidth = progressBarBar.offsetWidth;

  // Calculate the percentage of the mouse position
  var percentage = mouseX / progressBarWidth;
  const seekTime = (event.offsetX / progressBarBar.offsetWidth) * video.duration;
  const seekTimeFormatted = formatTime(seekTime);
  tooltip.innerHTML = seekTimeFormatted;

  // Update the tooltip left position
  tooltip.style.left = percentage * 98 + "%";
});


const rangeInput = document.querySelector('.range input');
const rangeSpan = document.querySelector('.range span');

rangeInput.addEventListener('mousemove', function() {
  var getValRange = rangeInput.value;
  rangeSpan.textContent = getValRange + '%';
});

let isSeeking = false;
function setting(){
  // settings.style.rotate = "50"
}
function togglePlayPause() {
  var animationspan = document.getElementById("videoanimation")
  if (video.paused || video.ended) {
    video.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    animationspan.innerHTML = '<i class="fas fa-pause"></i>';
    animationspan.classList.add("animate");
    playPauseBtn.dataset.tooltip = 'pause';
  } else {
    video.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    animationspan.innerHTML = '<i class="fas fa-play"></i>';
    animationspan.classList.remove("animate");
    playPauseBtn.dataset.tooltip = 'play';
  }
}

function updateProgress() {
  const currentTime = formatTime(video.currentTime);
  const totalTime = formatTime(video.duration);
  timeText.textContent = `${currentTime} / ${totalTime}`;
  const progress = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${progress}%`;
  seeker.style.left = `${progress}%`;
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
  const theaterControls = document.getElementById('theater-controls');

  if (!videoPlayer.classList.contains('theater-mode')) {
    videoPlayer.classList.add('theater-mode');
    theaterBtn.dataset.tooltip = 'Exit Theater Mode';

    // Create theater controls if they don't exist
    if (!theaterControls) {
      const controls = document.getElementById('controls');
      theaterControls = document.createElement('div');
      theaterControls.id = 'theater-controls';
      theaterControls.innerHTML = `
        <button id="theater-play-pause-btn" class="control-btn" data-tooltip="Play">
          <i class="fas fa-play"></i>
        </button>
        <div id="theater-time" class="control-text">0:00 / 0:00</div>
        <div id="theater-progress-bar" class="control-bar" data-tooltip="">
          <div id="theater-progress"></div>
        </div>
      `;
      controls.appendChild(theaterControls);

      const theaterPlayPauseBtn = document.getElementById('theater-play-pause-btn');
      const theaterTimeText = document.getElementById('theater-time');
      const theaterProgressBar = document.getElementById('theater-progress-bar');
      const theaterProgressBarBar = document.getElementById('theater-progress');

      theaterPlayPauseBtn.addEventListener('click', togglePlayPause);
      video.addEventListener('timeupdate', () => {
        theaterTimeText.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        const progress = (video.currentTime / video.duration) * 100;
        theaterProgressBar.style.width = `${progress}%`;
      });
      theaterProgressBarBar.addEventListener('click', seek);
}
  } else {
    videoPlayer.classList.remove('theater-mode');
    theaterBtn.dataset.tooltip = 'Theater Mode';
    if (theaterControls) {
      theaterControls.remove();
    }
  }
}

function toggleFullscreen() {
  if (videoPlayer.requestFullscreen) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoPlayer.requestFullscreen();
    }
  } else if (video.mozRequestFullScreen) {
    if (document.mozFullScreenElement) {
      document.mozCancelFullScreen();
    } else {
      videoPlayer.mozRequestFullScreen();
    }
  } else if (video.webkitRequestFullscreen) {
    if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    } else {
      videoPlayer.webkitRequestFullscreen();
    }
  } else if (video.msRequestFullscreen) {
    if (document.msFullscreenElement) {
      document.msExitFullscreen();
    } else {
      videoPlayer.msRequestFullscreen();
    }
  }
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
