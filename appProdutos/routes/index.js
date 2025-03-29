var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET detalhes de um cliente */
router.get('/clientes/:id', function(req, res) {
  axios.get('http://localhost:3000/clientes')
    .then(resp => {
      const clientes = resp.data;  // Lista de filmes
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

/* GET lista de filmes */
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

module.exports = router;