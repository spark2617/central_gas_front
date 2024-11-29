import { API } from "./api";

interface Data {
    telefone: string;
  }

export const login_cliente = async (data:Data) => {
  try {
    const response = await API.post('recuperar_senha/', data);
    return response.data;

    
  } catch (error) {

    console.error('Error ao fazer login do usuario:', error);

    throw error;
  }
};