import Plyr from 'plyr';

export default class Player {
  constructor(options) {
    this.$container = options.$container;
    this.$player = options.$player;
    this.$times = this.$container.querySelectorAll('.j_current');
    this.$duration = this.$container.querySelector('.j_duration');
    this.$currentTime = null;
    this.duration = '';
    this.controls = {};
    this.controls.start = this.$container.querySelector('.j_start');
    this.controls.pause = this.$container.querySelector('.j_pause');
    this.controls.stop = this.$container.querySelector('.j_stop');

    this.lockTimeout = null;
    this.durationlockTimeout =
      +this.$container.getAttribute('data-lock-timeout') || 10000;

    this._type = this.$player.tagName;
    this._isLocked = false;

    this.player = null;

    this.init();
  }

  init() {
    this.hideControl(this.controls.pause);

    this.player = new Plyr(this.$player, {
      controls: ['progress', 'current-time'],
      invertTime: false,
    });

    this.$currentTime = this.$container.querySelector('.plyr__time--current');

    this.player.on('loadeddata', (event) => {
      this.$times.forEach(($time) => {
        $time.textContent = '00:00';
      });
      this.duration = this.$currentTime.textContent;
      this.$duration.textContent = this.duration;
    });

    this.player.on('error', (event) => {
      console.error(`Failed loaded '${this._type}'!`, this.$player);
    });

    this.player.on('ended', (event) => {
      this.player.pause();
      this.player.currentTime = 0.0;
      this.player.play();
    });

    this.player.on('play', (event) => {
      this.hideControl(this.controls.start);
      this.showControl(this.controls.pause);

      this.startTimerToLocked();
    });

    this.player.on('pause', (event) => {
      this.hideControl(this.controls.pause);
      this.showControl(this.controls.start);

      this._isLocked = false;
    });

    this.player.on('timeupdate', (event) => {
      this.$times.forEach(($time) => {
        $time.textContent = this.$currentTime.textContent;
      });

      if (this._isLocked) {
        this.$container.classList.add('locked');
      } else {
        this.$container.classList.remove('locked');
      }
    });

    this.controls.start.addEventListener('click', () => this.player.play());
    this.controls.pause.addEventListener('click', () => this.player.pause());
    this.controls.stop.addEventListener('click', () => this.player.stop());

    document.addEventListener('touchstart', this.startTimerToLocked.bind(this));
    document.addEventListener('touchmove', this.startTimerToLocked.bind(this));
    document.addEventListener('touchend', this.startTimerToLocked.bind(this));
  }

  showControl(control) {
    control.classList.remove('hidden');
  }

  hideControl(control) {
    control.classList.add('hidden');
  }

  startTimerToLocked() {
    this._isLocked = false;
    if (this.lockTimeout) clearTimeout(this.lockTimeout);

    this.lockTimeout = setTimeout(() => {
      this._isLocked = true;
    }, 5000);
  }

  static initAll() {
    const $containers = document.querySelectorAll('.j_player-container');
    if ($containers.length) {
      $containers.forEach(($container) => {
        const $player = $container.querySelector('.j_player');
        const player = new Player({
          $container,
          $player,
        });
      });
    }
  }
}

Player.initAll();
window.Player = Player;