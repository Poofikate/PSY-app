class Locker {
  constructor($el) {
    this.$el = $el;
  }

  init(options) {
    this.setTemplate(options);
    this.lock();

    this.setObserver();
  }

  lock() {
    this.$el.appendChild(this.$template);
    this.$placeholder = this.$el.querySelector('.locked-content');

    this.updateStyles();
  }

  updateStyles() {
    this.$placeholder.style.display = 'flex';
  }

  setObserver() {
    // eslint-disable-next-line no-undef
    const observer = new MutationObserver((mutations) => this.updateStyles());

    observer.observe(this.$placeholder, {
      childList: true,
      attributes: true,
    });
  }

  setTemplate({ title, text, textLink, link }) {
    this.template = () => `
      <div class="locked-content__wrap">
        <h2 class="locked-content__title">
          ${title}
        </h2>
        <p class="locked-content__text">
          ${text}
          <a href="${link}">
            ${textLink}
          </a>
        </p>
      </div>
    `;

    this.$template = document.createElement('div');
    this.$template.className = 'locked-content';
    this.$template.innerHTML = this.template();
  }

  static initAll(options) {
    const $els = document.querySelectorAll('.j_locked');
    if ($els.length) $els.forEach(($el) => new Locker($el).init(options));
  }
}

window.Locker = Locker;

// Locker.initAll({
//   title: 'Платный контент',
//   text: 'Для того, чтобы воспользоваться всеми функциями -',
//   textLink: 'оплатите подписку',
//   link: '#',
// });
