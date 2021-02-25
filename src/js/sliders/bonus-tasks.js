import Swiper from 'swiper/swiper-bundle.min';

const $sliders = document.querySelectorAll('.bonus-tasks-slider');
if ($sliders.length) {
  $sliders.forEach(($slider) => {
    const slider = new Swiper($slider, {
      slidesPerView: 'auto',
      spaceBetween: 14,
      watchOverflow: true,
    });
  });
}
