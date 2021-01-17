$("document").ready(homePageIsReady);

var playlist = [];
var clicked = false;

//--------------------------------------------------------
// running when document is ready
//--------------------------------------------------------
function homePageIsReady() {
    getCurrentDate();
    $("#show_playlist").click(function() {
        // open the side navbar
        openNav();
        if (clicked == true) return;
        clicked = true;
        // ajax request to get the playlist
        $.ajax('music_list.php', {
            dataType: 'json',
            timeout: 500000,
            success: updatePlaylist,
            error: serverError
        });
    });
}

//--------------------------------------------------------
// get the current date from the server
//--------------------------------------------------------
function getCurrentDate() {
    $.ajax('get_current_date.php', {
        dataType: 'text',
        timeout: 500000,
        success: function(data, status, xhr) {
            var date = document.getElementById("current_date");
            date.innerHTML = data;
        },
        error: serverError
    });
}

//--------------------------------------------------------
// get the list of songs and update the web page
//--------------------------------------------------------
function updatePlaylist(data, status, xhr) {
    var table = document.getElementById("songs_table");
    $.each(data, function(songNum, songInfo) {
        playlist[songNum] = songInfo;

        // add row to the table
        var song = table.insertRow(songNum + 1);
        // add the button of 'Play'
        var songBtn = song.insertCell(0);
        songBtn.innerHTML = '<input class="playbtn" id="' + songNum + '" type="button" value="Play &#128308;">';
        songBtn.addEventListener("click", playSong);

        // add the name of artist field
        var ArtistName = song.insertCell(1);
        ArtistName.innerHTML = songInfo['artist_name'];

        // add the song name filed
        var songName = song.insertCell(2);
        songName.innerHTML = songInfo['name'];
    });
}

//--------------------------------------------------------
// show errors from the server side
//--------------------------------------------------------
function serverError(jqXhr, textStatus, errorMassege) {
    alert("error" + errorMassege);
}

//--------------------------------------------------------
// open the side navbar (to see the playlist)
//--------------------------------------------------------
function openNav() {
    document.getElementById("mySidebar").style.width = "51%";
}

//--------------------------------------------------------
// close the side navbar (to hide the playlist, still playing)
//--------------------------------------------------------
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

//--------------------------------------------------------
// function that called when user clicked 'Play'
//--------------------------------------------------------
function playSong(event) {
    var video = $("#video-player")[0];
    var videoId = playlist[event.target.id]['id'];
    video.setAttribute("data-video-id", videoId);

    // its not the first time, only need to load video
    if (video.tagName == "IFRAME") {
        player.loadVideoById(videoId);
    } else { // need to create the iframe object
        createVideo(video);
    }
}

//--------------------------------------------------------
// first time we play song, need to create iframe object
//--------------------------------------------------------
function createVideo(video) {
    var youtubeScriptId = "youtube-api";
    var youtubeScript = document.getElementById(youtubeScriptId);
    var videoId = video.getAttribute("data-video-id");

    if (youtubeScript === null) {
        var tag = document.createElement("script");
        var firstScript = document.getElementsByTagName("script")[0];

        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = youtubeScriptId;
        firstScript.parentNode.insertBefore(tag, firstScript);
    }

    window.onYouTubeIframeAPIReady = function() {
        window.player = new window.YT.Player(video, {
            videoId: videoId,
            height: "300px",
            width: "500px",
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
            }
        });
    };
}