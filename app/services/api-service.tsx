import axios from 'axios';

// Criação de uma instância do Axios com a URL base da API
const api = axios.create({
  baseURL: 'http://localhost:8080', // Substitua pela URL da sua API
  timeout: 10000, // Tempo limite de requisição (opcional)
  headers: {
    'Content-Type': 'application/json',
    // Outros headers que você precisar
  }
});

// Função para obter dados (GET)
export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    throw error;
  }
};

// Função para enviar dados (POST)
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    return false;
  }
};

export default api;

