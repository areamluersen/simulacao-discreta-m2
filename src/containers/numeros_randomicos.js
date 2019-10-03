// Criar métodos de geração de números aleatórios como Uniforme, triangular, exponencial e natural.

// x = a + (b-a)*R   R = Random number - a={valor menor} b={valor maior}
 function gerarRandomicoUniforme(valorMenor, valorMaior) {
     return valorMenor + (valorMaior - valorMenor)* Math.random();
 }

const gerar_tempos_de_distribuicao = (aleatorio=true, tempo_total_min=540, distribuicao=[]) => {
    let tempo_acumulado = 0
    const chegadas=[]
    while(tempo_acumulado <= tempo_total_min){

        //Arrumar interação no Json.
        const aleatorio = gerarRandomicoUniforme(0,100)
        for (let i=0; i< distribuicao.valor.length; i++){
	        if (aleatorio < distribuicao.probabilidade_acumulada[i]){
                tempo_acumulado += distribuicao.valor[i]
                chegadas.push({'minuto_tempo': tempo_acumulado, 'intervalo': distribuicao.valor[i]})
                break
            }
        }

    }
    return chegadas
}

export default gerar_tempos_de_distribuicao;

// const distribuicao_chegadas = { 'probabilidade_acumulada' : [25,35,60,80,100], 'valor': [11,12,13,14,15] }
// const distribuicao_atendimentos = { 'probabilidade_acumulada' : [15,40,60,80,100], 'valor': [10,11,13,14,17] }
// const tempo_chegadas = gerar_tempos_de_distribuicao(true, 800, distribuicao_chegadas)
// const tempo_atendimentos = gerar_tempos_de_distribuicao(true, 800, distribuicao_atendimentos)
// for (let i in tempo_chegadas){
//     console.log('Chegada no min: ', tempo_chegadas[i]['minuto_tempo'])
//     console.log('atendimento no min: ', tempo_atendimentos[i]['minuto_tempo'])
// }