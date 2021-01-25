import TimerController from './TimerController';

export default class AudioList {
  constructor(options) {
    this.$form = document.querySelector('.j_audio-form');

    this.audios = options.audios;
    this.mute = options.mute;

    this._isMutedPlay = false;

    this.init();
  }

  init() {
    this.checkSelectedAudioOnLoad();
    this.checkMuted();

    this.$form.addEventListener('change', (e) => {
      this.currentAudio = this.getCurrentAudio(e.target);

      this.checkMuted();

      if (this.tc._isPlaying) {
        this.audios.forEach((audio) => audio.stop());
        this.currentAudio.play(this.tc.minutes);

        if (this._isMutedPlay) {
          this.currentAudio.audio.volume = 0;
        }
      }
    });

    this.mute.$wrapper.addEventListener('change', (e) => {
      console.log(e.target);
      console.log(this.currentAudio);

      if (e.target.checked) {
        this.currentAudio.audio.volume = 0;
        this._isMutedPlay = true;
      } else {
        this.currentAudio.audio.volume = 1;
        this._isMutedPlay = false;
      }
    });
  }

  getCurrentAudio($radio) {
    const currentAudio = this.audios.find((audio) => audio.$radio === $radio);
    return currentAudio;
  }

  checkSelectedAudioOnLoad() {
    const $checked = this.$form.querySelector('input:checked');

    if ($checked) {
      this.currentAudio = this.getCurrentAudio($checked);
    } else {
      const mutedAudio = this.audios.find((audio) => audio._isMuted);
      mutedAudio.$radio.checked = true;
      mutedAudio.$radio.setAttribute('checked', '');

      this.currentAudio = this.getCurrentAudio(mutedAudio.$radio);
    }
  }

  checkMuted() {
    if (this.currentAudio._isMuted) {
      this.mute.$wrapper.classList.add('hidden');
    } else {
      this.currentAudio.audio.volume = 1;
      this.mute.$wrapper.classList.remove('hidden');
    }
  }
}
