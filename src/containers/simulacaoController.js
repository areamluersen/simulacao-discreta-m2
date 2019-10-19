import React from 'react';
import gerar_tempos_de_distribuicao from './numeros_randomicos';
import Chart1 from './chart1'
import './simulacao.css'

function simulacao(){
  // Variáveis que devem ser lidas do usuário
  const tempo_simulacao_min = 540 //Equivalente a 8 horas
  const distribuicao_chegadas = { 'probabilidade_acumulada' : [25,35,60,80,100], 'valor': [11,12,13,14,15] }
  const distribuicao_atendimentos = { 'probabilidade_acumulada' : [15,40,60,80,100], 'valor': [10,11,13,14,17] }
  // TODO - Passar variáveis setados no front end
  const tempo_chegadas = gerar_tempos_de_distribuicao(true, tempo_simulacao_min, distribuicao_chegadas)
  const tempo_atendimentos = gerar_tempos_de_distribuicao(true, tempo_simulacao_min, distribuicao_atendimentos)
  console.log('asdasd 1; ', tempo_chegadas)
  // Variáveis que devem ser lidas do usuário

  //variáveis discretas
  let servidor_ocupado = false
  let atendimentos_realizados_cont = 0
  let unidadesQuePegaramFila = 0
  let atendimentos_realizados_inf = []
  let fila = []
  let posicao_lista_chegada = 0
  let servidor_ficara_livre_no_min=0
  /* g */
  let clientes = []
  let historico_fila = [];
  
  // chaves cliente:
  // minuto_de_chegada, inicio_de_fila, tempo_na_fila, inicio_de_atendimento, tempo_de_atendimento

  //variáveis discretas
 // TODO work
  for (let i=0; i<tempo_simulacao_min; i++){
    if (servidor_ocupado && servidor_ficara_livre_no_min === i+1){
      /* g */
      if(clientes[posicao_lista_chegada]){
        clientes[posicao_lista_chegada].tempo_de_atendimento = i+1 - clientes[posicao_lista_chegada].inicio_de_atendimento
      }
        
      servidor_ocupado = false
      atendimentos_realizados_cont += 1
      console.log('\n---------------------------------------------- ')
      console.log('Servidor Ficou Livre no Min: ',i+1)
    }
    
    if (!servidor_ocupado && fila.length > 0){
      /* g */
      if(clientes[posicao_lista_chegada]){
        clientes[posicao_lista_chegada].tempo_na_fila = i+1 - clientes[posicao_lista_chegada].minuto_de_chegada
        clientes[posicao_lista_chegada].inicio_de_atendimento = i+1
      }

      servidor_ocupado = true
      servidor_ficara_livre_no_min = tempo_atendimentos[fila[0].posicao_fila_chegada].intervalo + i+1
      fila.pop(0)
    }

    if (tempo_chegadas[posicao_lista_chegada].minuto_tempo === i+1){
      /* g */
      let cliente = {
        "minuto_de_chegada": i+1,
      }
      clientes.push(cliente)

      if (!servidor_ocupado){
        /* g */
        clientes[posicao_lista_chegada].inicio_de_fila = 0
        clientes[posicao_lista_chegada].tempo_na_fila = 0
        
        servidor_ocupado = true
        servidor_ficara_livre_no_min = tempo_atendimentos[posicao_lista_chegada].intervalo + i+1
        console.log('\n---------------------------------------------- ')
        console.log('Servidor Comecou atendimento no min: ', i+1)
        console.log('Tempo previsto de atendimento: ', tempo_atendimentos[posicao_lista_chegada].intervalo)
        console.log('Minuto previsto em que ficará livre: ',servidor_ficara_livre_no_min)
        console.log('\n---------------------------------------------- ')
        posicao_lista_chegada += 1
      }
      else{
        /* g */
        clientes[posicao_lista_chegada].inicio_de_fila = 0

        console.log('Entidade, "', posicao_lista_chegada,'" Pegou Fila: ')
        fila.push({'minuto_chegada': i, 'posicao_fila_chegada': posicao_lista_chegada })
        tempo_chegadas[posicao_lista_chegada]['pegou_fila'] = true
        unidadesQuePegaramFila += 1
        posicao_lista_chegada += 1
      }
      historico_fila.push(fila.length)
    }
  }
  console.log('atendimentos_realizados_cont: ', atendimentos_realizados_cont)
  return {atendimentos_realizados_cont, unidadesQuePegaramFila, tempo_atendimentos, tempo_chegadas, historico_fila};
}

          
const SimulacaoComponent = () => {
  const {atendimentos_realizados_cont: atendimentos, unidadesQuePegaramFila, tempo_atendimentos, tempo_chegadas, historico_fila} = simulacao();
  const temposChegada = tempo_chegadas.map(data => data.intervalo)
  const temposAtendimento = tempo_atendimentos.map(data => data.intervalo)
  
  return(
    <>
      <span>Atendimentos: {atendimentos}</span><br/>
      <span>Unidades que pegaram Fila: {unidadesQuePegaramFila}</span><br/>
      <div style={{maxWidth:1000}}>
        <Chart1 temposChegada={temposChegada} temposAtendimento={temposAtendimento} historicoFila={historico_fila}/>

      </div>
    </>
  )
}

export default SimulacaoComponent;

