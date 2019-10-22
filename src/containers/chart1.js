import React from "react";
import ReactApexChart from "react-apexcharts";

class ChartArea extends React.Component {
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
        data: this.state.temposAtendimento
      }, {
        name: 'Intervalo de chegada',
        data: this.state.temposChegada
      }, {
        name: 'Fila',
        data: this.state.historicoFila
      }],
    }
    return (
      <div id="chart">
        <ReactApexChart options={graph.options} series={graph.series} type={this.state.type} height="350" width='95%' />
      </div>
    );
  }
}

export default ChartArea;