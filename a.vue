const startSdk = async () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);        if (user && user.firstName) {
          userDisplayName.value = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
          console.log('Nome de usuário carregado do localStorage:', userDisplayName.value);
          
          window.dispatchEvent(new CustomEvent('app:user-name-updated', {
            detail: { name: userDisplayName.value }
          }));
        } else {
        console.warn('Objeto de usuário encontrado, mas firstName está ausente:', user);
      }
    } catch (error) {
      console.error('Erro ao analisar objeto de usuário do localStorage:', error);
    }
  } else {
    console.log('Objeto de usuário não encontrado no localStorage, tentando obter via API...');
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
    if (email && password) {
      try {
        const response = await axios.post('/api/sdk/start', { email, password });
        if (response.data && response.data.data) {
          localStorage.setItem("user", JSON.stringify({
            firstName: response.data.data.firstName || 'Usuário(a)',
            email: email
          }));
          localStorage.setItem("userId", response.data.data.userId);
          localStorage.setItem("firstName", response.data.data.firstName);
          localStorage.setItem("lastName", response.data.data.lastName);
          userDisplayName.value = response.data.data.firstName.charAt(0).toUpperCase() + response.data.data.firstName.slice(1) || 'Usuário(a)';
          console.log('Nome de usuário obtido via API:', userDisplayName.value);
          
          window.dispatchEvent(new CustomEvent('app:user-name-updated', {
            detail: { name: userDisplayName.value }
          }));
        } else {
          console.warn('Resposta da API não contém dados de usuário:', response.data);
        }
      } catch (error) {
        console.error("Erro ao iniciar SDK:", error);
      }
    } else {
      console.error('Credenciais não encontradas no localStorage');
    }
  }
};

const buyDigital = async (payload) => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.post('/api/trade/digital/buy', { ...payload, email, password });
  return data;
}

const checkOrderStatus = async (orderId, uniqueId) => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.get('/api/order', { params: { email, password, orderId: Number(orderId), uniqueId, collection: COLLECTION_NAME } });
  return data;
}

const getAccountBalance = async () => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.post('/api/account/balance', { email, password });
  return data;
}

const getHistory = async () => {
  const email = localStorage.getItem('userEmail');
  if (!email) throw new Error('Email não encontrado.');
  const { data } = await axios.get('/api/order/history', { params: { email, collection: COLLECTION_NAME } });
  return data;
}

const getCandles = async (pair, period) => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.get('/api/candles', { params: { pair, period, email, password } });
  return data;
}

const getAvailableAssets = async () => {
  const email = localStorage.getItem('userEmail');
  const password = localStorage.getItem('userPassword');
  if (!email || !password) throw new Error('Credenciais não encontradas.');
  const { data } = await axios.get('/api/candles/digital', { params: { email, password } });
  return data;
}

const getServerTime = async () => {
  try {
    const response = await axios.get('/server-time', { baseURL:'/' });
    return new Date(response.data.time);
  } catch (error) {
    console.error("Erro ao buscar a hora do servidor, usando hora local como fallback:", error);
    return new Date();
  }
};