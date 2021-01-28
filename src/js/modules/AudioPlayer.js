import Plyr from 'plyr';
import formatTime from 'plyr/src/js/utils/time';
import noUiSlider from 'nouislider';
import EventEmitter from './helpers/EventEmitter';

const _instances = {};
const eventEmitter = new EventEmitter();

class AudioPlayer {
  constructor($song) {
    this.$song = $song;
    this.$audio = this.$song.querySelector('.music-song__audio');
    this.$slider = this.$song.querySelector('.range-slider');
    this.$play = this.$song.querySelector('.music-song__play');
    this.$mute = this.$song.querySelector('.music-song__mute');
    this.$stop = this.$song.querySelector('.music-song__stop');

    this.id = this.$song.getAttribute('id');
    this.oldVolume = 1;

    // callbacks
    this.onPauseCallback = () => {};

    this.init();
  }

  init() {
    this.audio = new Plyr(this.$audio, {
      controls: ['current-time', 'progress'],
    });

    // this.audio.on('ready', (event) => this.updateTimeNode());
    this.audio.on('pause', (event) => this.onPauseCallback.apply(this));

    this.$play.addEventListener('click', () => this.togglePlay());
    this.$mute.addEventListener('click', () => this.toggleMute());
    this.$stop.addEventListener('click', () => this.stop());

    this.volumeSlider = new RangeSlider(this.$slider);

    this.$slider.noUiSlider.on('update', (values, handle) => {
      const value = +values[0];

      this.audio.volume = value;
      value === 0 ? this.mute(false) : this.unmute(false);
    });

    eventEmitter.subscribe(
      'player:start',
      (id) => id !== this.id && this.stop()
    );

    _instances[this.id] = this;
  }

  togglePlay() {
    this.audio.playing ? this.pause() : this.play();
  }

  play() {
    if (this.audio.playing) return false;

    eventEmitter.emit('player:start', this.id);
    this.audio.play();
    this.$song.classList.add('playing');
    this.$play.classList.add('active');
  }

  pause() {
    if (this.audio.paused) return false;

    this.audio.pause();
    this.$play.classList.remove('active');
  }

  stop() {
    if (this.audio.stopped) return false;

    this.audio.stop();
    this.$song.classList.remove('playing');
    this.$play.classList.remove('active');
  }

  mute(volume = true) {
    this.audio.muted = true;
    this.$mute.classList.add('active');

    if (volume) {
      this.oldVolume = this.audio.volume;
    }

    if (volume) this.$slider.noUiSlider.set([0, null]);
  }

  unmute(volume = true) {
    this.audio.muted = false;
    this.$mute.classList.remove('active');
    if (volume) this.$slider.noUiSlider.set([this.oldVolume, null]);
  }

  toggleMute() {
    this.audio.muted ? this.unmute() : this.mute();
  }

  updateTimeNode() {
    this.$time = this.$song.querySelector('.plyr__time');

    this.setObserverOnTimeNode();
  }

  setObserverOnTimeNode() {
    // eslint-disable-next-line no-undef
    const observer = new MutationObserver((mutations) => {
      const target = mutations[0].target;
      target.textContent = target.textContent.replace('-', '');
    });

    observer.observe(this.$time, { childList: true });
  }

  static setOnPauseCallback(callback) {
    for (const key in _instances) {
      _instances[key].onPauseCallback = callback;
    }
  }
}

class RangeSlider {
  constructor($slider) {
    this.$slider = $slider;
    this.$wrapper = document.querySelector('.range-slider-wrapper');

    this.options = {
      min: +this.$slider.getAttribute('data-min'),
      max: +this.$slider.getAttribute('data-max'),
      start: +this.$slider.getAttribute('data-start'),
      to: +this.$slider.getAttribute('data-to'),
      step: +this.$slider.getAttribute('data-step'),
    };

    this.slider = noUiSlider;

    this.init();
  }

  init() {
    this.slider.create(this.$slider, {
      start: this.options.start,
      connect: true,
      step: this.options.step,
      range: {
        min: this.options.min,
        max: this.options.max,
      },
    });
  }
}

// --

const $songs = document.querySelectorAll('.music-song');
if ($songs.length) $songs.forEach(($song) => new AudioPlayer($song));

window.AudioPlayer = AudioPlayer;
