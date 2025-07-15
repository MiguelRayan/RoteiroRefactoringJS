const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;

  return faturaStr;
}

function calcularTotalCreditos(pecas, apresentacoes) {
  let totalCreditos = 0;
  for (let apre of apresentacoes) {
    totalCreditos += calcularCredito(pecas, apre);
  }
  return totalCreditos;
}

function calcularTotalApresentacao(pecas, apre) {
  const peca = getPeca(pecas, apre);
  let total = 0;
  
  switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${peca.tipo}`);
  }

  return total;
}

function calcularTotalFatura(pecas, apresentacoes) {
  let totalFatura = 0;
  for (let apre of apresentacoes) {
    totalFatura += calcularTotalApresentacao(pecas, apre);
  }
  return totalFatura;
}

function getPeca(pecas, apre) {
  return pecas[apre.id];
}

function calcularCredito(pecas, apre) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") {
    creditos += Math.floor(apre.audiencia / 5);
  }
  return creditos;
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(valor / 100);
}

function gerarFaturaHTML(fatura, pecas) {
  let html = `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fatura ${fatura.cliente}</title>
  </head>
  <body>
  <h1>Fatura de ${fatura.cliente}</h1>
  <ul>`;

  for (let apre of fatura.apresentacoes) {
    const peca = getPeca(pecas, apre);
    const total = calcularTotalApresentacao(pecas, apre);
    html += `
    <li>${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)</li>`;
  }

  const totalFatura = calcularTotalFatura(pecas, fatura.apresentacoes);
  const totalCreditos = calcularTotalCreditos(pecas, fatura.apresentacoes);

  html += `
  </ul>
  <p><strong>Valor total:</strong> ${formatarMoeda(totalFatura)}</p>
  <p><strong>Créditos acumulados:</strong> ${totalCreditos}</p>
  </body>
  </html>`;

  return html;
}

// Leitura dos arquivos
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Geração e exibição da fatura em HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);