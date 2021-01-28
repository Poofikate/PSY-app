import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';

export default class Chart {
  constructor(options) {
    this.$chart = options.$chart;
    this.$time = options.$time;

    // start
    this.start = +this.$chart.getAttribute('data-start');
    // colors
    this.yellowColor = this.$chart.getAttribute('data-yellow-color');
    this.greenColor = this.$chart.getAttribute('data-green-color');
    this.grayColor = this.$chart.getAttribute('data-gray-color');
    // values
    this.yellowValue = +this.$chart.getAttribute('data-yellow');
    this.greenValue = +this.$chart.getAttribute('data-green');
    this.grayValue = +this.$chart.getAttribute('data-gray');
    this.interval = +this.$chart.getAttribute('data-interval');
    this.allValue =
      (this.yellowValue + this.greenValue + this.grayValue) * 3 +
      this.interval * 2;

    this.opts = {
      textStyle: {
        fontFamily: 'Roboto Slab',
        fontWeight: 'bold',
        fontSize: 14,
        color: 'rgba(28, 167, 196, 1)',
      },

      tooltip: {
        trigger: 'item',
        formatter: (params, ticket, callback) => {
          if (params.color === 'transparent') return '';

          let timeStart = 0;
          let timeEnd = 0;

          const index = params.dataIndex;

          for (let i = 0; i < index; i++) {
            const el = this.opts.series[0].data[i];
            timeStart += el.value;
          }

          timeEnd = timeStart + params.value;

          const startTime = convertTime(timeStart);
          const endTime = convertTime(timeEnd);

          return `${startTime}-${endTime}`;
        },
      },

      series: [
        {
          type: 'pie',
          radius: '100%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          min: 0,
          max: 12,

          label: {
            show: false,
          },

          data: [
            // before
            {
              value: this.start,
              name: 'before',
              itemStyle: {
                color: 'transparent',
              },
              emphasis: {
                itemStyle: {
                  color: 'transparent',
                  opacity: 1,
                },
              },
            },

            // colors
            {
              value: this.yellowValue,
              name: 'yellow_1',
              itemStyle: {
                color: this.yellowColor,
              },
            },
            {
              value: this.greenValue,
              name: 'green_1',
              itemStyle: {
                color: this.greenColor,
              },
            },
            {
              value: this.grayValue,
              name: 'gray_1',
              itemStyle: {
                color: this.grayColor,
              },
            },

            // interval
            {
              value: this.interval,
              name: 'interval',
              itemStyle: {
                color: 'transparent',
              },
              emphasis: {
                itemStyle: {
                  color: 'transparent',
                  opacity: 1,
                },
              },
            },

            // colors
            {
              value: this.yellowValue,
              name: 'yellow_2',
              itemStyle: {
                color: this.yellowColor,
              },
            },
            {
              value: this.greenValue,
              name: 'green_2',
              itemStyle: {
                color: this.greenColor,
              },
            },
            {
              value: this.grayValue,
              name: 'gray_2',
              itemStyle: {
                color: this.grayColor,
              },
            },

            // interval
            {
              value: this.interval,
              name: 'interval',
              itemStyle: {
                color: 'transparent',
              },
              emphasis: {
                itemStyle: {
                  color: 'transparent',
                  opacity: 1,
                },
              },
            },

            // colors
            {
              value: this.yellowValue,
              name: 'yellow_3',
              itemStyle: {
                color: this.yellowColor,
              },
            },
            {
              value: this.greenValue,
              name: 'green_3',
              itemStyle: {
                color: this.greenColor,
              },
            },
            {
              value: this.grayValue,
              name: 'gray_3',
              itemStyle: {
                color: this.grayColor,
              },
            },

            // after
            {
              value: 0,
              name: 'after',
              itemStyle: {
                color: 'transparent',
              },

              emphasis: {
                itemStyle: {
                  color: 'transparent',
                  opacity: 1,
                },
              },
            },
          ],

          emphasis: {
            itemStyle: {
              color: '#1ca7c4',
              opacity: 0.3,
            },
          },

          animation: false,
        },

        {
          name: '',
          type: 'gauge',
          z: 3,
          min: 0,
          max: 12,
          splitNumber: 12,
          radius: '100%',
          startAngle: 90,
          endAngle: -269.9,
          pointer: {
            width: 4,
            length: '55%',
          },

          tooltip: {
            show: false,
          },

          axisLine: {
            lineStyle: {
              width: 0,
              color: [
                [0, 'rgba(28, 167, 196, 1)'],
                [1, 'rgba(28, 167, 196, 1)'],
              ],
            },
          },
          axisTick: {
            show: false,
            color: '#000000',
            lineStyle: {
              width: 1,
              color: '#000',
            },
          },
          detail: {
            show: false,
          },
          splitLine: {
            length: 2,
            lineStyle: {
              color: 'transparent',
            },
          },
          axisLabel: {
            backgroundColor: 'transparent',
            borderRadius: 2,
            color: 'rgba(28, 167, 196, 1)',
            padding: 0,
            textShadowBlur: 2,
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            formatter: function(value) {
              return value !== 0 ? value : '';
            },
          },

          data: [
            {
              value: 10.3,
              name: '',
            },
          ],
        },

        {
          name: '',
          type: 'gauge',
          z: 3,
          min: 0,
          max: 12,
          splitNumber: 12,
          radius: '100%',
          startAngle: 90,
          endAngle: -269.9,
          pointer: {
            width: 2.5,
            length: '75%',
          },

          tooltip: {
            show: false,
          },

          axisLine: {
            lineStyle: {
              width: 0,
              color: [
                [0, 'rgba(28, 167, 196, 1)'],
                [1, 'rgba(28, 167, 196, 1)'],
              ],
            },
          },
          axisTick: {
            show: false,
          },
          detail: {
            show: false,
          },
          splitLine: {
            length: 0,
            lineStyle: {
              color: 'transparent',
            },
          },
          axisLabel: {
            backgroundColor: 'transparent',
            borderRadius: 2,
            color: 'transparent',
            padding: 0,
            textShadowBlur: 2,
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            formatter: function(value) {
              return '';
            },
          },

          data: [{ value: 2, name: '' }],
        },
      ],
    };

    this.init();
  }

