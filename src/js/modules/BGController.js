export default class BGController {
  constructor(options) {
    this.selectorInput = options.selectorInput;
    this.selectorBg = options.selectorBg;
    // this.selectorSwitcher = options.selectorSwitcher;

    this.$inputs = document.querySelectorAll(this.selectorInput);
    this.$bgs = document.querySelectorAll(this.selectorBg);
    // this.$switcher = document.querySelector(this.selectorSwitcher);

    this._isEnabled = false;

    if (this.$inputs.length && this.$bgs.length) this.init();
  }

  init() {
    // this.$switcher.addEventListener('change', this.toggle.bind(this));

    const $selectedInput = [...this.$inputs].find(($input) => $input.checked);
    if ($selectedInput) {
      const selectedID = $selectedInput.getAttribute('data-input-bg');
      this.selectBG(selectedID);
    }

    this.$inputs.forEach(($input) =>
      $input.addEventListener('change', () => {
        const id = $input.getAttribute('data-input-bg');
        this.selectBG(id);
      })
    );
  }

  toggle(e) {
    if (e.target.checked) {
      this.enable();
    } else {
      this.disable();
    }
  }

  enable() {
    document.body.classList.add('bg-enabled');
    this._isEnabled = true;
  }

  disable() {
    document.body.classList.remove('bg-enabled');
    this._isEnabled = false;
  }

  selectBG(id) {
    const $current = [...this.$bgs].find(
      ($bg) => $bg.getAttribute('data-bg') === id
    );

    this.$bgs.forEach(($bg) => $bg.classList.remove('active'));
    $current.classList.add('active');
  }
}

// const $inputs = document.querySelectorAll('')
const bgController = new BGController({
  selectorInput: '[data-input-bg]',
  selectorBg: '[data-bg]',
  selectorSwitcher: '[data-bg-switcher]',
});

window.bgController = bgController;
