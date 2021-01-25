import Timer from 'easytimer.js';

export default class TimerController {
  constructor(options) {
    this.$timer = document.querySelector('.j_time');

    this.AudioList = options.AudioList;
    this.minutes = +this.$timer.value.split(':')[0];
    this.buttons = {
      $start: document.querySelectorAll('.j_start'),
      $pause: document.querySelectorAll('.j_pause'),
    };

    this._isPlaying = false;

    // callbacks
    this.onTargetAchieved = function() {};

    this.init();
  }

  init() {
    this.toggleButton('$start');

    this.timer = new Timer();

    this.timer.addEventListener('secondsUpdated', (instance) => {
      const time = instance.detail.timer.getTimeValues();
      const minutes = time.minutes;
      const seconds = time.seconds;

      this.$timer.value = `${time.toString(['minutes', 'seconds'])}`;

      if (minutes === 0 && seconds <= 2) {
        this.AudioList.currentAudio.turnVolume(seconds);
      }
    });

    this.timer.addEventListener('started', (instance) => {
      this.toggleButton('$pause');
      this.playMusic();
    });

    this.timer.addEventListener('paused', (instance) => {
      this.toggleButton('$start');
      this.stopMusic();
    });

    this.timer.addEventListener('stopped', (instance) => {
      this.toggleButton('$start');
      this.stopMusic();
    });

    this.timer.addEventListener('targetAchieved', (instance) => {
      this.stopMusic();
      this.resetTime();

      this.onTargetAchieved.apply(this);
    });

    if (this.buttons.$start.length) {
      this.buttons.$start.forEach(($start) =>
        $start.addEventListener('click', () => this.start())
      );
    }
    if (this.buttons.$pause.length) {
      this.buttons.$pause.forEach(($pause) =>
        $pause.addEventListener('click', () => this.pause())
      );
    }
  }

  start() {
    this.updateTime();

    this.timer.start({
      countdown: true,
      startValues: { seconds: this.minutes * 60 },
    });
  }

  pause() {
    this.timer.pause();
  }

  playMusic() {
    this.AudioList.currentAudio.play(this.minutes);

    if (this.AudioList._isMutedPlay) {
      this.AudioList.currentAudio.audio.volume = 0;
    }

    this._isPlaying = true;
  }

  stopMusic() {
    if (this._isPlaying) {
      this.AudioList.currentAudio.stop();
      this._isPlaying = false;
    }
  }

  updateTime() {
    this.minutes = +this.$timer.value.split(':')[0];
  }

  resetTime() {
    this.$timer.value = `${this.minutes}:00`;
  }

  toggleButton(current) {
    for (const key in this.buttons) {
      const $btns = this.buttons[key];
      $btns.forEach(($btn) => $btn.classList.add('hidden'));
    }

    this.buttons[current].forEach(($btn) => $btn.classList.remove('hidden'));
  }

  setTargetAchievedCallback(callback) {
    this.onTargetAchieved = callback;
  }
}
