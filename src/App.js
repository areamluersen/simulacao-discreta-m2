import React from 'react';
import Button from 'antd/es/button';
import SimulacaoComponent from './containers/simulacaoController'
import './App.css';

function App() {
  return (
    <div className="grid-container">
      <header className="header">
        <span>Simulação Discreta - Lavacar wash</span>
      </header>
      <aside className="sidenav">

      </aside>
      <main className="main">
        <SimulacaoComponent/>
      </main>
    </div>
  );
}

export default App;
