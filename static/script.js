document.addEventListener('DOMContentLoaded', function() {

    const audioContainer = document.getElementById('audio-container');
    const durationContainer = document.getElementById('duration');
    const musicSlider = document.getElementById('music-slider');
    const audio = document.querySelector('audio');
    const currentTimeContainer = document.getElementById('current-time');
    const playIconContainer = document.getElementById('play-button');

    let playState = 'play';
    let are_playing = false
    let rAF = null;
    let song_id = undefined

    const play = () => {
        playState = 'pause'
        are_playing = true
        audio.play();
        requestAnimationFrame(whilePlaying);
    }

    const pause = () => {
        audio.pause();
        cancelAnimationFrame(rAF);
        playState = 'play'
        are_playing = false
    }

    const load_music = () => {
        fetch('/musiclist/all')
            .then(response => response.json())
            .then(songs => {
                for(let i = 0; i < songs.length; i++) {
                    const song_area = document.createElement('div')
                    const image = document.createElement('img')
                    const title = document.createElement('p')

                    const temp = document.querySelector('.song-list')
                    temp.append(song_area)

                    image.setAttribute('src', songs[i].image)
                    image.className = 'song-img'

                    title.innerHTML = songs[i].title

                    song_area.append(image)
                    song_area.append(title)


                    song_area.addEventListener('click', () => {
                        if(are_playing === false) {
                            if(song_id !== songs[i].id){
                                document.querySelector('.image-now-playing').setAttribute('src', songs[i].image)
                                document.querySelector('.audioo').setAttribute('src', songs[i].audio_file)
                                song_id = songs[i].id
                                play()
                                } else {
                                    play()
                                }
                        } else {
                            if(song_id === songs[i].id){
                                pause()
                            } else {
                                document.querySelector('.image-now-playing').setAttribute('src', songs[i].image)
                                document.querySelector('.audioo').setAttribute('src', songs[i].audio_file)
                                song_id = songs[i].id
                                play()
                            }

                            }
                        });

                }
            })
    }



    const whilePlaying = () => {
        musicSlider.value = Math.floor(audio.currentTime);
        currentTimeContainer.textContent = calculateTime(musicSlider.value);
        audioContainer.style.setProperty('--seek-before-width', `${musicSlider.value / musicSlider.max * 100}%`);
        rAF = requestAnimationFrame(whilePlaying);
    }

    playIconContainer.addEventListener('click', () => {
        if(playState === 'play') {
            play()
        } else {
            pause()
        }
    });



    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }

    const displayDuration = () => {
        durationContainer.textContent = calculateTime(audio.duration);
    }

    if (audio.readyState > 0) {
        displayDuration();
    } else {
        audio.addEventListener('loadedmetadata', () => {displayDuration();
    });
    }

    const showRangeProgress = (rangeInput) => {
        if (rangeInput === musicSlider) {
            audioContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
        } else {
            audioContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
        }
    }

    const displayBufferedAmount = () => {
        const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
        audioContainer.style.setProperty('--buffered-width', `${(bufferedAmount / musicSlider.max) * 100}%`);
    }

    const setSliderMax = () => {
        musicSlider.max = Math.floor(audio.duration);
    }

    if (audio.readyState > 0) {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    } else {
        audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

    musicSlider.addEventListener('input', (e) => {
        showRangeProgress(e.target);
    });
    audio.addEventListener('loadedmetadata', () => {
        displayDuration(audio.duration);
    });
    musicSlider.addEventListener('input', () => {
        currentTimeContainer.textContent = calculateTime(musicSlider.value);
    });
    musicSlider.addEventListener('change', () => {
        audio.currentTime = musicSlider.value;
    });
    audio.addEventListener('timeupdate', () => {
        musicSlider.value = Math.floor(audio.currentTime);
    });
    audio.addEventListener('progress', displayBufferedAmount);

    musicSlider.addEventListener('input', () => {
        currentTimeContainer.textContent = calculateTime(musicSlider.value);
        if(!audio.paused) {
            cancelAnimationFrame(rAF);
            }
        });

    musicSlider.addEventListener('change', () => {
        audio.currentTime = musicSlider.value;
        if(!audio.paused) {
            requestAnimationFrame(whilePlaying);
        }
        });
    load_music()
})