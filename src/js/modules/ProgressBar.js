export default class ProgressBar {
  constructor($el) {
    this.$el = $el;
    this.$circle = this.$el.querySelector('circle');
    this.r = this.$circle.getAttribute('r');
    this.c = Math.PI * (this.r * 2);

    this.percent = +this.$el.getAttribute('data-percent');

    this.init();
  }

  init() {
    this.checkPercent();
    this.setProgress();
  }

  checkPercent() {
    if (!this.percent) this.percent = 100;
    if (this.percent < 0) this.percent = 0;
    if (this.percent > 100) this.percent = 100;
  }

  setProgress() {
    this.progress = ((100 - this.percent) / 100) * this.c;

    this.$el.style.strokeDasharray = this.c;
    this.$el.style.strokeDashoffset = this.progress;
  }
}

const $progresses = document.querySelectorAll('.j_progressBar');
if ($progresses.length)
  $progresses.forEach(($progress) => new ProgressBar($progress));
