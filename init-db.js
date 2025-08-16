const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://tipolarium:f3d21563b187b3b75922dbf8d9ef586a@177.93.109.241:27017/App_users?authSource=admin')
.then(() => console.log('MongoDB conectado com sucesso!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o Schema do usuário
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  userId: { type: Number, unique: true },
  isFirstAccess: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('users', userSchema);

// Função para adicionar um usuário de teste
const addTestUser = async () => {
  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Usuário de teste já existe:', existingUser);
      return existingUser;
    }
    
    // Criar novo usuário
    const newUser = new User({
      email: 'test@example.com',
      firstName: 'Usuário',
      lastName: 'Teste',
      isFirstAccess: true
    });
    
    await newUser.save();
    console.log('Usuário de teste criado com sucesso:', newUser);
    return newUser;
  } catch (error) {
    console.error('Erro ao adicionar usuário de teste:', error);
  }
};

// Executar a função e fechar a conexão
addTestUser()
  .then(() => {
    console.log('Inicialização do banco de dados concluída!');
    setTimeout(() => mongoose.connection.close(), 1000);
  })
  .catch(err => {
    console.error('Erro durante a inicialização do banco de dados:', err);
    mongoose.connection.close();
  });
