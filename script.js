document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const albumCover = document.getElementById('album-cover');
    const musicIcon = document.getElementById('music-icon');

    const defaultIcon = '<i class="fas fa-music"></i>';

    const songs = [
        { src: 'Chariots Of Fire.mp3' },
        { src: 'First Step.mp3' }
    ];
    let currentSongIndex = 0;

    async function loadAlbumCover(src) {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const metadata = await window.musicMetadata.parseBlob(blob);
            if (metadata.common.picture && metadata.common.picture.length > 0) {
                const picture = metadata.common.picture[0];
                const base64String = btoa(String.fromCharCode(...new Uint8Array(picture.data)));
                albumCover.src = `data:${picture.format};base64,${base64String}`;
                albumCover.style.display = 'block';
                musicIcon.innerHTML = '';
            } else {
                albumCover.style.display = 'none';
                musicIcon.innerHTML = defaultIcon;
            }
        } catch (error) {
            console.error('Error extracting album cover:', error);
            albumCover.style.display = 'none';
            musicIcon.innerHTML = defaultIcon;
        }
    }

    function playSong() {
        const currentSong = songs[currentSongIndex];
        audio.src = currentSong.src;
        loadAlbumCover(currentSong.src);
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        albumCover.style.animationPlayState = 'running';
    }

    function pauseSong() {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        albumCover.style.animationPlayState = 'paused';
    }

    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    prevBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong();
    });

    nextBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong();
    });

    audio.addEventListener('ended', function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong();
    });


    // Add event listener for spacebar to pause/play the music
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault(); // Prevent default spacebar action
            if (audio.paused) {
                playSong();
            } else {
                pauseSong();
            }
        }
    });
});
