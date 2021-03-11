import Audio from './Audio';
import AudioList from './AudioList';
import TimerController from './TimerController';
import TimeController from './TimeController';

// Audio
const $audios = document.querySelectorAll('.j_audio');
let audios = null;
if ($audios.length) {
  audios = Array.from($audios).map(($audio) => new Audio($audio));
}

// Mute
const $mute = document.querySelector('.j_mute');
let mute = null;
if ($mute) {
  mute = new Audio($mute);
}

// AudioList
const ap = new AudioList({ audios, mute });

// TimerController
const tc = new TimerController({ AudioList: ap });
ap.tc = tc;

window.tc = tc;

// TimeController
const $timeForm = document.querySelector('.j_times');
const rs = new TimeController({
  $timeForm,
  $timer: tc.$timer,
  timer: tc.timer,
});