  init() {
    this.chart = echarts.init($chart);
    this.chart.setOption(this.opts);

    this.setValue(this.start);

    this.updateTime();

    const day = new Date();
    const ss = day.getSeconds();

    setTimeout(() => {
      this.updateTime();
      setInterval(() => this.updateTime(), 60000);
    }, 60000 - ss * 1000);
  }

  updateTime() {
    const day = new Date();
    const hh = day.getHours();
    const hh12 = hh % 12 || 12;
    const mm = day.getMinutes();
    const mm12 = mm / 5;
    const time = `${hh}:${mm > 9 ? mm : '0' + mm}`;

    this.opts.series[1].data[0].value = hh12;
    this.opts.series[2].data[0].value = mm12;

    this.chart.setOption(this.opts, true);

    this.$time.value = time;
    this.$time.setAttribute('value', time);
  }

  setValue(time) {
    const beforeTime = time - this.yellowValue;
    const afterTime = 12 - beforeTime - this.allValue;

    this.opts.series[0].data[0].value = beforeTime;
    this.opts.series[0].data[12].value = afterTime;

    this.chart.setOption(this.opts, true);
  }
}

const $chart = document.querySelector('.j_chart');
if ($chart) {
  const $time = document.querySelector('.j_time');
  const chart = new Chart({ $chart, $time });
  window.chart = chart;
}

function convertTime(value) {
  if (value >= 24) value = value - 24;
  value = +value.toFixed(2);
  value = value.toString().split('.');

  let hh = +value[0];
  let mm = value[1] ? (+value[1] / 10) * 60 : 0;
  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (mm > 60 && mm % 10 === 0) mm = mm / 10;
  return `${hh}:${mm}`;
}
