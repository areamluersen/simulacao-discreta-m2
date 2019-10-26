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
    tipo_distribuicao,
    tempos_aleatorios,
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
  const tempo_chegadas = gerar_tempos_de_distribuicao(parseInt(tipo_distribuicao) ,tempos_aleatorios, tempo_simulacao, distribuicao_chegadas, minimo, maximo, media, moda, variancia)
  const tempo_atendimentos = gerar_tempos_de_distribuicao(parseInt(tipo_distribuicao), tempos_aleatorios, tempo_simulacao, distribuicao_atendimentos, minimo, maximo, media, moda, variancia)

  //variáveis discretas
  let servidor_ocupado = false
  let atendimentos_realizados_cont = 0
  let unidadesQuePegaramFila = 0
  let fila = []
  let clientes_descartados = 0
  let posicao_lista_chegada = 0
  let servidor_ficara_livre_no_min=0
  let historico_fila = [];
  let clientes = []
  let cliente_no_servidor = null
  let clientes_atendidos = []
  let tempo_simulado_na_ocupacao = null
  let taxa_media_de_ocupacao_do_servidor_dividendo = 0
  let numero_de_entidades = 0
  let numero_maximo_de_entidades_simultaneas_no_sistema = 0
  let numero_medio_de_entidades_na_fila_dividendo = 0
  let tempo_simulado_na_alteracao_da_fila = 0
  let numero_medio_de_entidades_na_fila_divisor = 0

  //variáveis discretas
 // TODO work
  // relogio simulado
  for (let i=0; i<tempo_simulacao; i++){
    if(tempo_atendimentos.length > posicao_lista_chegada){
      // servidor fica livre
      if (servidor_ocupado && servidor_ficara_livre_no_min === i+1){
        let cliente_que_saira_do_servidor = cliente_no_servidor
  
        clientes[cliente_que_saira_do_servidor].tempo_de_atendimento = i + 1 - clientes[cliente_que_saira_do_servidor].inicio_de_atendimento
        clientes[cliente_que_saira_do_servidor].minuto_de_saida = i + 1
        clientes_atendidos.push(clientes[cliente_que_saira_do_servidor])
        taxa_media_de_ocupacao_do_servidor_dividendo += i + 1 - tempo_simulado_na_ocupacao
        numero_de_entidades -= 1
  
        servidor_ocupado = false
        atendimentos_realizados_cont += 1
        // console.log('\n---------------------------------------------- ')
        // console.log('Servidor Ficou Livre no Min: ',i+1)
      }
  
      // alguem da fila vai para o servidor
      if (!servidor_ocupado && fila.length > 0){
        let cliente_que_sera_atendido = fila[0].posicao_fila_chegada
  
        clientes[cliente_que_sera_atendido].tempo_na_fila = i + 1 - clientes[cliente_que_sera_atendido].inicio_de_fila
        clientes[cliente_que_sera_atendido].inicio_de_atendimento = i + 1
        cliente_no_servidor = cliente_que_sera_atendido
        tempo_simulado_na_ocupacao = i + 1
  
        let tempo_de_estado_da_fila = i + 1 - tempo_simulado_na_alteracao_da_fila
        numero_medio_de_entidades_na_fila_dividendo += fila.length * tempo_de_estado_da_fila
        numero_medio_de_entidades_na_fila_divisor += tempo_de_estado_da_fila
        tempo_simulado_na_alteracao_da_fila = i + 1
  
        servidor_ocupado = true
        console.log('fila[0].posicao_fila_chegada: ', fila[0].posicao_fila_chegada);
        servidor_ficara_livre_no_min = tempo_atendimentos[fila[0].posicao_fila_chegada].intervalo + i+1
        fila.shift()
      }
  
      // cliente chega
      if (tempo_chegadas[posicao_lista_chegada].minuto_tempo === i+1){
        let cliente = criarCliente()
        cliente.minuto_de_chegada = i + 1
        clientes.push(cliente)
        numero_de_entidades += 1
        numero_maximo_de_entidades_simultaneas_no_sistema = Math.max(numero_de_entidades, numero_maximo_de_entidades_simultaneas_no_sistema)
        
        if(fila.length < fila_maxima){
          // cliente que chegou foi para o servidor
          if (!servidor_ocupado){
            let cliente_que_sera_atendido = posicao_lista_chegada
    
            clientes[cliente_que_sera_atendido].inicio_de_atendimento = i + 1
            cliente_no_servidor = cliente_que_sera_atendido
            tempo_simulado_na_ocupacao = i + 1
    
            servidor_ocupado = true
            servidor_ficara_livre_no_min = tempo_atendimentos[posicao_lista_chegada].intervalo + i+1
          }
    
          // cliente que chegou foi para a fila
          else{
            let cliente_que_ira_para_a_fila = posicao_lista_chegada
    
            clientes[cliente_que_ira_para_a_fila].inicio_de_fila = i + 1
    
            let tempo_de_estado_da_fila = i + 1 - tempo_simulado_na_alteracao_da_fila
            numero_medio_de_entidades_na_fila_dividendo += fila.length * tempo_de_estado_da_fila
            numero_medio_de_entidades_na_fila_divisor += tempo_de_estado_da_fila
            tempo_simulado_na_alteracao_da_fila = i + 1
    
            // console.log('Entidade, "', posicao_lista_chegada,'" Pegou Fila: ')
            fila.push({'minuto_chegada': i, 'posicao_fila_chegada': posicao_lista_chegada })
            tempo_chegadas[posicao_lista_chegada]['pegou_fila'] = true
            unidadesQuePegaramFila += 1
          }
          
        }else{
          console.log('cliente descartado: ', clientes_descartados)
          clientes_descartados = clientes_descartados +1;
        }
        historico_fila.push(fila.length)
        posicao_lista_chegada += 1
      }
     
    }

  }
  // console.log('atendimentos_realizados_cont: ', atendimentos_realizados_cont)
  let numero_medio_de_entidades_na_fila = numeroMedioDeEntidadesNaFila(numero_medio_de_entidades_na_fila_dividendo, numero_medio_de_entidades_na_fila_divisor) || 0
  let taxa_media_de_ocupacao_do_servidor = taxaMediaDeOcupacaoDoServidor(taxa_media_de_ocupacao_do_servidor_dividendo, tempo_simulacao)
  let tempo_medio_de_uma_entidade_na_fila = tempoMedioDeUmaEntidadeNaFila(clientes)
  let tempo_medio_no_sistema = tempoMedioNoSistema(clientes_atendidos)

  return {
    atendimentos_realizados_cont,
    unidadesQuePegaramFila,
    tempo_atendimentos,
    tempo_chegadas,
    historico_fila,
    clientes,
    numero_medio_de_entidades_na_fila,
    taxa_media_de_ocupacao_do_servidor,
    tempo_medio_de_uma_entidade_na_fila,
    tempo_medio_no_sistema,
    numero_maximo_de_entidades_simultaneas_no_sistema,
    clientes_descartados
  };
}

