import axios from 'axios';
import { API } from './api';


// Função para obter as empresas mais próximas com produtos
export const getEmpresasMaisProximas = async (token: string, listaProdutos: number[]) => {
  try {
    // Fazendo a requisição para a API
    const response = await API.post(
      'buscar-empresa-mais-proxima/', // Substitua pela URL correta da API
      {
 
        produtos: listaProdutos,  // Lista de IDs dos produtos (certifique-se de que sejam números)
      },
      {
        headers: {
          'Authorization': `token ${token}`, // Definindo o token no header para autenticação
          'Content-Type': 'application/json',  // Garantindo que o tipo de conteúdo seja JSON
        },
      }
    );

    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Em caso de erro, exibe a mensagem de erro no console
    console.error('Erro ao obter empresas mais próximas:', error.response ? error.response.data : error.message);
    throw error; // Lança o erro para ser tratado em outro lugar
  }
};

