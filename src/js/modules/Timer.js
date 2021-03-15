import Timer from 'easytimer.js';

export default class TimerController {
  constructor(options) {
    this.$timer = options.$timer;
    this.$fakeTimer = options.$fakeTimer;
    this.$contents = options.$contents;
    this.$startArr = options.$start;
    this.$pauseArr = options.$pause;

    this.startValue = this.$timer.value;
    this.startSeconds = this.getSeconds(this.startValue);
    this.time = null;
    this.seconds = null;

    this.init();
  }

  init() {
    this.timer = new Timer({
      startValues: { seconds: this.startSeconds },
    });

    this.update();
    this.hideControl(this.$pauseArr);
    this.showControl(this.$startArr);

    this.timer.addEventListener('secondsUpdated', (instance) => this.update());
    this.timer.addEventListener('stopped', (instance) => this.update());
    this.timer.addEventListener('started', (instance) => {
      this.hideControl(this.$startArr);
      this.showControl(this.$pauseArr);
    });
    this.timer.addEventListener('paused', (instance) => {
      this.hideControl(this.$pauseArr);
      this.showControl(this.$startArr);
    });
    this.$startArr.forEach(($start) =>
      $start.addEventListener('click', () => this.start())
    );
    this.$pauseArr.forEach(($pause) =>
      $pause.addEventListener('click', () => this.pause())
    );
  }

  hideControl($controls) {
    $controls.forEach(($control) => $control.classList.add('hidden'));
  }

  showControl($controls) {
    $controls.forEach(($control) => $control.classList.remove('hidden'));
  }

  update() {
    this.updateValue();
    this.checkContent();

    this.$fakeTimer.textContent = this.$timer.value;
  }

  checkContent() {
    const $filteredContents = [...this.$contents].filter(($content) => {
      const time = $content.getAttribute('data-time');
      const seconds = this.getSeconds(time);

      return seconds <= this.seconds;
    });

    const $currentContent = $filteredContents[$filteredContents.length - 1];

    if ($currentContent) {
      this.$contents.forEach(($img) => $img.classList.remove('active'));
      $currentContent.classList.add('active');
    }
  }

  updateValue() {
    this.time = this.timer.getTimeValues().toString(['minutes', 'seconds']);
    this.seconds = this.getSeconds(this.time);
    this.$timer.value = `${this.time}`;
  }

  getSeconds(string) {
    string = string.split(':');
    return +string[0] * 60 + +string[1];
  }

  start() {
    this.timer.start({
      startValues: { seconds: this.startSeconds },
    });
  }

  pause() {
    this.timer.pause();
  }

  stop() {
    this.timer.stop();
    this.startSeconds = 0;
  }
}

const $timer = document.querySelector('.j_time');
if ($timer) {
  const $fakeTimer = document.querySelector('.j_time-fake');
  const $contents = document.querySelectorAll('[data-time]');
  const $start = document.querySelectorAll('.j_start');
  const $pause = document.querySelectorAll('.j_pause');
  const timer = new TimerController({
    $timer,
    $fakeTimer,
    $contents,
    $start,
    $pause,
  });

  window.timer = timer;
}
