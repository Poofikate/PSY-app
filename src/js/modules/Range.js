import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

class Range {
  constructor($slider, $title, options) {
    this.$slider = $slider;
    this.$title = $title;

    this.slider = noUiSlider;
    this.options = options;

    // callbacks
    this.onUpdateCallback = () => {};

    this.init();
  }

  init() {
    this.slider.create(this.$slider, {
      start: this.options.start,
      connect: [true, false],
      step: this.options.step,
      range: {
        min: this.options.min,
        max: this.options.max,
      },
      format: wNumb({
        decimals: 0,
      }),
    });

    this.$slider.noUiSlider.on('update', (values, handle) => {
      const value = +values[0];
      const hh = Math.floor(value / 60);
      let mm = value % 60;
      if (mm < 10) mm = '0' + mm;
      const newValue = `${hh}:${mm}`;
      if (this.$title) this.$title.textContent = newValue;
    });

    this.$slider.noUiSlider.on('change', (values, handle) => {
      const value = +values[0];
      const hh = Math.floor(value / 60);
      let mm = value % 60;
      if (mm < 10) mm = '0' + mm;
      const newValue = `${hh}:${mm}`;

      // eslint-disable-next-line no-useless-call
      this.onUpdateCallback.apply(this, [newValue]);
    });
  }

  setUpdateCallback(callback) {
    this.onUpdateCallback = callback;
  }
}

const $slider = document.querySelector('.j_meditation-range');
if ($slider) {
  const $title = document.querySelector('.j_meditation-range-time');
  const step = +$slider.getAttribute('data-step') || 5;
  const min = +$slider.getAttribute('data-min') || 0;
  const max = +$slider.getAttribute('data-max') || 1440;
  const start = +$slider.getAttribute('data-start') || 720;

  const range = new Range($slider, $title, {
    step,
    min,
    max,
    start,
  });

  window.range = range;
}
