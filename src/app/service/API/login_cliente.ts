import { API } from "./api";

interface Data {
    telefone: string;
    password: string;
  }

export const login_cliente = async (data:Data) => {
  try {
    const response = await API.post('login/', data);
    return response.data;

    
  } catch (error) {

    console.error('Error ao fazer login do usuario:', error);

    throw error;
  }
};