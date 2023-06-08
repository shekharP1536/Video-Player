// Function to parse the subtitle file content
// Function to parse the subtitle file content
function parseSubtitleFile(content, subtitleData) {
  const lines = content.split('\n');
  let currentSubtitle = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (line?.startsWith('<title>')) {
      // Parse title tag
      const title = line.substring(7, line.length - 8);
      subtitleData.title = title;
      console.log("title: " + title);
    } else if (line?.startsWith('<author>')) {
      // Parse author tag
      const author = line.substring(8, line.length - 9);
      subtitleData.author = author;
      console.log("author: " + author);
    } else if (line?.startsWith('<publisher>')) {
      // Parse publisher tag
      const publisher = line.substring(11, line.length - 12);
      subtitleData.publisher = publisher;
    } else if (line?.startsWith('<date>')) {
      // Parse date tag
      const date = line.substring(6, line.length - 7);
      subtitleData.date = date;
    } else if (line?.startsWith('<licence>')) {
      // Parse licence tag
      const licence = line.substring(9, line.length - 10);
      subtitleData.licence = licence;
    } else if (line?.startsWith('<note>')) {
      // Parse note tag
      const note = line.substring(6, line.length - 7);
      subtitleData.note = note;
      console.log("note: " + note);
    } else if (line?.startsWith('<lang>')) {
      // Parse lang tag
      const lang = line.substring(6, line.length - 7);
      subtitleData.languages = lang.split('<');
      console.log(subtitleData.languages);
      console.log(lang);
    } else if (line?.startsWith('<start>')) {
      // Parse start tag
      currentSubtitle = { text: {}, timings: [] };
    } else if (line?.startsWith('//')) {
      // Skip commented lines
      continue;
    } else if (line === '') {
      // Empty line, skip
      continue;
    } else if (currentSubtitle) {
      var number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      console.log(number.some(num => line.startsWith(num)));
      console.log(line)
      // Parse subtitle lines
      if (line.startsWith(number.some(num => line.startsWith(num)))) {
        // Timings line
        const timings = line.substring(1, line.length - 1).split(' --> ');
        console.log(timings);
        const startTime = parseTime(timings[0]);
        console.log(startTime);
        const endTime = parseTime(timings[1]);
        console.log(endTime);
        currentSubtitle.timings.push({ start: startTime, end: endTime });
        console.log(startTime);
        console.log(endTime);
      } else {
        // Text line
        const lineParts = line.split(':');
        if (lineParts.length === 2) {
          const lang = lineParts[0].trim();
          const text = lineParts[1].trim();
          currentSubtitle.text[lang] = text;
        }
      }
    }
  }

  // Push the last subtitle if available
  if (currentSubtitle) {
    subtitleData.subtitles.push(currentSubtitle);
  }
}

// Function to parse the time in HH:MM:SS,MMM format
// Function to parse the time in HH:MM:SS,sss format
function parseTime(timeString) {
  const timeParts = timeString.split(':');
  console.log(timeParts)
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[3]);
  console.log(hours, minutes, seconds)
  const milliseconds = parseInt(timeParts[4].split(',')[0]);
  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

// ... Rest of the code ...



// Function to integrate the subtitles with the video element
// Function to integrate the subtitles with the video element
function integrateSubtitles(subtitleData, videoElement) {
  const subtitleOverlay = document.getElementById('subtitleOverlay');
  let subtitlesByLanguage = {};

  videoElement.addEventListener('timeupdate', function () {
    const currentTime = videoElement.currentTime;
    const subtitle = findSubtitleByTime(subtitleData.subtitles, currentTime);
    console.log(subtitle);
    let subtitleText = '';

    if (subtitle) {
      const language = 'en'; // Set the default language to 'en'
      subtitleText = fetchSubtitleText(subtitle, language);
      console.log(subtitleText);

      if (subtitlesByLanguage[language]) {
        // Remove previous subtitles for the same language
        subtitleOverlay.removeChild(subtitlesByLanguage[language]);
        delete subtitlesByLanguage[language];
      }

      if (subtitleText) {
        const subtitleElement = document.createElement('span');
        subtitleElement.textContent = subtitleText;
        subtitleElement.style.display = 'block';
        subtitlesByLanguage[language] = subtitleElement;
        subtitleOverlay.appendChild(subtitleElement);
      }
    } else {
      // No subtitle found for the current time, remove all subtitles
      Object.values(subtitlesByLanguage).forEach((subtitleElement) => {
        subtitleOverlay.removeChild(subtitleElement);
      });
      subtitlesByLanguage = {};
    }
  });
}



// Function to handle the file selection
function handleFileSelection(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const subtitleContent = e.target.result;
      const subtitleData = { subtitles: [], text: {} }; // Create an empty subtitleData object
      parseSubtitleFile(subtitleContent, subtitleData);
      const videoElement = document.getElementById('videoPlayer');
      integrateSubtitles(subtitleData, videoElement);
    };

    reader.readAsText(file);
  }
}

// Initialize the file input element
const fileInput = document.getElementById('subtitleFileInput'); // Replace 'subtitleFileInput' with the ID of your file input element
fileInput.addEventListener('change', handleFileSelection);











for (var j = 0; j < block.subtitles.length; j++) {
  var subtitleElement = document.createElement('p');
  subtitleElement.innerHTML = block.subtitles[j];
  subtitleContainer.appendChild(subtitleElement);
}