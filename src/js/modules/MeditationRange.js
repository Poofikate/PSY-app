import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

class MeditationRange {
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
      if (this.$title) this.$title.textContent = `${value}:00`;
      // eslint-disable-next-line no-useless-call
      this.onUpdateCallback.apply(this, [value]);
    });
  }

  setUpdateCallback(callback) {
    this.onUpdateCallback = callback;
  }
}

const $slider = document.querySelector('.j_meditation-range');
if ($slider) {
  const $title = document.querySelector('.j_meditation-range-time');
  const meditationRange = new MeditationRange($slider, $title, {
    step: 1,
    min: 0,
    max: 23,
    start: 7,
  });

  window.meditationRange = meditationRange;
}
