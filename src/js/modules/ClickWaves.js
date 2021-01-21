import Waves from 'node-waves/dist/waves';
Waves.init();
Waves.attach('.nav-bar-link', ['waves-float']);
Waves.attach('[class="button"]', ['waves-float']);
Waves.attach('.button--gray', ['waves-float']);
Waves.attach('.button--invert', ['waves-float']);
Waves.attach('.button-tab', ['waves-float']);
Waves.attach('.button--dark:not(.button--invert)', [
  'waves-float',
  'waves-light',
]);
