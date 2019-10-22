import React from 'react';
import {Row, Col, List} from 'antd'
import gerar_tempos_de_distribuicao from './numeros_randomicos';
import ChartArea from './chart1';
import ChartColumns from './chartColumns';
import './simulacao.css'

function simulacao(props){
  // Variáveis lidas do usuário
  const {values} = props;
  let { 
    minimo, 
    maximo,  
    media,  
    moda,  
    variancia,  
    fila_maxima,  
    tempo_simulacao,  
    distribuicao_chegadas_percentual, 
    distribuicao_chegadas_valor,
    distribuicao_atendimento_percentual,
    distribuicao_atendimento_valor,
    tipo_distribuicao
  } = values;
  //necessário parseint pois input retorna string
  minimo = parseInt(minimo) 
  maximo = parseInt(maximo)  
  media = parseInt(media)  
  moda = parseInt(moda)  
  variancia = parseInt(variancia)  
  fila_maxima = parseInt(fila_maxima)  
  tempo_simulacao = parseInt(tempo_simulacao)
  // Variáveis lidas do usuário
  const distribuicao_chegadas = { 'probabilidade_acumulada' : distribuicao_chegadas_percentual.split(','), 
                                  'valor': distribuicao_chegadas_valor.split(',') }
  const distribuicao_atendimentos = { 'probabilidade_acumulada' : distribuicao_atendimento_percentual.split(','), 
                                      'valor': distribuicao_atendimento_valor.split(',') }                         
  const tempo_chegadas = gerar_tempos_de_distribuicao(parseInt(tipo_distribuicao) ,true, tempo_simulacao, distribuicao_chegadas, minimo, maximo, media, moda, variancia)
  const tempo_atendimentos = gerar_tempos_de_distribuicao(parseInt(tipo_distribuicao), true, tempo_simulacao, distribuicao_atendimentos, minimo, maximo, media, moda, variancia)

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
  for (let i=0; i<tempo_simulacao; i++){

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
      clientes    
    } = simulacao(props);
    const temposChegada = tempo_chegadas.map(data => data.intervalo)
    const temposAtendimento = tempo_atendimentos.map(data => data.intervalo)
    return(
      <div style={{borderRadius: 13, backgroundColor:'#6c778d', width: '99%', boxShadow: '5px 5px 5px rgba(0,0,0,0.5)'}}>
        <Row style={{maxHeigth: 200, maxWidth: '95%'}}>
          <Col span={12}>
          <List
              size="small"
              bordered
              dataSource={[
                {text: 'Clientes total:', value: clientes.length}, 
                {text: 'Clientes Atendidos:', value: atendimentos}, 
                {text: 'Número Médio de Entidades na Fila:', value: unidadesQuePegaramFila},
                {text: 'Taxa Média de Ocupação do Servidor:', value: '--'},
                {text: 'Tempo Médio de uma Entidade na Fila:', value: '--'},
                {text: 'Tempo Médio no Sistema:', value: '--'},
                {text: 'Número máximo de entidades simultâneas no sistema:', value: '--'}
              ]}
              renderItem={item => (
                <List.Item>
                  {`${item.text} ${item.value}`}
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <ChartColumns total_clientes={clientes.length} clientes_atendidos={atendimentos} pegaram_fila={unidadesQuePegaramFila} type="column"/>
          </Col>
        </Row>
        
        <div>
          <ChartArea temposChegada={temposChegada} temposAtendimento={temposAtendimento} historicoFila={historico_fila} type="area"/>
        </div>
      </div>
    )
  }
  return  (<div style={{borderRadius: 13, backgroundColor:'#6c778d', width: '99%', heigth: '900px', boxShadow: '5px 5px 5px rgba(0,0,0,0.5)', textAlign: 'center'}}>
    Preencha os Filtros do formulário e execute a simulação
    </div>)
}

export default SimulacaoComponent;