function numeroMedioDeEntidadesNaFila(numero_medio_de_entidades_na_fila_dividendo, numero_medio_de_entidades_na_fila_divisor) {
  return numero_medio_de_entidades_na_fila_dividendo / numero_medio_de_entidades_na_fila_divisor
}

function taxaMediaDeOcupacaoDoServidor(taxa_media_de_ocupacao_do_servidor_dividendo, tempo_simulacao) {
  return taxa_media_de_ocupacao_do_servidor_dividendo / tempo_simulacao
}

function tempoMedioDeUmaEntidadeNaFila(clientes) {
  let numero_de_clientes = clientes.length
  let soma_dos_tempos_de_fila = 0

  for (let i = 0; i < numero_de_clientes; i++) {
    let tempo_de_fila = clientes[i].tempo_na_fila
    if (tempo_de_fila === null) {
      tempo_de_fila = 0
    }

    soma_dos_tempos_de_fila += tempo_de_fila
  }

  return soma_dos_tempos_de_fila / numero_de_clientes
}

function tempoMedioNoSistema(clientes_atendidos) {
  let numero_de_clientes = clientes_atendidos.length
  let soma_dos_tempos_de_sistema = 0

  for (let i = 0; i < numero_de_clientes; i++) {
    let tempo_no_sistema = clientes_atendidos[i].minuto_de_saida - clientes_atendidos[i].minuto_de_chegada
    soma_dos_tempos_de_sistema += tempo_no_sistema
  }

  return soma_dos_tempos_de_sistema / numero_de_clientes
}

function criarCliente() {
  return {
    "minuto_de_chegada": null,
    "inicio_de_fila": null,
    "tempo_na_fila": null,
    "inicio_de_atendimento": null,
    "tempo_de_atendimento": null,
    "minuto_de_saida": null,
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
      clientes,
      numero_medio_de_entidades_na_fila,
      taxa_media_de_ocupacao_do_servidor,
      tempo_medio_de_uma_entidade_na_fila,
      tempo_medio_no_sistema,
      numero_maximo_de_entidades_simultaneas_no_sistema,
      clientes_descartados
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
                {text: 'Clientes que Pegaram Fila:', value: unidadesQuePegaramFila},
                {text: 'Número Médio de Entidades na Fila:', value: numero_medio_de_entidades_na_fila.toPrecision(4)},
                {text: 'Taxa Média de Ocupação do Servidor:', value: taxa_media_de_ocupacao_do_servidor.toPrecision(4) * 100},
                {text: 'Tempo Médio na Fila:', value: tempo_medio_de_uma_entidade_na_fila.toPrecision(4)},
                {text: 'Tempo Médio no Sistema:', value: tempo_medio_no_sistema.toPrecision(4)},
                {text: 'Pico de entidades no sistema:', value: numero_maximo_de_entidades_simultaneas_no_sistema},
                {text: 'Clientes Descartados:', value: clientes_descartados}
              ]}
              renderItem={item => (
                <List.Item style={{color: 'rgba(0,0,0,0.8)', fontWeight: "bold"}}>
                  {`${item.text}`} <span style={{color: '#FEB019', fontWeight: "bold"}}>{item.value}</span>
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <ChartColumns dataSource={[
              clientes.length, 
              atendimentos, 
              unidadesQuePegaramFila, 
              numero_maximo_de_entidades_simultaneas_no_sistema,
              clientes_descartados
            ]} type="column"/>
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

