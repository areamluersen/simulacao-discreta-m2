import React from 'react';
import Button from 'antd/es/button';
import SimulacaoComponent from './containers/simulacaoController'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary">antd Button</Button>
        <SimulacaoComponent/>
      </header>
    </div>
  );
}

export default App;
