const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');
const path = require('path');
const multer = require('multer');

app.listen('3001', () => {
    console.log("Servidor ON!");
});

// Configuração Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Body Parser
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com Banco de Dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mercado'
});

db.connect(function(err) {
    if (err) {
        console.log("Não foi possível se conectar ao banco!");
    }
});

// Rota principal
app.get('/', function(req, res) {
    res.render('index', {});
});

// Rota para visualizar produtos no mercado
app.get('/mercado', function(req, res) {
    db.query("SELECT * FROM mercado", function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro no servidor.");
        }
        res.render('mercado', { lista: results });
    });
});

// Rota para adicionar produto ao banco de dados
app.post('/', upload.single('imagem'), function(req, res) {
    let id = req.body.id;
    let produto = req.body.produto;
    let descricao = req.body.descricao;
    let estoque = req.body.estoque;
    let preco = req.body.preco;
    let imagem = req.file ? '/uploads/' + req.file.filename : null;

    db.query("INSERT INTO mercado (id, produto, descricao, estoque, preco, imagem) VALUES (?,?,?,?,?,?)", [id, produto, descricao, estoque, preco, imagem], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao cadastrar produto.");
        }
        res.render('index', {});
    });
});

// Rota para finalizar a compra e atualizar o estoque
app.post('/finalizar-compra', function(req, res) {
    const carrinhoCompra = req.body.carrinho;

    if (!carrinhoCompra || carrinhoCompra.length === 0) {
        return res.status(400).json({ error: "Carrinho vazio!" });
    }

    const promessas = carrinhoCompra.map(item => {
        return new Promise((resolve, reject) => {
            db.query("SELECT estoque FROM mercado WHERE produto = ?", [item.produto], function(err, results) {
                if (err || results.length === 0) {
                    return reject(`Erro ao verificar estoque do produto: ${item.produto}`);
                }

                const estoqueAtual = results[0].estoque;

                if (estoqueAtual < item.quantidade) {
                    return reject(`Estoque insuficiente para o produto: ${item.produto}`);
                }

                // Atualiza o estoque do produto no banco de dados
                const novoEstoque = estoqueAtual - item.quantidade;
                db.query("UPDATE mercado SET estoque = ? WHERE produto = ?", [novoEstoque, item.produto], function(err) {
                    if (err) {
                        return reject(`Erro ao atualizar estoque do produto: ${item.produto}`);
                    }
                    resolve();
                });
            });
        });
    });

    // Executa todas as promessas e finaliza a compra se todas forem concluídas
    Promise.all(promessas)
        .then(() => {
            carrinho = []; // Limpa o carrinho após a compra
            res.json({ message: "Compra finalizada com sucesso!" });
        })
        .catch(erro => {
            res.status(400).json({ error: erro });
        });
});


// Rota para buscar produtos
app.get('/buscar', function(req, res) {
    const busca = req.query.term;
    if (!busca) {
        return res.redirect('/mercado');
    }

    const query = "SELECT * FROM mercado WHERE produto LIKE ? OR descricao LIKE ?";
    db.query(query, [`%${busca}%`, `%${busca}%`], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro no servidor.");
        }
        res.render('mercado', { lista: results });
    });
});
