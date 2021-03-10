import Swiper from 'swiper/swiper-bundle.min';

const $slider = document.querySelector('.modal-animal-slider');
let animalsSlider = null;

if ($slider) {
  animalsSlider = new Swiper($slider, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 500,
    centeredSlides: true,
    centeredSlidesBounds: true,
    centerInsufficientSlides: true,
    watchOverflow: true,
    followFinger: false,
    shortSwipes: false,
    longSwipes: false,

    navigation: {
      prevEl: '.modal-animal-slider-prev',
      nextEl: '.modal-animal-slider-next',
    },

    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
  });

  window.animalsSlider = animalsSlider;
}

export { animalsSlider };
