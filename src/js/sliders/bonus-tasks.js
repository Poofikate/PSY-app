import Swiper from 'swiper/swiper-bundle.min';

class SliderController {
  constructor(selector, options) {
    this.$sliders = document.querySelectorAll(selector);
    this.options = options;

    this.instances = [];

    this.initSliders();
  }

  initSliders() {
    if (!this.$sliders.length) return false;

    this.$sliders.forEach(($slider, i) => {
      this.instances[i] = new Swiper($slider, this.options);
    });
  }

  destroySliders() {
    if (this.instances.length) {
      this.instances.forEach((instance) => instance.destroy(true, false));
    }
  }

  updateSliders() {
    if (this.instances.length) {
      this.instances.forEach((instance) => instance.update());
    }
  }
}

const sliderController = new SliderController('.bonus-tasks-slider', {
  slidesPerView: 'auto',
  spaceBetween: 14,
  watchOverflow: true,
});

window.sliderController = sliderController;
