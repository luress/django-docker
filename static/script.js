document.addEventListener('DOMContentLoaded', function() {

    const audioContainer = document.getElementById('audio-container');
    const durationContainer = document.getElementById('duration');
    const musicSlider = document.getElementById('music-slider');
    const audio = document.querySelector('audio');
    const currentTimeContainer = document.getElementById('current-time');
    const playIconContainer = document.getElementById('play-button');
    const imageSong = document.querySelector('.image-now-playing')
    const song = document.querySelector('.audioo')
    const audioInfo = document.getElementById('audio-info')
    const audioArtist = document.getElementById('audio-artist')
    const audioTitle = document.getElementById('audio-title')


    let song_area_id = undefined
    let playlist = undefined
    let playState = 'play';
    let are_playing = false
    let rAF = null;
    let song_id = undefined
    let tmp = 0
    let current_song = undefined

    const play = () => {
        playState = 'pause'
        are_playing = true
        audio.play();
        playIconContainer.id = "pause-button"
        requestAnimationFrame(whilePlaying);
    }

    const pause = () => {
        audio.pause();
        cancelAnimationFrame(rAF);
        playState = 'play'
        are_playing = false
        playIconContainer.id = "play-button"
    }

    const load_music = () => {

        fetch('/musiclist/all')
            .then(response => response.json())
            .then(songs => {
                for(let i = 0; i < songs.length; i++) {
                    const song_area = document.createElement('div')
                    const image = document.createElement('img')
                    const title = document.createElement('p')
                    const allContainer = document.createElement('div')
                    const imageContainer = document.createElement('div')
                    const artist = document.createElement('p')
                    const imageMiddle = document.createElement('div')
                    const songAreaImagePlay = document.createElement('div')
                    
                    const temp = document.querySelector('.song-list')
                    temp.append(song_area)

                    image.setAttribute('src', songs[i].image)
                    image.className = 'song-img'

                    artist.innerHTML = songs[i].artist
                    title.innerHTML = songs[i].title

                    songAreaImagePlay.classList = 'song-area-image-play'

                    imageMiddle.className = 'image-middle'
                    imageMiddle.append(songAreaImagePlay)


                    song_area.className = 'song-area'

                    imageContainer.className = 'song-area-image-container'
                    imageContainer.append(image)
                    imageContainer.append(imageMiddle)
                    
                    
                    allContainer.className = 'song-all-container'
                    allContainer.append(imageContainer)
                    allContainer.append(artist)
                    allContainer.append(title)

                    song_area.append(allContainer)

                    if(song_id !== songs[i].id) {
                        songAreaImagePlay.classList = 'song-area-image-play'
                    }


                    song_area.addEventListener('click', () => {
                        
                        if(are_playing === false) {
                            if(song_id !== songs[i].id){
                                songAreaImagePlay.classList = 'song-area-image-pause'
                                
                                imageSong.setAttribute('src', songs[i].image)
                                song.setAttribute('src', songs[i].audio_file)
                                audioTitle.innerHTML = songs[i].title
                                audioArtist.innerHTML = songs[i].artist
                                song_id = songs[i].id
                                current_song = songAreaImagePlay
                                play()
                                song_area_id = songs[i].id
                                audioInfo.classList.remove('hidden')
                                audioInfo.style.bottom = '0'
                                document.getElementById('music-slider').style.bottom = '90px'
                                fetch(`/playlist/${song_id}`)
                                    .then(response=>response.json())
                                    .then(data => {
                                        playlist=data
                                        console.log(playlist)
                                    })

                                } else {
                                    songAreaImagePlay.classList = 'song-area-image-pause'
                                    play()
                                }
                        } else {
                            if(song_id === songs[i].id){
                                songAreaImagePlay.classList = 'song-area-image-play'
                                pause()
                            } else {
                                songAreaImagePlay.classList = 'song-area-image-pause' 
                                imageSong.setAttribute('src', songs[i].image)
                                song.setAttribute('src', songs[i].audio_file)
                                audioTitle.innerHTML = songs[i].title
                                audioArtist.innerHTML = songs[i].artist
                                current_song.classList ='song-area-image-play'
                                current_song = songAreaImagePlay
                                fetch(`/playlist/${song_id}`)
                                    .then(response=>response.json())
                                    .then(data => {
                                        playlist=data
                                        console.log(playlist)
                                    })
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

    document.getElementById('next-button').addEventListener('click', () => {
        if(tmp+1 < playlist.length ) {
            pause()
            imageSong.setAttribute('src', playlist[tmp + 1].image)
            song.setAttribute('src', playlist[tmp + 1].audio_file)
            play()
            tmp = tmp + 1
        }
    })

    document.getElementById('previous-button').addEventListener('click', () => {
        if(tmp-1 >= 0) {
            pause()
            imageSong.setAttribute('src', playlist[tmp - 1].image)
            song.setAttribute('src', playlist[tmp - 1].audio_file)
            play()
            tmp = tmp - 1
        }
    })

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
    const play_pause = () => {
        if(are_playing === true){
            
        }
        
    
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
    play_pause()
})