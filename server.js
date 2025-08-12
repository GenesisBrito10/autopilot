const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const axios = require('axios');
const app = express();

// Suporte ao modo history do Vue Router
app.use(history());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

const PORT =  2006;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});