import { API } from "./api";


export const getPedidos = async (token) => {
    try {
      const response = await API.get('pedidos/', {
        headers: {
          'Authorization': `token ${token}`,  
        }
      });
      
      return response.data;
    } catch (error) {
      
      console.error('Erro ao obter pedidos:', error);
      throw error;
    }
  };

  export const createPedidos = async (token, pedido) => {
    try {
      const response = await API.post('pedidos/', pedido, {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',  // Adiciona o cabeçalho Content-Type
        }
      });
  
      return response.data;  // Retorna a resposta da API
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;  // Propaga o erro para ser tratado no componente
    }
  };
  