import WavesController from './WavesController';
import RangeSlider from './RangeSlider';

// RangeSlider
// const $slider = document.querySelector('.range-slider');
// const rs = new RangeSlider({ $slider });

// Controller
const $wrapper = document.querySelector('.glass-water');
const w = new WavesController({ $wrapper });
window.w = w;
