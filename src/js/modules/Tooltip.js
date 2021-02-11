import Helper from './helpers/Helper';
import EventObserver from './helpers/EventObserver';

const eventObserver = new EventObserver();

class Tooltip {
  constructor($el) {
    this.$el = $el;

    this._isShow = false;

    this.init();
  }

  init() {
    this.$el.addEventListener('click', (e) => this.toggle(e));
    document.addEventListener('click', (e) => this.checkTarget(e));

    eventObserver.subscribe(this.hide.bind(this));
  }

  checkTarget(e) {
    const isTargetOfChild = Helper.isParentHasClass(e.target, 'tooltip');

    if (!isTargetOfChild) this.hide();
  }

  toggle(e) {
    this._isShow ? this.hide(e) : this.show(e);
  }

  show(e) {
    if (this._isShow) return false;

    e && e.preventDefault();

    eventObserver.broadcast();
    this.$el.classList.add('active');
    this._isShow = true;
  }

  hide(e) {
    if (!this._isShow) return false;

    e && e.preventDefault();

    this.$el.classList.remove('active');
    this._isShow = false;
  }
}

const $tooltips = document.querySelectorAll('.tooltip');
const media = window.matchMedia('(max-width: 900px)');
if (media && $tooltips.length)
  $tooltips.forEach(($tooltip) => new Tooltip($tooltip));
