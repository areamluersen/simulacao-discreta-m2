// Criar métodos de geração de números aleatórios como Uniforme, triangular, exponencial e natural.

const metodoJson = {
    1: "uniforme",
    2: "triangular",
    3: "exponencial",
    4: "natural"
}

// x = a + (b-a)*R   R = Random number - a={valor menor} b={valor maior}
 function gerarRandomicoUniforme(valorMenor, valorMaior) {
     return valorMenor + (valorMaior - valorMenor)* Math.random();
 }
// -- 
function gerarRandomicoTriangular(valorMenor, valorMaior, moda){
    let U = Math.random();
    if (U < (moda-valorMenor)/(valorMaior-valorMenor)){
        return valorMenor + (U*(moda-valorMenor)*(valorMaior-valorMenor)) ** 0.5
    }
    else{
        return valorMaior - ((1-U)*(valorMaior-moda)*(valorMaior-valorMenor)) ** 0.5
    }
}

function gerarRandomicoExponencial(limiteInferior, media){
    // http://mpsantos.com.br/simul.pdf - Página 66 e 67
    const U = Math.random();
    const alpha = 1 / (media - limiteInferior)
    const x = limiteInferior - (1 / alpha) * Math.log(U)
    return x
}

//TODO - rever funcao ao ser chamada está quebrando a aplicação
function gerarRandomicoNatural(media, variancia){
    const U1 = Math.random();
    const U2 = Math.random();
    const Z = Math.sqrt(-2 * Math.log(U1)) * Math.sin(2 * Math.pi * U2)
    const X = media + variancia * Z
    return X
}

function gerarNumerosRandomicos(metodo, qtde, valorMenor, valorMaior, moda, media, variancia){
    const numerosAleatorios = []
    if (metodoJson[metodo] === 'uniforme'){
        for (let i = 0; i < qtde; i++){
            numerosAleatorios.push(gerarRandomicoUniforme(valorMenor, valorMaior))
        }
    }
    if (metodoJson[metodo] === 'triangular'){
        for (let i = 0; i < qtde; i++){
            numerosAleatorios.push(gerarRandomicoTriangular(valorMenor, valorMaior, moda))
        }
    }
    if (metodoJson[metodo] === 'exponencial'){
        for (let i = 0; i < qtde; i++){
            numerosAleatorios.push(
                gerarRandomicoExponencial(valorMenor, media))
        }
    }
    if (metodoJson[metodo] === 'natural'){
        for (let i = 0; i < qtde; i++){
            numerosAleatorios.push(gerarRandomicoNatural(media, variancia))
        }
    }
    return numerosAleatorios
}

const gerar_tempos_de_distribuicao = (aleatorio=true, tempo_total_min=540, distribuicao=[]) => {
    let tempo_acumulado = 0
    const chegadas=[]
    while(tempo_acumulado <= tempo_total_min){

        //Arrumar interação no Json.
        // const aleatorio = gerarRandomicoUniforme(0,100)
        //TODO - Passar os parâmetros recebidos na função  gerarNumerosRandomicos() abaixos
        const aleatorio = gerarNumerosRandomicos(3,1,0,100,20,10,6)[0]
        console.log(aleatorio)
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