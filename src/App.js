import React,{Component} from 'react';
import SimulacaoComponent from './containers/simulacaoController'
import {WrappedFormSider} from './containers/formSider'
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      values:{}
    }
  }
  render(){
    return (
      <div className="grid-container">
        <header className="header">
          <span>Simulação Discreta - Lavacar wash</span>
        </header>
        <aside className="sidenav">
          <WrappedFormSider setMasterState={formData => this.setState({values: formData})}/>
        </aside>
        <main className="main">
          <SimulacaoComponent values = {this.state.values}/>
        </main>
      </div>
    );

  }
}

export default App;
