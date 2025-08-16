const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://tipolarium:f3d21563b187b3b75922dbf8d9ef586a@177.93.109.241:27017/App_users?authSource=admin')
.then(() => console.log('MongoDB conectado com sucesso!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o Schema do usuário
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userId: { type: Number, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  isFirstAccess: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('users', userSchema);


// Rota para APENAS verificar se o usuário existe
app.post('/api/verify-user', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email é obrigatório' });
    }
    
    //console.log('Verificando usuário com email:', email);
    
    const user = await User.findOne({ email });
    
    // Se não existir, informa ao frontend que é um novo usuário, mas NÃO o cria.
    if (!user) {
      //console.log('Usuário não encontrado. Informando que é primeiro acesso.');
      return res.json({ 
        success: true, 
        user: {
          isFirstAccess: true, // Informa que é o primeiro acesso
          email: email
        }
      });
    }
    
    // Se existir, retorna os dados normalmente
    //console.log('Usuário encontrado:', user);
    res.json({ 
      success: true, 
      user: {
        email: user.email,
        userId: user.userId,
        isFirstAccess: user.isFirstAccess,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao verificar usuário' });
  }
});

// Rota para criar o usuário DEPOIS do clique no modal de primeiro acesso
app.post('/api/register-first-access', async (req, res) => {
    try {
        const { email,firstName,lastName,userId } = req.body;
        if (!email || !firstName || !lastName || !userId) {
            return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Tentativa de registro duplicada para:', email);
            return res.status(200).json({ success: true, message: 'Usuário já registrado.' });
        }
        
        //console.log('Criando novo usuário via registro de primeiro acesso:', email);
        const newUser = new User({ 
            email,
            firstName,
            lastName,
            userId,
            isFirstAccess: false 
        });
        await newUser.save();
        //console.log('Novo usuário criado:', newUser);
        
        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso.' });

    } catch (error) {
        console.error('Erro ao registrar primeiro acesso:', error);
        if (error.code === 11000) {
            return res.status(200).json({ success: true, message: 'Usuário já registrado.' });
        }
        res.status(500).json({ success: false, message: 'Erro ao registrar usuário' });
    }
});


// Rota de proxy para o registro principal
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

// Rota para obter a hora do servidor
app.get('/server-time', (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// Configuração para servir o frontend
app.use(history());
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = 2006;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});