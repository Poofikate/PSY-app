const prizes = [
  'consulting',
  'tariff',
  'bonus',
  'discount',
  'half-price',
  'loss',
];

class Wheel {
  constructor($el) {
    this.$el = $el;
    this.$inner = this.$el.querySelector('.wheel-inner');
    this.$secs = this.$el.querySelectorAll('.sec');
    this.$items = document.querySelectorAll('[data-prize-info]');

    this.anim = {
      duration: +this.$el.getAttribute('data-duration') || 8,
      rotationTimes: +this.$el.getAttribute('data-times') || 6,
      transitionTimingFunction:
        this.$el.getAttribute('data-timing-function') ||
        'cubic-bezier(0.25, 0.15, 0.15, 1)',
    };

    this._length = this.$secs.length; // 6
    this._secDegree = 360 / this._length; // 6
    this._clicks = 0;
    this._degree = 360 * this.anim.rotationTimes; // 360*6
    this._prevOffsetDegree = 0;
    this._offsetDegree = 0;
    this._extraDegree = 0;
    this._extraDegreeTotal = 0;
    this._offset = this._secDegree / 2 - 6; // (24)

    this._url = this.$el.getAttribute('data-url');

    // callbacks
    this.onRotateEnd = () => {};

    this.init();
  }

  get _operator() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  set _operator(num) {
    return num;
  }

  init() {
    this.$el.classList.add('ready');
    this.setTransitionStyle();

    this.$inner.addEventListener('transitionstart', (e) => {
      if (e.propertyName === 'transform') this.unHighlightPrizes();
    });

    this.$inner.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        this.highlightPrize();
        this.onRotateEnd.apply(this);
      }
    });
  }

  async rotate(fakeID) {
    this._clicks++;
    this._extraDegreeTotal += this._extraDegree;
    this._newDegree = this._degree * this._clicks + this._extraDegreeTotal;

    const id = await this.requestPrize();

    // if id is not correct
    if (!id) {
      console.error(`Error: id='${id}'!`);
      return false;
    }

    // fake ID of prize
    if (typeof fakeID !== 'undefined' && fakeID !== id) {
      console.error('Почти получилось, хацкер, попробуй ещё раз!');
      return false;
    }

    this.prevPrize = this.currentPrize;
    this.currentPrize = this.getCurrentPrize(id);

    if (!this.currentPrize) {
      console.error(`Error: id='${id}' prize='${this.currentPrize}'!`);
      return false;
    }

    const currentIndex = this.getRandomPrizeIndex();
    let prevIndex = this.getPrevPrizeIndex() || 0;

    let step = 0;

    if (prevIndex < 0) {
      // if first time rotating
      prevIndex = this._length - 1;
    }

    if (prevIndex < currentIndex) {
      // if previous prize's index < current prize
      step = this._length - Math.abs(prevIndex - currentIndex);
    } else if (prevIndex > currentIndex) {
      // if previous prize's index > current prize
      step = prevIndex - currentIndex;
    } else if (prevIndex === currentIndex) {
      step = 0;
    }

    const randomOffset = randomInteger(0, this._offset);

    this._prevOffsetDegree = this._offsetDegree;
    this._offsetDegree = this._operator * randomOffset;
    this._extraDegree =
      this._secDegree * step - this._prevOffsetDegree + this._offsetDegree;
    this._totalDegree = this._newDegree + this._extraDegree;

    this.$inner.style.transform = `rotate(${this._totalDegree}deg)`;

    return undefined;
  }

  async requestPrize() {
    try {
      // eslint-disable-next-line no-undef
      const response = await fetch(this._url);
      const json = await response.json();

      return json.prize.id;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  highlightPrize() {
    this.unHighlightPrizes();

    const $currentItem = [...this.$items].find(
      ($item) =>
        $item.getAttribute('data-prize-info') ===
        this.currentPrize.getAttribute('data-prize')
    );

    this.$items.forEach(($item) => {
      if ($item !== $currentItem) $item.classList.add('not-active');
    });

    this.currentPrize.classList.add('active');
    $currentItem.classList.add('active');
  }

  unHighlightPrizes() {
    this.$secs.forEach(($sec) => {
      $sec.classList.remove('active');
      $sec.classList.remove('not-active');
    });
    this.$items.forEach(($item) => {
      $item.classList.remove('active');
      $item.classList.remove('not-active');
    });
  }

  getRandomPrize() {
    let rand = 5;
    const r = Math.random();

    switch (true) {
      case r < 0.01:
        rand = 0;
        break; // 1%
      case r >= 0.01 && r < 0.04:
        rand = 1;
        break; // 3%
      case r >= 0.04 && r < 0.09:
        rand = 2;
        break; // 5%
      case r >= 0.09 && r < 0.15:
        rand = 3;
        break; // 6%
      case r >= 0.15 && r < 0.3:
        rand = 4;
        break; // 15%
      case r >= 0.3 && r < 1:
        rand = 5;
        break; // 70%
    }

    const $prize = [...this.$secs].find(
      ($sec) => $sec.getAttribute('data-prize') === prizes[rand]
    );
    return $prize;
  }

  getCurrentPrize(id) {
    return [...this.$secs].find(
      ($sec) => $sec.getAttribute('data-prize') === id
    );
  }

  getRandomPrizeIndex() {
    return [...this.$secs].findIndex(($sec) => $sec === this.currentPrize);
  }

  getPrevPrizeIndex() {
    return [...this.$secs].findIndex(($sec) => $sec === this.prevPrize);
  }

  getPrevPrize() {
    return (
      [...this.$secs].find(($sec) => $sec.classList.contains('active')) || false
    );
  }

  setTransitionStyle() {
    this.$inner.style.transition = `transform ${this.anim.duration}s ${this.anim.transitionTimingFunction}`;
  }
}

const $el = document.querySelector('.j_wheel');
if ($el) {
  const wheel = new Wheel($el);
  window.wheel = wheel;
}

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
