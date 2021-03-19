import Plyr from 'plyr';

const _instances = {};

export default class Player {
  constructor(options) {
    this.$container = options.$container;
    this.$player = options.$player;
    this.$times = this.$container.querySelectorAll('.j_current');
    this.$duration = this.$container.querySelector('.j_duration');
    this.$currentTime = null;
    this.id = this.$player.getAttribute('id');
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
    this.mql = window.matchMedia('(orientation: landscape)');

    // callbacks
    this.endCallback = () => {};

    this.init();
  }

  init() {
    this.hideControl(this.controls.pause);

    this.player = new Plyr(this.$player, {
      controls: ['progress', 'current-time'],
      invertTime: false,
      fullscreen: {
        enabled: true,
        container: '.j_player-container',
      },
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
      this.endCallback.apply(this);
      // this.player.currentTime = 0.0;
      // this.player.play();
    });

    this.player.on('play', (event) => {
      this.hideControl(this.controls.start);
      this.showControl(this.controls.pause);

      if (this._type === 'AUDIO') {
        this.startTimerToLocked();
      }
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

    if (this._type === 'AUDIO') {
      document.addEventListener(
        'touchstart',
        this.startTimerToLocked.bind(this)
      );
      document.addEventListener(
        'touchmove',
        this.startTimerToLocked.bind(this)
      );
      document.addEventListener('touchend', this.startTimerToLocked.bind(this));
    }

    this.checkOrientation(this.mql);

    this.mql.addEventListener('change', this.checkOrientation.bind(this));

    _instances[this.id] = this;
  }

  loadMedia() {
    const provider = this.$container.getAttribute('data-provider');
    const type = this.$container.getAttribute('data-type');
    const src = this.$container.getAttribute('data-src');
    const poster = this.$container.getAttribute('data-poster');

    if (src) {
      this.player.source = {
        type: type,
        class: 'j_player',
        sources: [
          {
            src: src,
            provider: provider,
          },
        ],
      };

      if (poster) {
        this.player.poster = poster;
      } else {
        console.error(`Failed Loading Poster! Invalid URL (${poster});`);
      }
    } else {
      console.error(`Failed Loading Video! Invalid URL (${src});`);
    }
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

  checkOrientation(m) {
    if (m.matches) {
      this.$container.classList.add('is-landscape');
    } else {
      this.$container.classList.remove('is-landscape');
    }
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

  static setEndCallback(callback) {
    for (const key in _instances) {
      _instances[key].endCallback = callback;
    }
  }

  static loadMedia() {
    for (const key in _instances) {
      _instances[key].loadMedia();
    }
  }
}

Player.initAll();
window.Player = Player;
