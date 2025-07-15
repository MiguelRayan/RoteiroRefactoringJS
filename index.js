const { readFileSync } = require('fs');

const { formatarMoeda } = require("./util.js");
var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servico.js");
var gerarFaturaStr = require("./apresentacao.js");

// main
const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);


// Caso queira gerar HTML, descomente o código abaixo
// const faturaHTML = gerarFaturaHTML(faturas, calc);
// console.log(faturaHTML);