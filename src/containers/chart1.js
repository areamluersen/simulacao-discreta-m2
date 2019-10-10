import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { black } from "ansi-colors";


class Charp1 extends React.Component {
      
  constructor(props) {
    super(props);
    console.log('asdofiansdfoi: ', props.temposAtendimento);

    this.state = {
      options: {
        theme: {
          mode: 'dark', 
          palette: 'palette1'
      },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },

        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        }
      },
      series: [{
        name: 'Tempo de atendimento',
        data: props.temposAtendimento
      }, {
        name: 'Intervalo de chegada',
        data: props.temposChegada
      }],
    }
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height="350" />
      </div>
    );
  }
}

export default Charp1;