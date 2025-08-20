const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Conectar ao MongoDB - Base principal (usuários)
const mainDB = mongoose.createConnection('mongodb://tipolarium:f3d21563b187b3b75922dbf8d9ef586a@177.93.109.241:27017/app_users?authSource=admin');
mainDB.on('connected', () => console.log('✅ MongoDB Principal conectado com sucesso!'));
mainDB.on('error', (err) => console.error('❌ Erro ao conectar ao MongoDB Principal:', err));

// Conectar ao MongoDB - Base das configurações
const configDB = mongoose.createConnection('mongodb://tipolarium:f3d21563b187b3b75922dbf8d9ef586a@177.93.109.241:27017/app_configs?authSource=admin');
configDB.on('connected', () => console.log('✅ MongoDB Configurações conectado com sucesso!'));
configDB.on('error', (err) => console.error('❌ Erro ao conectar ao MongoDB Configurações:', err));

// Definir o Schema do usuário
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userId: { type: Number, unique: true },
  slug: { type: String, default: 'default' }, // Definido com valor padrão caso não seja fornecido
  firstName: { type: String },
  lastName: { type: String },
  isFirstAccess: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Modelo de usuários na base principal
const User = mainDB.model('users', userSchema);

// Schema para configurações do sistema (logo, cores, aulas, etc.)
const settingsSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // identificador único do projeto
  appName: { type: String, default: 'default' }, // nome da aplicação
  logoUrl: { type: String, default: '/img/polarium.png' },
  primaryColor: { type: String, default: '#3b82f6' }, // cor principal
  backgroundColor: { type: String, default: '#0f172a' }, // cor de fundo
  registerLink: { type: String, default: 'https://exemplo.com/registro' }, // URL externa para registro
  lessons: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    category: { type: String, default: 'Básico' }, // Básico, Configuração, Estratégias, etc.
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  }],
  socialLinks: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true }, // ex: 'fab fa-instagram', 'fas fa-globe'
    color: { type: String, default: '#3b82f6' }, // cor do ícone
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isMain: { type: Boolean, default: false } // se é um link principal (maior)
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Modelo de configurações na base separada
const Settings = configDB.model('app_settings', settingsSchema);


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
        const { email, firstName, lastName, userId, slug } = req.body;
        
        
        if (!email || !firstName || !lastName || !userId) {
            return res.status(400).json({ success: false, message: 'Os campos email, firstName, lastName e userId são obrigatórios' });
        }
        
        // Se o slug não for fornecido, usar 'default'
        const appSlug = slug || 'default';
        console.log('Slug a ser usado:', appSlug);

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Atualizando usuário existente com slug:', slug);
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.userId = userId;
            existingUser.slug = slug;
            existingUser.isFirstAccess = false;
            await existingUser.save();
            console.log('Usuário atualizado com sucesso:', existingUser);
            return res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso.' });
        }
        
        console.log('Criando novo usuário via registro de primeiro acesso:', email, 'com slug:', slug);
        const newUser = new User({ 
            email,
            firstName,
            lastName,
            userId,
            slug: slug,
            isFirstAccess: false 
        });
        await newUser.save();
        console.log('Novo usuário criado com slug:', newUser.slug);
        //console.log('Novo usuário criado:', newUser);
        
        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso.' });

    } catch (error) {
        console.error('Erro ao registrar primeiro acesso:', error);
        if (error.code === 11000) {
            return res.status(200).json({ success: true, message: 'Usuário já registrado.' });
        }
        res.status(500).json({ success: false, message: 'Erro ao registrar usuário',error: error.message });
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


// Rota para obter configurações do sistema
app.get('/api/settings/:slug?', async (req, res) => {
  try {
    const slug = req.params.slug || 'default';
    let settings = await Settings.findOne({ slug });
    
    // Se não existir configuração, criar uma padrão
    if (!settings) {
      settings = new Settings({ slug });
      await settings.save();
    }
    
    res.json({
      success: true,
      settings: {
        slug: settings.slug,
        appName: settings.appName,
        logoUrl: settings.logoUrl,
        primaryColor: settings.primaryColor,
        backgroundColor: settings.backgroundColor,
        registerLink: settings.registerLink,
        lessons: settings.lessons || [],
        socialLinks: settings.socialLinks || []
      }
    });
  } catch (error) {
    console.error('Erro ao obter configurações:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter configurações' });
  }
});

// Rota para atualizar configurações do sistema
app.post('/api/settings/:slug?', async (req, res) => {
  try {
    const slug = req.params.slug || 'default';
    const { logoUrl, primaryColor, backgroundColor, registerLink, lessons, socialLinks, appName } = req.body;
    
    let settings = await Settings.findOne({ slug });
    
    if (!settings) {
      settings = new Settings({ slug });
    }
    
    // Atualizar apenas os campos fornecidos
    if (appName !== undefined) settings.appName = appName;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (backgroundColor !== undefined) settings.backgroundColor = backgroundColor;
    if (registerLink !== undefined) settings.registerLink = registerLink;
    if (lessons !== undefined) settings.lessons = lessons;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;
    
    settings.updatedAt = new Date();
    await settings.save();
    
    console.log(`🎨 Configurações atualizadas para projeto: ${slug} (${settings.appName || 'sem nome'})`);
    
    res.json({
      success: true,
      message: `Configurações atualizadas com sucesso para ${slug}`,
      settings: {
        slug: settings.slug,
        appName: settings.appName,
        logoUrl: settings.logoUrl,
        primaryColor: settings.primaryColor,
        backgroundColor: settings.backgroundColor,
        registerLink: settings.registerLink,
        lessons: settings.lessons || [],
        socialLinks: settings.socialLinks || []
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar configurações' });
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