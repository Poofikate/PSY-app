import Timer from 'easytimer.js';

export default class TimerController {
  constructor(options) {
    this.$timer = options.$timer;
    this.$contents = options.$contents;

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

    this.updateValue();
    this.checkContent();

    this.timer.addEventListener('secondsUpdated', (instance) => {
      this.updateValue();
      this.checkContent();
    });
    this.timer.addEventListener('stopped', (instance) => {
      this.updateValue();
      this.checkContent();
    });
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
  const $contents = document.querySelectorAll('[data-time]');
  const timer = new TimerController({
    $timer,
    $contents,
  });

  window.timer = timer;
}
