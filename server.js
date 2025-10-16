import http from 'http'; //Importa o módulo http nativo do node.js
import express from 'express';//importa o framewaork express.js
import dotenv from 'dotenv';//importa o módulo dotenv para carregar váriaveis de ambiente .env
import routerProdutos from './routerProdutos.js';

dotenv.config();//carrega as variaveis de ambiente de arquivo .env
const app = express();
const PORTA = process.env.PORTA;//define a porta do servidor com a variavel de ambiente
app.use(express.json());//middware para retornar JSON no corpo das requisições
app.use(express.static('views'));

app.use('/produto', routerProdutos)//Importa as rotas criadas

app.get('/', (req, res) => {
    req.sendFile('views/index.html', {root:'.'});//faz com que quando o server abrir vá direto para o HTML
});

const server = http.createServer(app);
server.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});