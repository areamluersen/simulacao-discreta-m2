import React from "react";
import ReactApexChart from "react-apexcharts";

var colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];

class chartColumns extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.dataSource !== prevProps.dataSource) {
          this.setState({data: this.props.dataSource})
        }
      }
      constructor(props) {
        super(props);
    
        this.state={
          data: props.dataSource
        }
      }
    
    render() {
        const graph = {
          options: {
            theme: {
              mode: 'dark', 
              palette: 'palette1'
            },
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
              categories: ['Clientes Total', 'Atendidos', 'Pegaram Fila', 'Pico', 'Descartados'],
              labels: {
                style: {
                  colors: colors,
                  fontSize: '14px'
                }
              }
            }
          },
          series: [{
            data: this.state.data
          }],
        }
      return (
        <div id="chart">
          <ReactApexChart options={graph.options} series={graph.series} type="bar" height='250'/>
        </div>
        );
    }
}

export default chartColumns;
  