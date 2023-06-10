// Global variables for video and subtitles
var video;
var subtitleBlocks = [];
var subtitleContainer;

function init() {
    video = document.getElementById('video');
    video.addEventListener('timeupdate', handleTimeUpdate);
    subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'subtitleContainer';
    videoContainer.appendChild(subtitleContainer);
}
function handleTimeUpdate() {
    var checkbox = document.getElementById("captionCheck").checked;
    if (checkbox) {
        console.log("caption ON");
        var currentTime = video.currentTime;
        // Clear subtitle container
        subtitleContainer.innerHTML = '';
        // subtitleContainer.style = "";
        for (var i = 0; i < subtitleBlocks.length; i++) {
            var block = subtitleBlocks[i];
            var startTime = block.startTime;
            var endTime = block.endTime;
            // Check if the current time is within the block's time range
            if (currentTime >= startTime && currentTime <= endTime) {
                // subtitleContainer.style = "background: black;padding: 2px;color: white;border-radius: 14px;position: absolute;width: fit-content;bottom: 10px;/* font-size: 17px; */transition: all 1s ease 0s;margin-right: auto;margin-left: auto;"

                // Create a <p> element for each subtitle line
                for (var j = 0; j < block.subtitles.length; j++) {
                    var subtitleElement = document.createElement('p');
                    subtitleElement.innerHTML = block.subtitles[j];
                    subtitleContainer.appendChild(subtitleElement);
                }
            }
        }
    }
}

function processData(textData) {
    var lines = textData.split('\n');
    // console.log(lines);
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

// Initialize the video and subtitles synchronization
init();
function handleFileSelection(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const subtitleContent = e.target.result;
            parseSubtitleFile(subtitleContent);

        };
        reader.readAsText(file);
    }
}
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileSelection);

function parseSubtitleFile(subtitleContent) {
    var titleRegex = /<title>([\s\S]*?)<\/title>/;
    var authorRegex = /<author>([\s\S]*?)<\/author>/;
    var publisherRegex = /<publisher>([\s\S]*?)<\/publisher>/;
    var dateRegex = /<date>([\s\S]*?)<\/date>/;
    var licenceRegex = /<licence>([\s\S]*?)<\/licence>/;
    var noteRegex = /<note>([\s\S]*?)<\/note>/;
    var langRegex = /<lang>([\s\S]*?)<\/lang>/;
    var startRegex = /<start>([\s\S]*?)<\/start>/;

    try {
        var title = titleRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var author = authorRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var publisher = publisherRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var date = dateRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var licence = licenceRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var note = noteRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var lang = langRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    }
    try {
        var start = startRegex.exec(subtitleContent)[1].trim();
    } catch (error) {
        // console.log(error)
    } try {
        processData(subtitleContent);
    } catch {
        console.log("There is error in file format. error code is 00005x3");
    }

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
    }
}

