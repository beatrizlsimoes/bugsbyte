var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET forms editar cliente. */
router.get('/clientes/:id/edit', function(req, res) {
  let nomeCliente = decodeURIComponent(req.params.id); // Decodificar o título da URL
  
  axios.get('http://localhost:3000/clientes')
    .then(resp => {
      let clientes = resp.data;
      let cliente = clientes.find(f => f.id.trim() === nomeCliente.trim()); // Garantir que não haja espaços extras
      if (cliente) {
        res.render('editarcliente', { cliente: cliente, tit: "Editar cliente" });
      } else {
        res.status(404).render('error', { error: "cliente não encontrado" });
      }
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* GET detalhes de um cliente */
router.get('/clientes/:id', function(req, res) {
  axios.get('http://localhost:3000/clientes')
    .then(resp => {
      const clientes = resp.data;  // Lista de clientes
      const cliParams = decodeURIComponent(req.params.id); // Decodifica espaços e caracteres especiais
      const cliente = clientes.find(f => f.id === cliParams);

      if (cliente) {
        res.render('cliente', { cliente: cliente, tit: "Detalhes do Cliente" });
      } else {
        res.status(404).render('error', { error: "Cliente não encontrado" });
      }
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* POST para excluir um filme */
router.post('/clientes/:id/delete', function(req, res) {
  let nomeCliente = decodeURIComponent(req.params.id); // Decodificar o título da URL

  axios.delete(`http://localhost:3000/clientes/${encodeURIComponent(nomeCliente)}`)
    .then(resp => {
      console.log("Cliente excluído:", resp.data);
      res.redirect('/clientes'); // Redireciona para a lista de clientes após a exclusão
    })
    .catch(error => {
      console.log(error);
      res.status(500).render("error", { error: error });
    });
});

/* GET lista de clientes */
router.get('/clientes', function(req, res) {
  axios.get('http://localhost:3000/clientes')
    .then(resp => {
      res.render('clientes', { lclientes: resp.data, tit: "Lista de Clientes" });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});

/* GET lista de produtos */
router.get('/produtos', function(req, res) {
  axios.get('http://localhost:3000/produtos') // Buscar todos os produtos
    .then(resp => {
      res.render('produtos', { produtos: resp.data, tit: "Lista de Produtos" });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error });
    });
});


router.post('/clientes/:id/edit', function(req, res) {
  let id = req.params.id;
  let result = req.body;

  // Garantir que "Ultimos_produtos" é um array
  if (typeof result.Ultimos_produtos === 'string') {
    result.Ultimos_produtos = result.Ultimos_produtos.split(',').map(a => a.trim());
  } else if (!Array.isArray(result.Ultimos_produtos)) {
    result.Ultimos_produtos = [];
  }

  // Adicionar novo produto se existir
  if (result["Novo Produto"] && result["Novo Produto"].trim() !== "") {
    result.Ultimos_produtos.push(result["Novo Produto"].trim());
  }
  delete result["Novo Produto"];

  // Normalizar "cartão" para "cartao"
  if (result["cartão"]) {
    result.cartao = result["cartão"].trim();
    delete result["cartão"];
  }

  // Garantir que o ID se mantém
  result.id = id;

  console.log("Enviando PUT para:", `http://localhost:3000/clientes/${id}`);
  console.log("Dados enviados:", result);

  axios.put(`http://localhost:3000/clientes/${id}`, result)
    .then(resp => {
      console.log("Resposta do backend:", resp.data);
      res.status(201).redirect('/clientes');
    })
    .catch(erro => {
      console.log(erro);
      res.status(500).render("error", { 'error': erro });
    });
});


module.exports = router;