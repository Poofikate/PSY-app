import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

const media = window.matchMedia('(max-width: 900px)').matches;

class Progress {
  constructor(options) {
    this.$progress = options.$progress;
    this.$value = this.$progress.querySelector('.walk-progress__filter-value');
    this.$animal = this.$progress.querySelector('.walk-progress-animal');
    this.$animalImgs = this.$animal.querySelectorAll(
      '.walk-progress-animal__img'
    );
  }

  setAnimal(i) {
    this.$animalImgs.forEach(($img) => $img.classList.remove('active'));
    this.$animalImgs[i].classList.add('active');
  }
}

const $progress = document.querySelector('.j_progress');
let progress = null;

if ($progress) {
  progress = new Progress({ $progress });
}

const defaultText = ' мин<i>Показатель, который надо достигнуть</i>';
export default class RangeSlider {
  constructor(options) {
    this.$slider = options.$slider;
    this.progress = options.progress;
    this.$wrapper = document.querySelector('.range-slider-wrapper');

    this.options = {
      min: +this.$slider.getAttribute('data-min'),
      max: +this.$slider.getAttribute('data-max'),
      start: +this.$slider.getAttribute('data-start'),
      to: +this.$slider.getAttribute('data-to'),
      step: +this.$slider.getAttribute('data-step'),
      target: +this.$slider.getAttribute('data-target-value'),
      offset: +this.$slider.getAttribute('data-offset'),
      text: this.$slider.getAttribute('data-text') || defaultText,
    };

    this.ratio = media ? 5 : 7;

    this.paddingLeft = Math.floor(this.options.max / this.ratio);
    this.paddingRight = Math.floor(this.options.max / (this.ratio * 2));

    this.slider = noUiSlider;

    // callbacks
    this.onTargetSuccessCallback = () => {};
    this.onTargetChangeCallback = () => {};

    this.init();
  }

  init() {
    if (this.$slider.noUiSlider) this.$slider.noUiSlider.destroy();

    this.slider.create(this.$slider, {
      start: this.options.start,
      step: this.options.step,
      connect: [true, false],

      range: {
        min: 0,
        max: this.options.max + this.paddingRight,
      },
      padding: [this.options.min, this.paddingRight],
      tooltips: wNumb({
        decimals: 0,
        suffix: '</br> мин',
        encoder: (val) => val + this.options.offset,
      }),
      pips: {
        mode: 'values',
        values: [this.options.target],
        stepped: true,
        format: wNumb({
          decimals: 0,
          suffix: ` мин ${this.options.text}`,
          encoder: (a) => a + this.options.offset,
        }),
      },
    });

    if (this.options.target > this.options.max / 2) {
      this.$wrapper.classList.add('bigger-half');
    } else {
      this.$wrapper.classList.remove('bigger-half');
    }

    this.$slider.noUiSlider.on('update', (values, handle) => {
      const value = +values[0];
      const width = (value * 100) / (this.options.max + this.paddingRight);

      this.progress.$animal.style.left = `${width}%`;

      if (value + this.paddingRight === this.options.max + this.paddingRight) {
        this.progress.$value.style.maxWidth = `100%`;
      } else {
        this.progress.$value.style.maxWidth = `${width}%`;
      }

      if (value < this.options.target) {
        this.progress.setAnimal(0);
      }

      if (value === this.options.target) {
        this.progress.setAnimal(1);
        this.onTargetSuccessCallback.apply(this);
      }

      if (value > this.options.target) {
        this.progress.setAnimal(2);
      }
    });

    this.$slider.noUiSlider.on('change', (values, handle) => {
      this.onTargetChangeCallback.apply(this);
    });
  }

  setOnTargetSuccessCallback(callback) {
    this.onTargetSuccessCallback = callback;
  }

  setOnTargetChangeCallback(callback) {
    this.onTargetChangeCallback = callback;
  }

  static init() {
    const $slider = document.querySelector('.range-slider');

    if ($slider) {
      const rs = new RangeSlider({ $slider, progress });

      window.rs = rs;
    }
  }
}

RangeSlider.init();

window.RangeSlider = RangeSlider;
