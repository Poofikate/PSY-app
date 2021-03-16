const $wrapper = document.querySelector('.card');
const $button = document.querySelector('.j_settings');
if ($button) $button.addEventListener('click', toggleControls);

function toggleControls() {
  $wrapper.classList.toggle('settings');
}
