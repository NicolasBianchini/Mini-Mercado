const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparser = require('body-parser');
const path = require('path');
const multer = require('multer');

app.listen('3001', () => {
    console.log("Servidor ON!");
});

//Configuraçao Multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

//Body Parser

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

// Conexao com Banco de Dados

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mercado'
});

db.connect(function(err) {
    if(err)
    {
        console.log("Nao foi possivel se conectar ao banco!")
    }
})

//Telas de Vizualização

app.get('/', function(req,res) {
    res.render('index', {});
})

app.get('/mercado', function(req,res) {
    let query = db.query("select * from mercado", function(err,results){
        res.render('mercado', {lista:results});
    })
})

app.post('/', upload.single('imagem'), function(req, res) {
    console.log("Cadastro de produtos concluído!");
    let produto = req.body.produto;
    let estoque = req.body.estoque;
    let preco = req.body.preco;
    let imagem;

// Verifica se o arquivo foi enviado

if (req.file) {
    imagem = '/uploads/' + req.file.filename;
} else {
    console.log("Nenhuma imagem enviada");
    imagem = null;
}

// Insere o produto no banco de dados

db.query("INSERT INTO mercado (produto,estoque,preco,imagem) VALUES (?,?,?,?)", [produto,estoque,preco,imagem], function(err, results){})
res.render('index', {});
})