function parseSubtitleFile(subtitleContent) {
  var titleRegex = /<title>([\s\S]*?)<\/title>/;
  var authorRegex = /<author>([\s\S]*?)<\/author>/;
  var publisherRegex = /<publisher>([\s\S]*?)<\/publisher>/;
  var dateRegex = /<date>([\s\S]*?)<\/date>/;
  var licenceRegex = /<licence>([\s\S]*?)<\/licence>/;
  var noteRegex = /<note>([\s\S]*?)<\/note>/;
  var langRegex = /<lang>([\s\S]*?)<\/lang>/;
  var startRegex = /<start>([\s\S]*?)<\/start>/;

  var title = titleRegex.exec(subtitleContent)[1].trim();
  var author = authorRegex.exec(subtitleContent)[1].trim();
  var publisher = publisherRegex.exec(subtitleContent)[1].trim();
  var date = dateRegex.exec(subtitleContent)[1].trim();
  var licence = licenceRegex.exec(subtitleContent)[1].trim();
  var note = noteRegex.exec(subtitleContent)[1].trim();
  var lang = langRegex.exec(subtitleContent)[1].trim();
  var start = startRegex.exec(subtitleContent)[1].trim();

  console.log("Title:", title);
  console.log("Author:", author);
  console.log("Publisher:", publisher);
  console.log("Date:", date);
  console.log("Licence:", licence);
  console.log("Note:", note);
  console.log("Language:", lang);
  console.log("Start:", start);
  if (start) {
    processData(start);
    var video;
        var subtitleBlocks = [];
        var subtitleContainer;

        function init() {
            video = document.getElementById('video');
            video.addEventListener('timeupdate', handleTimeUpdate);
            subtitleContainer = document.createElement('div');
            subtitleContainer.id = 'subtitleContainer';
            document.body.appendChild(subtitleContainer);
        }

        function handleTimeUpdate() {
            var currentTime = video.currentTime;
            console.log(currentTime);

            // Clear subtitle container
            subtitleContainer.innerHTML = '';

            for (var i = 0; i < subtitleBlocks.length; i++) {
                var block = subtitleBlocks[i];
                var startTime = block.startTime;
                console.log(startTime);
                var endTime = block.endTime;
                console.log(endTime);

                // Check if the current time is within the block's time range
                if (currentTime >= startTime && currentTime <= endTime) {
                    // Create a <p> element for each subtitle line

                    for (var j = 0; j < block.subtitles.length; j++) {
                        var subtitleElement = document.createElement('p');
                        subtitleElement.innerHTML = block.subtitles[j];
                        subtitleContainer.appendChild(subtitleElement);
                    }
                }
            }
        }

        

        // Initialize the video and subtitles synchronization
        init();

  }

}

function processData(textData) {
    var lines = textData.split('\n');
    console.log(lines);
    subtitleBlocks = [];
    var currentBlock = null;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        // Check if line starts with 'block index' pattern
        if (/^\d+$/.test(line.split(' ')[0])) {
            if (currentBlock) {
                subtitleBlocks.push(currentBlock);
            }
            currentBlock = {
                index: line.split(' ')[0],
                startTime: null,
                endTime: null,
                subtitles: []
            };
        } else if (line.includes('-->')) {
            var timeParts = line.split(' --> ');
            currentBlock.startTime = parseTime(timeParts[0]);
            currentBlock.endTime = parseTime(timeParts[1]);
        } else {
            currentBlock.subtitles.push(line);
        }
    }
    if (currentBlock) {
        subtitleBlocks.push(currentBlock);
    }
}

function parseTime(timeString) {
    var timeParts = timeString.split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var seconds = parseFloat(timeParts[2].replace(',', '.'));
    return hours * 3600 + minutes * 60 + seconds;
}

// Function to handle the file selection
function handleFileSelection(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const subtitleContent = e.target.result;
      console.log(subtitleContent);
      parseSubtitleFile(subtitleContent);
    };

    reader.readAsText(file);
  }
}

// Initialize the file input element
const fileInput = document.getElementById('subtitleFileInput'); // Replace 'subtitleFileInput' with the ID of your file input element
fileInput.addEventListener('change', handleFileSelection);
