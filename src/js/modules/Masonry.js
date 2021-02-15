class Masonry {
  constructor($grid) {
    this.$grid = $grid;
    this.$items = [...this.$grid.children];

    this.init();
  }

  init() {
    this.resizeItems();

    window.addEventListener('load', () => this.resizeItems());
    window.addEventListener('resize', () => this.resizeItems());
  }

  resizeItems() {
    this.$items && this.$items.forEach(($item) => this.resizeItem($item));
  }

  resizeItem($item) {
    $item.style.gridRowEnd = '';

    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    if (isMobile) return false;

    const rowHeight = parseInt(_getPropertyValue(this.$grid, 'grid-auto-rows'));
    const rowGap = parseInt(_getPropertyValue(this.$grid, 'grid-row-gap'));
    const $itemChild = $item.querySelector('.note__container');
    const itemChildRect = $itemChild.getBoundingClientRect();
    const rowSpan = Math.ceil(
      (itemChildRect.height + rowGap) / (rowHeight + rowGap)
    );

    $item.style.gridRowEnd = 'span ' + rowSpan;
  }

  static init() {
    const $grids = document.querySelectorAll('.j_masonry');
    if ($grids.length) $grids.forEach(($grid) => new Masonry($grid));
  }
}

Masonry.init();

window.Masonry = Masonry;

function _getPropertyValue($node, property) {
  return parseInt(window.getComputedStyle($node).getPropertyValue(property));
}
