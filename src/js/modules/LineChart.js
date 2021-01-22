import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/markLine';

class LineChart {
  constructor($chart) {
    this.$chart = $chart;
    this.$tabWrapper = this.$chart.closest('[data-tab-content]');

    this.dataPrevString = this.$chart.getAttribute('data-prev');
    this.dataCurrentString = this.$chart.getAttribute('data-current');
    this.dataPrevColor = this.$chart.getAttribute('data-prev-color');
    this.dataCurrentColor = this.$chart.getAttribute('data-current-color');
    this.gridColor = '#E5E5E5';

    this.dataPrev = this._convertData(this.dataPrevString);
    this.dataCurrent = this._convertData(this.dataCurrentString);

    this.opts = {
      color: [this.dataPrevColor, this.dataCurrentColor],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        max: 7,
        min: 0,
        data: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
        axisTick: {
          show: false,
        },
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          interval: 0,
          margin: 10,
          fontFamily: 'Roboto',
          fontSize: 12,
          color: '#303F56',
        },
        axisLine: {
          lineStyle: {
            color: this.gridColor,
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        max: 5,
        min: 0,
        interval: 1,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: this.gridColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: this.gridColor,
          },
        },
      },
      grid: {
        width: '100%',
        top: '-2',
        left: '10',
      },
      series: [
        {
          type: 'line',
          name: 'Прошлая неделя',
          smooth: true,
          z: 5,
          itemStyle: {
            borderWidth: 4,
            borderColor: this.dataPrevColor,
          },
          lineStyle: {
            color: this.dataPrevColor,
            width: 2,
          },
          data: this.dataPrev,
        },
        {
          type: 'line',
          name: 'Текущая неделя',
          smooth: true,
          z: 5,
          itemStyle: {
            borderWidth: 4,
            borderColor: this.dataCurrentColor,
          },
          lineStyle: {
            color: this.dataCurrentColor,
            width: 2,
          },

          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: {
              type: 'solid',
              color: this.gridColor,
            },
            data: [
              { xAxis: 1 },
              { xAxis: 2 },
              { xAxis: 3 },
              { xAxis: 4 },
              { xAxis: 5 },
              { xAxis: 6 },
              { xAxis: 7 },
            ],
          },
          data: this.dataCurrent,
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

    arr = arr.map((num, i) => +num > 0 && +num - 0.5);

    return arr;
  }
}

const $chart = document.querySelector('.j_line-chart');
if ($chart) {
  const chart = new LineChart($chart);
  window.chart = chart;
}
