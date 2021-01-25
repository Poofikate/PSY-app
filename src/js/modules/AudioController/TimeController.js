export default class TimeController {
  constructor(options) {
    this.$timeForm = options.$timeForm;
    this.$timer = options.$timer;
    this.timer = options.timer;

    this.init();
  }

  init() {
    const $timeOnLoad = this.$timeForm.querySelector('input:checked');
    const timeOnLoad = $timeOnLoad.getAttribute('data-time');

    this.setTime(timeOnLoad);

    this.$timeForm.addEventListener('change', (e) => {
      const time = e.target.getAttribute('data-time');
      this.setTime(time);
      this.timer.stop();
    });
  }

  setTime(value) {
    this.$timer.value = `${value}:00`;
  }
}
