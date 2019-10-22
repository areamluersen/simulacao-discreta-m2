import React from "react";
import ReactApexChart from "react-apexcharts";

var colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];

class chartColumns extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.temposAtendimento !== prevProps.temposAtendimento) {
          this.setState(this.props)
        }
      }
      constructor(props) {
        super(props);
    
        this.state={
          temposAtendimento: props.temposAtendimento,
          temposChegada: props.temposChegada,
          historicoFila: props.historicoFila,
          type: props.type
        }
      }
    
    render() {
        const graph = {
          options: {
            chart: {
              events: {
                click: function (chart, w, e) {
                  console.log(chart, w, e)
                }
              },
            },
            colors: colors,
            plotOptions: {
              bar: {
                columnWidth: '45%',
                distributed: true
              }
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: ['John', 'Joe', 'Jake', 'Amber', 'Peter', 'Mary', 'David', 'Lily'],
              labels: {
                style: {
                  colors: colors,
                  fontSize: '14px'
                }
              }
            }
          },
          series: [{
            data: [21, 22, 10, 28, 16, 21, 13, 30]
          }],
        }
      return (
        <div id="chart">
          <ReactApexChart options={graph.options} series={graph.series} type="bar" height="350" />
        </div>
        );
    }
}

export default chartColumns;
  