<template>
  <img
    class="chat__img"
    :src="src"
    :data-reaction-img="reaction"
  >
</template>

<script>
import mojs from '@mojs/core/build/mo';

export default {
  name: 'ReactionImg',
  props: {
    id: {
      type: Number,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    reaction: {
      type: String,
      required: true
    },
    isShow: {
      type: Boolean,
      // default: false,
      required: true
    },
  },

  data() {
    return {

    }
  },

  created() {

  },

  mounted() {
    this.$imgsWrap = document.querySelector('[data-reaction]');
    this.$imgsContainer = document.querySelector('[data-reaction-wrap]');
    this.$imgs = document.querySelectorAll('[data-reaction-img]');

    this.timeline = new mojs.Timeline();
    this.delay = 300;

    this.init();

    if (this.isShow) this.play();
  },

  methods: {
    init() {
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
    },

    play(key) {
      this.timeline.replay();
    }
  },

  watch: {
    isShow(play) {
      play && this.play();
    }
  },


  beforeDestroy() {
    this.burst = null;
    this.shape = null;
    this.imgsContainer = null;
    this.timeline.reset()
    this.timeline = null;
  }
}
</script>

