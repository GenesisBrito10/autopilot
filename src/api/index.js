import axios from 'axios';

/**
 * Determina a URL base da API com base no ambiente
 * 
 * Em ambiente de produção:
 * - Usa o protocolo e hostname atual (sem porta em ambientes não-localhost)
 * - Se estiver rodando em localhost na produção, mantém a porta
 * 
 * Em ambiente de desenvolvimento:
 * - Usa http://localhost:2006
 * 
 * Isso elimina a necessidade de hardcoded URLs que causam problemas
 * quando o aplicativo é implantado em diferentes ambientes/domínios.
 */
const getBaseUrl = () => {
 
  
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Se estiver rodando em localhost na produção, mantenha a porta
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const port = window.location.port;
      return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }
    
    // Em um domínio de produção, não inclua a porta
    return `${protocol}//${hostname}`;

};

// Criação de uma instância axios com a base URL configurada
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 61000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para logs (útil para debug)
apiClient.interceptors.request.use(config => {
  // console.log(`Requesting: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

export default apiClient;
