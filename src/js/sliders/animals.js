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

    on: {
      afterInit: (swiper) => {
        activeLastControl(swiper);
      },
      slideChange: (swiper) => {
        activeLastControl(swiper);
      },
    },
  });

  window.animalsSlider = animalsSlider;
}

function activeLastControl(swiper) {
  const $activeSlide = swiper.slides[swiper.activeIndex];
  const id = $activeSlide.getAttribute('data-animal');
  const $controls = $activeSlide.querySelectorAll('[data-control]');
  const $lastControl = $controls[$controls.length - 1];
  const lastID = $lastControl.getAttribute('data-control');

  window._animals && window._animals[id].set(lastID);
}

export { animalsSlider };
