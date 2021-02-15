export default class Color {
  constructor($el) {
    this.$el = $el;
    this.id = this.$el.getAttribute('data-color') || null;

    this.init();
  }

  init() {
    this.$el.addEventListener('click', this.setColor.bind(this));
  }

  setColor() {
    document.body.removeAttribute('data-theme');
    document.body.setAttribute('data-theme', this.id);
  }
}

const $colors = document.querySelectorAll('[data-color]');
if ($colors.length) $colors.forEach(($color) => new Color($color));
