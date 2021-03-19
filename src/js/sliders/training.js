import Swiper from 'swiper/swiper-bundle.min';

const $slider = document.querySelector('.modal-train-slider');

if ($slider) {
  const sliderInstance = new Swiper($slider, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 500,
    centeredSlides: true,
    centeredSlidesBounds: true,
    centerInsufficientSlides: true,
    autoHeight: true,

    // effect: 'fade',
    // fadeEffect: {
    //   crossFade: true,
    // },

    pagination: {
      el: '.modal-train-pagination',
      type: 'bullets',
      clickable: true,
    },
  });
}
