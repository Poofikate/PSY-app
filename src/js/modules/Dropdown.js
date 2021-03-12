import ClassToggler from './ClassToggler';

const _instances = {};

export default class Dropdown extends ClassToggler {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);

    this.init();
  }

  init() {
    window.addEventListener('load', () => this.checkPosition());
    window.addEventListener('resize', () => this.checkPosition());

    _instances[this.id] = this;
  }

  checkPosition() {
    const $content = this.$el.querySelector('.dropdown__content');
    const coordsEl = $content.getBoundingClientRect();
    const coordsDoc = document.documentElement.getBoundingClientRect();

    if (coordsEl.bottom > coordsDoc.bottom) {
      $content.classList.add('dropdown__content--top');
    } else {
      $content.classList.remove('dropdown__content--top');
    }
  }

  static initAll() {
    const $dropdowns = document.querySelectorAll('.j_dropdown');

    if ($dropdowns.length) {
      $dropdowns.forEach(($dropdown) => {
        const id = $dropdown.getAttribute('id');
        const $triggers = document.querySelectorAll(
          `[data-dropdown-target="#${id}"]`
        );

        // eslint-disable-next-line no-new
        new Dropdown({
          id: id,
          $toggleBtns: $triggers,
          $openBtns: $dropdown.querySelectorAll('.j_openDropdown'),
          $closeBtns: $dropdown.querySelectorAll('.j_closeDropdown'),
          $el: $dropdown,
        });
      });
    }
  }

  static closeAll() {
    for (const id in _instances) {
      _instances[id].close();
    }
  }

  static open(id) {
    _instances[id].open();
  }

  static close(id) {
    _instances[id].close();
  }

  static setCloseCallback(id, callback) {
    _instances[id].closeCallback = callback;
  }

  static setOpenCallback(id, callback) {
    _instances[id].openCallback = callback;
  }
}

const defaultOptions = {
  closeOnDocumentClick: true,
};

Dropdown.initAll();

window.Dropdown = Dropdown;
