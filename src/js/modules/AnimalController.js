import { animalsSlider } from '../sliders/animals';

export default class AnimalController {
  constructor(options) {
    this.$wrapper = options.$wrapper;
    this.$bottom = options.$bottom;
    this.$button = options.$button;

    this.slider = animalsSlider;

    this._isSelected = false;

    this.init();
  }

  init() {
    this.$button.addEventListener('click', this.select.bind(this));
  }

  select() {
    this.$wrapper.classList.add('active');
    this.disableSlider();

    this._isSelected = true;
  }

  unselect() {
    this.$wrapper.classList.remove('active');
    this.enableSlider();

    this._isSelected = false;
  }

  disableSlider() {
    this.slider.allowTouchMove = false;
  }

  enableSlider() {
    this.slider.allowTouchMove = true;
  }
}

const $wrapper = document.querySelector('.j_animal-wrapper');
if ($wrapper) {
  const $bottom = $wrapper.querySelector('.j_animal-bottom');
  const $button = $wrapper.querySelector('.j_animal-button');

  const animalController = new AnimalController({
    $wrapper,
    $bottom,
    $button,
  });
}
