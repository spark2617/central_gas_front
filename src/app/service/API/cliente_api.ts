import { API } from "./api";

export const registerUser = async (userData:any) => {
  try {
    const response = await API.post('clientes/', userData);
    return response.data;

    
  } catch (error) {

    console.error('Erro ao registrar usuário:', error);

    throw error;
  }
};


export async function recuperarSenha(data:any){
  try {
    const response = await API.post('recuperar_senha/', data);
    return response.data;

    
  } catch (error) {

    console.error('Erro ao registrar usuário:', error);

    throw error;
  }
}

export async function atualizarSenha(data:any){
  try {
    const response = await API.post('atualizar_senha/', data);
    return response.data;

    
  } catch (error) {

    console.error('Erro ao registrar usuário:', error);

    throw error;
  }
}

export const getUser = async (token) => {
  try {
    const response = await API.get('clientes/', {
      headers: {
        'Authorization': `Token ${token}`,  
      }
    });
    
    return response.data;
  } catch (error) {
    
    console.error('Erro ao obter pedidos:', error);
    throw error;
  }
};