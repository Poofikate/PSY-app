import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

export default class RangeSlider {
  constructor(options) {
    this.$slider = options.$slider;
    this.$wrapper = document.querySelector('.range-slider-wrapper');

    this.options = {
      min: +this.$slider.getAttribute('data-min'),
      max: +this.$slider.getAttribute('data-max'),
      start: +this.$slider.getAttribute('data-start'),
      to: +this.$slider.getAttribute('data-to'),
      step: +this.$slider.getAttribute('data-step'),
    };

    this.slider = noUiSlider;

    this.init();
  }

  init() {
    this.slider.create(this.$slider, {
      start: this.options.start,
      connect: true,
      step: this.options.step,
      range: {
        min: this.options.min,
        max: this.options.max,
      },
      format: wNumb({
        decimals: 2,
      }),
      pips: {
        mode: 'steps',
        stepped: false,

        format: wNumb({
          decimals: 1,
          mark: ',',
        }),
      },
    });

    this.$pips = this.$wrapper.querySelectorAll('.noUi-value');
    this.$markers = this.$wrapper.querySelectorAll('.noUi-marker');

    this.removeMarkers();

    this.$slider.noUiSlider.on('update', (values, handle) => {
      const value = +values[0];

      this.changePips(value);
    });

    this.$pips.forEach(($pip) => {
      $pip.addEventListener('click', () => this.setValue($pip));
    });
  }

  removeMarkers() {
    this.$markers.forEach(($mark) => $mark.remove());
  }

  changePips(value) {
    if (this.$pips.length) {
      this.$pips.forEach(($pip) => {
        const pipValue = +$pip.getAttribute('data-value');

        const isCurrent = pipValue === value;
        const isLeft = pipValue === +(value - this.options.step).toFixed(1);
        const isRight = pipValue === +(value + this.options.step).toFixed(1);

        $pip.classList.remove('large');
        $pip.classList.remove('medium');

        if (isCurrent) $pip.classList.add('large');
        if (isLeft || isRight) $pip.classList.add('medium');
      });
    }
  }

  setValue($pip) {
    const value = +$pip.getAttribute('data-value');
    this.$slider.noUiSlider.set(value);
  }
}
