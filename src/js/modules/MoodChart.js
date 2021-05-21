import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/markLine';

export default class MoodChart {
  constructor($chart) {
    this.$chart = $chart;
    this.$tabWrapper = this.$chart.closest('[data-tab-content]');

    this.dataCurrentString = this.$chart.getAttribute('data-current');
    this.dataCurrentX = this.$chart.getAttribute('data-current-x');
    this.dataCurrentColor = this.$chart.getAttribute('data-current-color');
    this.gridColor = '#E5E5E5';

    this.dataCurrent = this._convertData(this.dataCurrentString);

    this.opts = {
      color: [this.dataCurrentColor],
      dimensions: ['name', 'time'],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // max: 7,
        // min: 0,
        // data: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
        data: this._convertDataX(this.dataCurrentX),
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
          color: this.dataCurrent.length <= 7 ? '#303F56' : 'transparent',
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
        width: '90%',
        top: '-2',
        left: '10',
      },
      series: [
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
    this.chart = echarts.init(this.$chart);
    this.chart.setOption(this.opts);
  }

  _convertData(string) {
    let arr = string
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .split(',');

    arr = arr.map((num, i) => +num > 0 && +num - 0.5);

    return arr;
  }

  _convertDataX(string) {
    const arr = string
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .split(',');

    return arr;
  }
}

const $charts = document.querySelectorAll('.j_line-chart-mood');
if ($charts.length) {
  $charts.forEach(($chart) => new MoodChart($chart));
}
