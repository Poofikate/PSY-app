const $wrapper = document.querySelector('.card');
const $button = document.querySelector('.j_settings');
if ($button) $button.addEventListener('click', toggleControls);

const $times = document.querySelectorAll('[type="time"]');
if ($times.length) {
  $times.forEach(($time) =>
    $time.addEventListener('change', setTime.bind(this))
  );
}

function toggleControls() {
  $wrapper.classList.toggle('settings');
}

function setTime(e) {
  const value = e.target.value;
  if (value) {
    const $wrapper = e.target.closest('label');
    const $value = $wrapper.querySelector('.mode-task-set__time');

    if ($value) {
      $value.textContent = value;
    }
  }
}
