export default class SpeechVisual {
  constructor() {
    this.$itemsParent = document.querySelector('.speech-visual');
    this.$items = [...this.$itemsParent.children];
    this.array = new Uint8Array(this.$items.length * 2);

    this.navigator = window.navigator;

    this._isDestroyed = false;

    this.init();
  }

  init() {
    this._isDestroyed = false;

    if (this.context) return;

    // eslint-disable-next-line no-undef
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();

    this.media = this.navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        this.src = this.context.createMediaStreamSource(stream);
        this.src.connect(this.analyser);
        this.loop();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  loop() {
    if (this._isDestroyed) return false;

    window.requestAnimationFrame(this.loop.bind(this));

    this.analyser.getByteFrequencyData(this.array);

    this.$items.forEach(($item, i) => {
      const height = this.array[i + this.$items.length];

      // if (height / 7 <= 20) height = 0;

      $item.style.minHeight = height / 7 + 'px';
      $item.style.opacity = height / (100 * this.$items.length);
    });
  }

  destroy() {
    this._isDestroyed = true;
    this.src.disconnect(this.analyser);
    this.media = null;
    this.analyser.disconnect();
    this.analyser = null;
    this.src = null;
    this.context.close();
    this.context = null;
  }
}
