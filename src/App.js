import React from 'react';
import SimulacaoComponent from './containers/simulacaoController'
import {WrappedFormSider} from './containers/formSider'
import './App.css';

function App() {
  return (
    <div className="grid-container">
      <header className="header">
        <span>Simulação Discreta - Lavacar wash</span>
      </header>
      <aside className="sidenav">
        <WrappedFormSider/>
      </aside>
      <main className="main">
        <SimulacaoComponent/>
      </main>
    </div>
  );
}

export default App;
