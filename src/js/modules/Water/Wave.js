import { TweenMax, Sine } from 'gsap';

export default class Wave {
  constructor(context, options) {
    this.context = context;

    this.amplitude = options.amplitude || 20;
    this.curviness = options.curviness || 0.75;
    this.duration = options.duration || 1.5;
    this.fillStyle = options.fillStyle || 'rgba(33,150,243,1)';
    this.frequency = options.frequency || 1;
    this.height = options.height || 600;
    this.points = [];
    this.segments = options.segments || 200;
    this.tweens = [];
    this.waveHeight = options.waveHeight || 300;
    this.width = options.width || 800;
    this.x = options.x || 0;
    this.y = options.y || 0;

    this.init();
  }

  init() {
    this.kill();

    var segments = this.segments;
    var interval = this.width / segments;

    for (var i = 0; i <= segments; i++) {
      var norm = i / segments;
      var point = {
        x: this.x + i * interval,
        y: 1,
      };

      // point.y = 1 - norm;

      var tween = TweenMax.to(point, this.duration, {
        y: -1,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut,
      }).progress((1 - norm) * this.frequency);

      this.tweens.push(tween);
      this.points.push(point);
    }
  }

  kill() {
    var tweens = this.tweens;
    var len = tweens.length;

    for (var i = 0; i < len; i++) {
      tweens[i].kill();
    }

    tweens.length = 0;
    this.points.length = 0;
  }

  draw() {
    var points = this.points;
    var len = points.length;

    var startY = this.waveHeight;
    var height = this.amplitude / 2;

    // points.forEach((point) =>
    //   drawCoordinates(point.x, startY + point.y * height, context)
    // );

    this.context.beginPath();
    this.context.moveTo(points[0].x, startY + points[0].y * height);

    for (var i = 1; i < len; i++) {
      var point = points[i];
      this.context.lineTo(point.x, startY + point.y * height);
    }

    this.context.lineTo(this.x + this.width, this.y + this.height);
    this.context.lineTo(this.x, this.y + this.height);
    this.context.closePath();
    this.context.fillStyle = this.fillStyle;
    this.context.fill();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    var points = this.points;
    var len = points.length;
    var interval = this.width / this.segments;

    for (var i = 0; i < len; i++) {
      var point = points[i];
      point.x = this.x + i * interval;
    }
  }
}
