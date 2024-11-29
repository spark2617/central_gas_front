import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('central_gas_auth_token', token); // Salva o token no AsyncStorage
    console.log('Token salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar o token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('central_gas_auth_token'); // Recupera o token
    return token ? token : null;
  } catch (error) {
    console.error('Erro ao obter o token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('central_gas_auth_token'); // Remove o token
    console.log('Token removido com sucesso!');
  } catch (error) {
    console.error('Erro ao remover o token:', error);
  }
};
