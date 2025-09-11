

const player = {
    _NEXT: 1,
    _PREV: -1,

    _isSeeking: false,
    _isRepeat: localStorage.getItem("isRepeat") === "true",
    _isRandom: localStorage.getItem("isRandom") === "true",

    _playlist: document.querySelector(".playlist"),
    _playingName: document.querySelector("#playing-name"),
    _audio: document.querySelector("#audio"),
    _controlMusicBtn: document.querySelector(".btn-toggle-play"),
    _prev: document.querySelector(".btn-prev"),
    _next: document.querySelector(".btn-next"),
    _progress: document.querySelector("#progress"),
    _repeat: document.querySelector(".btn-repeat"),
    _random: document.querySelector(".btn-random"),
    _durationSong: document.querySelector(".duration"),
    _runTime: document.querySelector(".run_time"),
    _songBtn: document.querySelectorAll(".song"),


    _songs: [
        {
            id: 1,
            name: "Beautiful Things",
            path: "./music/Beautiful Things.mp3",
            artist: "Benson Boone",
            // durationSong: this._audio.duration
        },
        {
            id: 2,
            name: "Lặng",
            path: "./music/Lặng.mp3",
            artist: "Rhymastic",
            // durationSong: this._audio.duration

        },
        {
            id: 3,
            name: "Moonlight City",
            path: "./music/Moonlight City.mp3",
            artist: "Minh Tốc và Lam",
            // durationSong: this._audio.duration

        },
        {
            id: 4,
            name: "Phép Màu",
            path: "./music/Phép Màu.mp3",
            artist: "Minh Tốc",
            // durationSong: this._audio.duration

        }
    ],

    _currenIndex: 0,
    getCurrenSong() {
        return this._songs[this._currenIndex]
    },


    handleControll(step) {
        this._currenIndex = (this._currenIndex + step + this._songs.length) % this._songs.length;
        this.render();

    },
    //khởi tạo
    init() {
        this._playlist.addEventListener("click", (e) => {
            const song = e.target.closest(".song");
            if (song) {
                this._currenIndex = song.id - 1;
                this.render();
                this._audio.play();

                console.log(song.id);
            }
        })


        this._controlMusicBtn.addEventListener("click", () => {
            if (this._audio.paused) {
                this._audio.play();
            } else {
                this._audio.pause();
            }
        })
        this._audio.addEventListener("play", () => {
            this._controlMusicBtn.innerHTML = `<i class="fas fa-pause"></i>`;
            // console.log("play");

        })
        this._audio.addEventListener("pause", () => {
            this._controlMusicBtn.innerHTML = `<i class="fas fa-play"></i>`;
        })

        this._next.addEventListener("click", () => {
            this.handleControll(this._NEXT);
            this._audio.play();

        })
        this._prev.addEventListener("click", () => {
            this.handleControll(this._PREV);
            this._audio.play();

        })
        this._audio.addEventListener("timeupdate", () => {
            const { duration, currentTime } = this._audio;
            if (!duration || this._isSeeking) return;
            this._runTime.textContent = Math.floor(currentTime);
            this._progress.value = currentTime / duration * 100;
        })
        this._audio.addEventListener("ended", () => {
            if (this._isRepeat) {
                this._audio.play();
            } else if (this._isRandom) {
                let pool = this._songs.map((song) => {
                    return song.id;
                })

                if (pool.length === 0) {
                    pool = this._songs.map((song) => {
                        return song.id;
                    })
                }
                const index = Math.floor(Math.random() * pool.length);
                const value = pool[index];
                pool.splice(index, 1);
                this._currenIndex = value;
                this.render();
                this._audio.play();


            } else {
                this.handleControll(this._NEXT);
                this._audio.play();
            }
        })


        this._progress.addEventListener("mousedown", () => {
            this._isSeeking = true;
        })
        this._progress.addEventListener("mouseup", (e) => {
            this._isSeeking = false;
            const nextProgess = e.target.value;
            const nextDuration = nextProgess / 100 * this._audio.duration;
            this._audio.currentTime = nextDuration;
            this._audio.play();
        })

        this._repeat.addEventListener("click", () => {
            this._isRepeat = !this._isRepeat;
            localStorage.setItem("isRepeat", this._isRepeat);
            this._repeat.classList.toggle("active", this._isRepeat);
        })

        this._random.addEventListener("click", () => {
            this._isRandom = !this._isRandom;
            localStorage.setItem("isRandom", this._isRandom);
            this._random.classList.toggle("active", this._isRandom);

        })

        //render danh sách nhạc
        this.render();
        this._repeat.classList.toggle("active", this._isRepeat);
        this._random.classList.toggle("active", this._isRandom);
    },
    render() {
        this._playingName.textContent = this.getCurrenSong().name;
        this._audio.src = this.getCurrenSong().path;

        this._audio.addEventListener("loadedmetadata", () => {
            this._durationSong.textContent = Math.floor(this._audio.duration);
        });
        // const { duration, currentTime } = this._audio;
        // if (!duration || this._isSeeking) return;
        // this._audio.play();
        const htmlSongs = this._songs.map((song, index) => {
            return `<div id = "${song.id}" class="song ${this._currenIndex === index ? "active" : ""}">
                <div class="thumb" style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg');"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.artist}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        }).join("");
        this._playlist.innerHTML = htmlSongs;
    }
}

player.init();