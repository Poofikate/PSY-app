import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

class MoodRange {
  constructor($slider, $title, options) {
    this.$slider = $slider;
    this.$title = $title;

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
    });

    this.$slider.noUiSlider.on('update', (values, handle) => {
      const value = +values[0];
      if (this.$title) this.$title.textContent = `${value}:00`;
    });
  }
}

const $slider = document.querySelector('.j_meditation-range');
if ($slider) {
  const $title = document.querySelector('.j_meditation-range-time');
  const moodSlider = new MoodRange($slider, $title, {
    step: 1,
    min: 0,
    max: 23,
    start: 7,
  });
}
