import { API } from "./api";

export const reenviarCodigo = async (userData) => {
  try {
    const response = await API.post('/Reenviar_codigo/', userData);
    return response.data;

    
  } catch (error) {

    console.error('Error na verificação de codigo:', error);

    throw error;
  }
};

export const resendPasswordRecoveryCode = async (userData) => {
  try {
    const response = await API.post('/Reenviar_codigo/', userData);
    return response.data;

    
  } catch (error) {

    console.error('Error na verificação de codigo:', error);

    throw error;
  }
};