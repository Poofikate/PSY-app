import Plyr from 'plyr';
export default class Audio {
  constructor($wrapper) {
    this.$wrapper = $wrapper;
    this.$radio = this.$wrapper.querySelector('input[type="radio"]');
    this.$audio = this.$wrapper.querySelector('audio');

    this.id = this.$wrapper.getAttribute('data-id');

    this._isMuted = !this.$audio;
    this._isLoaded = false;
    this._isTurned = false;

    if (this._isMuted) return false;

    this.init();
  }

  init() {
    this.audio = new Plyr(this.$audio, {
      controls: [],
    });

    this.audio.on('ready', (event) => {
      this.audio.volume = 1;
      this._isLoaded = true;
    });

    this.audio.on('error', (event) => {
      console.error('Failed loaded audio!', this.$audio);
    });

    this.audio.on('ended', (event) => {
      this.audio.pause();
      this.audio.currentTime = 0.0;
      this.audio.play();
    });
  }

  play() {
    if (this._isMuted) return false;
    if (this._isLoaded) {
      this.audio.volume = 1;
      this.audio.play();
    }
  }

  stop() {
    if (this._isMuted) return false;
    this.audio.pause();
    this.audio.currentTime = 0.0;

    if (this.setInterval) clearInterval(this.setInterval);
  }

  turnVolume(seconds) {
    if (this._isMuted) return false;
    if (this._isTurned) return false;

    const interval = seconds * 10;

    this.setInterval = setInterval(() => {
      if (this.$audio.volume - 1 / interval <= 0) {
        this.audio.volume = 0;
        return false;
      }

      this.audio.volume = this.audio.volume - (1 / interval) * seconds;
    }, interval * 10);

    this._isTurned = true;
  }
}
