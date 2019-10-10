import React from 'react';
import Button from 'antd/es/button';
import SimulacaoComponent from './containers/simulacaoController'
import './App.css';

function App() {
  return (
    <div className="grid-container">
      <header className="header">
      </header>
      <aside className="sidenav">

      </aside>
      <main className="main">
        <Button type="primary">antd Button</Button>
        <SimulacaoComponent/>
      </main>
    </div>
  );
}

export default App;
