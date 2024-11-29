import { API } from "./api";

export const verificationCode = async (userData) => {
  try {
    const response = await API.post('/verification_code/', userData);
    return response.data;

    
  } catch (error) {

    console.error('Error na verificação de codigo:', error);

    throw error;
  }
};

export const checkPasswordRecoveryCode = async (userData) => {
  try {
    const response = await API.post('/verification_code_recuperação/', userData);
    return response.data;

    
  } catch (error) {

    console.error('Error na verificação de codigo:', error);

    throw error;
  }
};