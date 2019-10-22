import React from 'react';
import {Row, Col} from 'antd'
import gerar_tempos_de_distribuicao from './numeros_randomicos';
import Chart1 from './chart1'
import './simulacao.css'

function simulacao(props){
  const {values} = props;
  // Variáveis que devem ser lidas do usuário
  const tempo_simulacao_min = values.tempo_simulacao //Equivalente a 8 horas
  const distribuicao_chegadas = { 'probabilidade_acumulada' : values.distribuicao_chegadas_percentual.split(','), 
                                  'valor': values.distribuicao_chegadas_valor.split(',') }
  const distribuicao_atendimentos = { 'probabilidade_acumulada' : values.distribuicao_atendimento_percentual.split(','), 
                                      'valor': values.distribuicao_atendimento_valor.split(',') }                         
  // TODO - Passar variáveis setados no front end - Faltou media moda e variancia
  const tempo_chegadas = gerar_tempos_de_distribuicao(parseInt(values.tipo_distribuicao) ,true, tempo_simulacao_min, distribuicao_chegadas)
  const tempo_atendimentos = gerar_tempos_de_distribuicao(parseInt(values.tipo_distribuicao), true, tempo_simulacao_min, distribuicao_atendimentos)
  // console.log('asdasd 1; ', tempo_chegadas)
  // Variáveis que devem ser lidas do usuário

  //variáveis discretas
  let servidor_ocupado = false
  let atendimentos_realizados_cont = 0
  let unidadesQuePegaramFila = 0
  let atendimentos_realizados_inf = []
  let fila = []
  let posicao_lista_chegada = 0
  let servidor_ficara_livre_no_min=0
  let historico_fila = [];
  /* g */
  let clientes = []
  let cliente_no_servidor = null

  // chaves cliente:
  // minuto_de_chegada, inicio_de_fila, tempo_na_fila, inicio_de_atendimento, tempo_de_atendimento

  //variáveis discretas
 // TODO work
  // relogio simulado
  for (let i=0; i<tempo_simulacao_min; i++){

    // servidor fica livre
    if (servidor_ocupado && servidor_ficara_livre_no_min === i+1){
      /* g */
      let cliente_que_saira_do_servidor = cliente_no_servidor

      clientes[cliente_que_saira_do_servidor].tempo_de_atendimento = i + 1 - clientes[cliente_que_saira_do_servidor].inicio_de_atendimento

      servidor_ocupado = false
      atendimentos_realizados_cont += 1
      // console.log('\n---------------------------------------------- ')
      // console.log('Servidor Ficou Livre no Min: ',i+1)
    }

    // alguem da fila vai para o servidor
    if (!servidor_ocupado && fila.length > 0){
      /* g */
      let cliente_que_sera_atendido = fila[0].posicao_fila_chegada

      clientes[cliente_que_sera_atendido].tempo_na_fila = i + 1 - clientes[cliente_que_sera_atendido].inicio_de_fila
      clientes[cliente_que_sera_atendido].inicio_de_atendimento = i + 1
      cliente_no_servidor = cliente_que_sera_atendido

      servidor_ocupado = true
      servidor_ficara_livre_no_min = tempo_atendimentos[fila[0].posicao_fila_chegada].intervalo + i+1
      fila.shift()
    }

    // cliente chega
    if (tempo_chegadas[posicao_lista_chegada].minuto_tempo === i+1){
      /* g */
      let cliente = criarCliente()
      cliente.minuto_de_chegada = i + 1
      clientes.push(cliente)

      // cliente que chegou foi para o servidor
      if (!servidor_ocupado){
        /* g */
        let cliente_que_sera_atendido = posicao_lista_chegada

        clientes[cliente_que_sera_atendido].inicio_de_atendimento = i + 1
        cliente_no_servidor = cliente_que_sera_atendido

        servidor_ocupado = true
        servidor_ficara_livre_no_min = tempo_atendimentos[posicao_lista_chegada].intervalo + i+1
        // console.log('\n---------------------------------------------- ')
        // console.log('Servidor Comecou atendimento no min: ', i+1)
        // console.log('Tempo previsto de atendimento: ', tempo_atendimentos[posicao_lista_chegada].intervalo)
        // console.log('Minuto previsto em que ficará livre: ',servidor_ficara_livre_no_min)
        // console.log('\n---------------------------------------------- ')
        posicao_lista_chegada += 1
      }

      // cliente que chegou foi para a fila
      else{
        /* g */
        let cliente_que_ira_para_a_fila = posicao_lista_chegada

        clientes[cliente_que_ira_para_a_fila].inicio_de_fila = i + 1

        // console.log('Entidade, "', posicao_lista_chegada,'" Pegou Fila: ')
        fila.push({'minuto_chegada': i, 'posicao_fila_chegada': posicao_lista_chegada })
        tempo_chegadas[posicao_lista_chegada]['pegou_fila'] = true
        unidadesQuePegaramFila += 1
        posicao_lista_chegada += 1
      }
      historico_fila.push(fila.length)
    }
  }
  // console.log('atendimentos_realizados_cont: ', atendimentos_realizados_cont)
  return {atendimentos_realizados_cont, unidadesQuePegaramFila, tempo_atendimentos, tempo_chegadas, historico_fila, clientes};
}

function criarCliente() {
  return {
    "minuto_de_chegada": null,
    "inicio_de_fila": null,
    "tempo_na_fila": null,
    "inicio_de_atendimento": null,
    "tempo_de_atendimento": null,
  }
}
          
const SimulacaoComponent = (props) => {
  console.log('sdoifgbaçuigabagbabdjrgbçargbçarg: ', props)
  if (props.values.tempo_simulacao) {
    const {atendimentos_realizados_cont: atendimentos, 
      unidadesQuePegaramFila, 
      tempo_atendimentos, 
      tempo_chegadas, 
      historico_fila, 
      clientes} = simulacao(props);
    const temposChegada = tempo_chegadas.map(data => data.intervalo)
    const temposAtendimento = tempo_atendimentos.map(data => data.intervalo)
    return(
      <div style={{borderTopLeftRadius: 15, backgroundColor:'#6c778d'}}>
        <Row>
          <Col span={12}>
            <span>Clientes total: {clientes.length}</span><br/>
            <span>Clientes Atendidos: {atendimentos}</span><br/>
            <span>Unidades que pegaram Fila: {unidadesQuePegaramFila}</span><br/>
          </Col>
          <Col span={12}>
          </Col>
        </Row>
        
        <div style={{maxWidth:1000}}>
          <Chart1 temposChegada={temposChegada} temposAtendimento={temposAtendimento} historicoFila={historico_fila}/>
        </div>
      </div>
    )
  }
  return  (<div style={{borderTopLeftRadius: 15, backgroundColor:'#6c778d'}}>
    Preencha os Filtros do formulário e execute a simulação
    </div>)
}

export default SimulacaoComponent;

