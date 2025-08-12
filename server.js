const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const axios = require('axios');
const app = express();

// Suporte ao modo history do Vue Router
app.use(history());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy para signals API externa (evita CORS no frontend)
app.use('/api/proxy/signals', express.json(), async (req, res) => {
  try {
    const { pair, timeframe, candles } = req.body;
    // Adapte o token conforme necessário
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3aW5kc29uMzQzM0BnbWFpbC5jb20iLCJleHAiOjE3NTQ3NjUwMjN9.q_QrBS68-rDHjs7Ba1xCFC25FMNlerPS4CVX_p8sr5o';
    const response = await axios.post(
      'https://api-signals.tradeautopilot.ai/signals',
      { pair, timeframe, candles },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error || err.message || 'Erro ao proxy signals'
    });
  }
});

const PORT =  2005;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});