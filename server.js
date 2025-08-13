const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const axios = require('axios');

const app = express();

app.use(express.json());

app.get('/server-time', (req, res) => {
  res.json({ time: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.trade.polariumbroker.com/v3/users/register',
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Erro no proxy de registro:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Erro interno do servidor ao tentar registrar.' });
    }
  }
});

app.use(history());

app.use(express.static(path.join(__dirname, 'dist')));

const PORT = 2006;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
