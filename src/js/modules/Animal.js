import mojs from '@mojs/core/build/mo';

export default class Animal {
  constructor($el) {
    this.$el = $el;
    this.$controls = this.$el.querySelectorAll('[data-control]');
    this.$imgsWrap = document.querySelector('[data-animals]');
    this.$imgsContainer = document.querySelector('[data-animals-wrap]');
    this.$imgs = this.$el.querySelectorAll('[data-img]');

    this.delay = 300;

    this.init();
  }

  init() {
    this.onInit();

    if (this.$controls.length) {
      this.$controls.forEach(($control) =>
        $control.addEventListener('change', this.change.bind(this))
      );
    }
  }

  onInit() {
    this.initAnimation();

    const $checked = [...this.$controls].find(($control) => $control.checked);
    if ($checked) {
      const id = $checked.getAttribute('data-control');
      this.openImg(id);
    }
  }

  initAnimation() {
    this.destroyAnimation();

    this.timeline = new mojs.Timeline();

    const imgWrapRect = this.$imgsWrap.getBoundingClientRect();
    const radius = imgWrapRect.width;

    this.burst = new mojs.Burst({
      parent: this.$imgsWrap,
      top: '50%',
      left: '50%',
      radius: { 0: radius - 50 },
      count: 20,
      // angle: { 0: 90 },
      // opacity: { 1: 0 },

      children: {
        shape: 'line',
        fill: 'white',
        radius: { 20: 0 },
        scale: 1,
        stroke: 'white',
        strokeWidth: 3,
        // strokeLinecap: 'round',
        duration: 1200,
        delay: 100,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      },
    });

    this.shape = new mojs.Shape({
      parent: this.$imgsWrap,
      radius: { 10: radius - 30 },
      fill: 'transparent',
      stroke: 'white',
      strokeWidth: { 40: 0 },
      duration: 1200,
      easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
    });

    this.imgsContainer = new mojs.Html({
      el: this.$imgsContainer,
      scale: { 0: 1 },
      delay: this.delay,
      duration: 600,
      easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
    });

    this.timeline.add(this.burst, this.shape, this.imgsContainer);
  }

  change(e) {
    const id = e.target.getAttribute('data-control');
    this.openImg(id);
  }

  openImg(id) {
    this.$imgs.forEach(($img) => {
      const imgId = $img.getAttribute('data-img');

      if (id === imgId) {
        $img.classList.add('active');
        this.timeline.replay();
      } else {
        $img.classList.remove('active');
      }
    });
  }

  destroyAnimation() {
    this.burst = null;
    this.shape = null;
    this.imgsContainer = null;
    this.timeline && this.timeline.reset();
    this.timeline = null;
  }
}

const $els = document.querySelectorAll('[data-animal]');
if ($els.length) $els.forEach(($el) => new Animal($el));
