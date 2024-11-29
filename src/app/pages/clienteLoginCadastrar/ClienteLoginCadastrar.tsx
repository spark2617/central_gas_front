import React from 'react';
import Login from '@/components/Login';
import Cadastrar from '@/components/cadastrar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function ClienteLoginCadastrar(){


  const Tab = createNativeStackNavigator()


  // navigation.navigate('ClienteLoginCadastrar', { screen: 'Cadastrar' });  >>>> para entrar na pagina de cadastro

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
      >
        
        <Tab.Screen name='Cadastrar' component={Cadastrar} />
        <Tab.Screen name='Login' component={Login} />
        
      </Tab.Navigator>     

    </>
  );
}


