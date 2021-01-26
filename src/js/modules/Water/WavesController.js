import { gsap, Power4, TweenLite } from 'gsap';
import Wave from './Wave';

export default class WavesController {
  constructor(options) {
    this.$wrapper = options.$wrapper;
    this.$canvas = this.$wrapper.querySelector('canvas');
    this.ctx = this.$canvas.getContext('2d');

    this.max = +this.$canvas.getAttribute('data-max');
    this.current = +this.$canvas.getAttribute('data-current');

    this.$max = document.querySelector('.glass-size--normal');
    this.$current = document.querySelector('.glass-size--current');
    this.$maxValue = this.$max.querySelector('.glass-size__value em');
    this.$currentValue = this.$current.querySelector('.glass-size__value em');

    this.vw = this.$wrapper.getBoundingClientRect().width;
    this.vh = this.$wrapper.getBoundingClientRect().height;
    this.resolution = window.devicePixelRatio || 1;
    this.resized = false;
    this.waves = [];

    this.mh = 233;
    this.border = 160;

    this.maxColor = this.$canvas.getAttribute('data-max-color');
    this.currentColor = this.$canvas.getAttribute('data-current-color');

    this.init();
  }

  init() {
    // this.height = this.convertValueToHeight(this.current);

    this.resizeCanvas();

    this.createWave({
      fillStyle: this.currentColor,
      height: 0,
    });

    this.changeWave(this.current);
    this.checkHeight();

    this.setValue(this.$currentValue, this.current);
    this.setValue(this.$maxValue, this.max);

    window.addEventListener('resize', () => {
      this.resized = true;
    });

    gsap.ticker.add(this.update.bind(this));
  }

  createWaves() {}

  update() {
    var len = this.waves.length;

    if (this.resized) {
      this.resizeCanvas();

      for (var i = 0; i < len; i++) {
        this.waves[i].resize(this.vw, this.vh);
      }

      this.resized = false;
    }

    this.ctx.clearRect(0, 0, this.vw, this.vh);
    this.ctx.globalCompositeOperation = 'soft-light';

    for (let i = 0; i < len; i++) {
      this.waves[i].draw();
    }
  }

  createWave(options) {
    options.width = this.vw;
    options.waveHeight = this.vh - options.height;
    options.y = this.vh;

    const wave = new Wave(this.ctx, options);

    this.waves.push(wave);
  }

  resizeCanvas() {
    this.vw = this.$wrapper.getBoundingClientRect().width;
    this.vh = this.$wrapper.getBoundingClientRect().height;

    this.$canvas.width = this.vw * this.resolution;
    this.$canvas.height = this.vh * this.resolution;

    this.$canvas.style.width = this.vw + 'px';
    this.$canvas.style.height = this.vh + 'px';

    this.ctx.scale(this.resolution, this.resolution);
  }

  changeWave(value, duration = 2) {
    this.height = this.convertValueToHeight(value);

    this.checkHeight();

    gsap.to(this.waves[0], duration, {
      height: this.height,
      waveHeight: this.vh - this.height,
      ease: Power4.easeInOut,
    });

    this.setValue(this.$currentValue, value);
  }

  convertValueToHeight(value) {
    let height = (this.mh * value) / this.max;

    if (height > this.mh) height = this.mh;
    if (height < 0) height = 0;

    return height;
  }

  checkHeight() {
    if (this.height > this.border) {
      this.$max.classList.add('hidden');
    } else {
      this.$max.classList.remove('hidden');
    }
  }

  setValue($num, value) {
    const obj = { val: +$num.innerHTML.toString().replace(',', '.') };

    TweenLite.to(obj, 1, {
      val: value,
      onUpdate: () => {
        const newValue = fixValue(obj.val);
        $num.innerHTML = newValue;
      },
    });

    this.current = value;
  }
}

function fixValue(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error('Value is not "string" or "number" !');
  }
  let newValue = (Number(value.toFixed(1)) * 10) / 10;
  newValue = newValue.toString().replace('.', ',');

  return newValue;
}
