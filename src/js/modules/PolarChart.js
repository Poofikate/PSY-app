import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/polar';

class PolarChart {
  constructor($chart) {
    this.$chart = $chart;
    this.$tabWrapper = this.$chart.closest('[data-tab-content]');

    this.dataPrevString = this.$chart.getAttribute('data-prev');
    this.dataCurrentString = this.$chart.getAttribute('data-current');
    this.dataPrevColor = this.$chart.getAttribute('data-prev-color');
    this.dataCurrentColor = this.$chart.getAttribute('data-current-color');

    this.offsetAngle = 22;

    this.dataPrev = this._convertData(this.dataPrevString);
    this.dataCurrent = this._convertData(this.dataCurrentString);

    this.opts = {
      title: {
        text: '',
      },
      legend: {
        data: ['line'],
      },
      polar: {
        min: 0,
        radius: '100%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      angleAxis: {
        type: 'value',
        startAngle: 90 - this.offsetAngle,
        show: false,
      },
      radiusAxis: {
        max: 9,
        show: false,
      },

      series: [
        {
          coordinateSystem: 'polar',
          type: 'line',
          data: this.dataPrev,
          smooth: true,

          lineStyle: {
            width: 2,
            color: this.dataPrevColor,
          },
          itemStyle: {
            borderWidth: 4,
            color: this.dataPrevColor,
          },
        },
        {
          coordinateSystem: 'polar',
          type: 'line',
          data: this.dataCurrent,
          smooth: true,

          lineStyle: {
            width: 2,
            color: this.dataCurrentColor,
          },
          itemStyle: {
            borderWidth: 4,
            color: this.dataCurrentColor,
          },
        },
      ],
    };

    this.init();
  }

  init() {
    this.chart = echarts.init($chart);
    this.chart.setOption(this.opts);

    if (this.$tabWrapper) {
      // eslint-disable-next-line no-undef
      const observer = new MutationObserver((mutations) => this.chart.resize());

      observer.observe(this.$tabWrapper, {
        childList: false,
        subtree: false,
        characterDataOldValue: false,
        attributes: true,
      });
    }
  }

  _convertData(string) {
    let arr = string
      .replace('[', '')
      .replace(']', '')
      .split(',');

    arr = arr.map((num, i) => [+num, i + 1]);
    arr[arr.length] = arr[0];

    return arr;
  }
}

const $chart = document.querySelector('.j_polar-chart');
if ($chart) {
  const chart = new PolarChart($chart);
}
