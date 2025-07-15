const { formatarMoeda } = require('./util.js');

module.exports = function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }

  const totalFatura = calc.calcularTotalFatura(fatura.apresentacoes);
  const totalCreditos = calc.calcularTotalCreditos(fatura.apresentacoes);
  
  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${totalCreditos} \n`;

  return faturaStr;
};