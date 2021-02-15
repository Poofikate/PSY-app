import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

class MoodRange {
  constructor($slider, options) {
    this.$slider = $slider;
    this.slider = noUiSlider;
    this.options = options;

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
      tooltips: wNumb({
        decimals: 0,
        suffix: `/${this.options.max}`,
        encoder: (val) => val,
      }),
    });
  }
}

const $slider = document.querySelector('.j_mood-range');
if ($slider) {
  const moodSlider = new MoodRange($slider, {
    step: 1,
    min: 0,
    max: 10,
    start: 5,
  });
}
