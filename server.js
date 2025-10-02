import http from 'http'; //Importa o módulo http nativo do node.js
import express from 'express';//importa o framewaork express.js
import dotenv from 'dotenv';//importa o módulo dotenv para carregar váriaveis de ambiente .env
import conectarBanco from './database/conexao.js';//importa a função de conexão com o banco de dados

dotenv.config();//carrega as variaveis de ambiente de arquivo .env
const app = express();
const PORTA = process.env.PORTA;//define a porta do servidor com a variavel de ambiente
app.use(express.json());//middware para retornar JSON no corpo das requisições

app.get('/', (req, res) => {
    res.end('Bem vindo a API de produtos Pizza PWI!');//responde com uma mensagem simples
});

app.get('/produto', async (req, res) => {
    const conexao = await conectarBanco();
    //vamos listar todos os produtos cadastrados no banco de dados
    try {
        const sql = 'SELECT * FROM produto';//busca todos os produtos no sql
        const [linhas] = await conexao.execute(sql);//executa a query
        res.json(linhas);//cria um array com os produtos
    } catch (error) {
        console.error('Erro na consulta:', error);
        res.status(500).json({ erro: error.message });//informa o erro ao cliente
    } finally {
        await conexao.end();//fecha a conexão
    }
});

app.post('/produto', async (req, res) => {
    const conexao = await conectarBanco();
    const novoProduto = req.body;
    try {
        const sql = `INSERT INTO produto (produto_nome, produto_descricao, produto_valor, produto_imagem, produto_status) VALUES (?, ?, ? ,?, ?)`;
        const [resultado] = await conexao.execute(sql, [
            novoProduto.produto_nome,
            novoProduto.produto_descricao,
            novoProduto.produto_valor,
            novoProduto.produto_imagem,
            novoProduto.produto_status
        ]);
        res.status(201).json({ id: resultado.insertId, ...novoProduto });
    } catch (error) {
        console.error('Erro na inserção: ', error);
        res.status(500).json({ erro: error.message });
    } finally { await conexao.end(); }
});

app.put('/produto/:id', async (req, res) => {
    const conexao = await conectarBanco();
    const id = req.params.id;
    const dados_produto = req.body;
    try {
        const sql = 'UPDATE produto SET produto_nome = ?, produto_descricao = ?, produto_valor = ?, produto_imagem = ?, produto_status = ? WHERE id_produto = ?';
        const dados = [
            dados_produto.produto_nome,
            dados_produto.produto_descricao,
            dados_produto.produto_valor,
            dados_produto.produto_imagem,
            dados_produto.produto_status,
            id
        ];
        const [resultado] = await conexao.execute(sql, dados);
        if (resultado.affectedRows > 0) {
            res.json({ id, ...dados_produto })
        } else {
            res.status(404).json({ erro: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ erro: error.message });
    } finally { await conexao.end(); }
});

app.delete('/produto/:id', async (req, res) => {
    const conexao = await conectarBanco();
    const id = req.params.id;
    try {
        const sql = 'DELETE FROM produto WHERE id_produto = ?';
        const [resultado] = await conexao.execute(sql, [id]);
        if (resultado.affectedRows > 0) {
            res.json({ mensagem: 'Produto deletado com sucesso' });
        } else {
            res.status(404).json({ erro: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ erro: error.message})
        console.error({ erro: error.message });
    } finally { await conexao.end(); }
});

app.get('/produto/:id', async (req, res) => {
    const conexao = await conectarBanco();
    const id = req.params.id;
    try {
        const sql = 'SELECT * FROM produto WHERE id_produto = ?';
        const [linhas] = await conexao.execute(sql, [id]);
        if (linhas.length > 0) {
            res.json(linhas[0]);
        } else {
            res.status(404).json({ erro: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro na consulta: ', error);
        res.status(500).json({ erro: error.message });
    } finally { await conexao.end(); }
});

const server = http.createServer(app);
server.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});