// default
import './../sass/styles.scss';
import './modules/_svg';

// polyfills
import 'babel-polyfill';
import './modules/polyfills/forEach';
import './modules/polyfills/closest';

// modules
import './modules/ClickWaves';
import './modules/Menu';
import './modules/Modal';
import './modules/mask';
import './modules/datepicker';
import './modules/TabsController';
import './modules/Dropdown';
import './modules/Select';
import './modules/Accordion';
import './modules/Tooltip';
import './modules/Range';

// sliders
import './sliders/bonus-tasks';

const transitionReady = () => {
  document.body.classList.add('transition-ready');
};
window.addEventListener('load', transitionReady);
window.addEventListener('load', updateDeviceHeight);
window.addEventListener('resize', updateDeviceHeight);

// window.addEventListener('load', showViewport);
// window.addEventListener('resize', showViewport);

function updateDeviceHeight() {
  // We execute the same script as before
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function showViewport() {
  const id = '__VIEWPORT__';
  let $viewport = document.getElementById(id);

  if (!$viewport) {
    $viewport = document.createElement('div');

    $viewport.setAttribute('id', id);

    $viewport.style.position = 'fixed';
    $viewport.style.zIndex = '9999';
    $viewport.style.top = '15px';
    $viewport.style.right = '15px';
    $viewport.style.backgroundColor = '#fff';
    $viewport.style.borderRadius = '6px';
    $viewport.style.padding = '10px';
    $viewport.style.fontWeight = '500';
    $viewport.style.boxShadow = '0 0 15px rgba(0,0,0, 0.15';

    document.body.appendChild($viewport);
  }

  $viewport.innerHTML = `${window.innerWidth} / ${window.innerHeight}`;
}
