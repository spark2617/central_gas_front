import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClienteLoginCadastrar from './pages/clienteLoginCadastrar/ClienteLoginCadastrar';
import VerificationCodigo from './pages/verificacaoCodigo/verificacaoCodigo';
import AreaCliente from './pages/areaCliente/AreaCliente';
import UpdatePassword from './pages/updatePassword/UpdatePassword';
import ComoUsarApp from './pages/comoUsarApp/ComoUsarApp';
import ProductList from './pages/listaProduto/listaProduto';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const Stack = createNativeStackNavigator();

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={60} color="#009240" />
      </View>
    );
  }

  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  return (

    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#009240"
          }
        }}
      >

        <Stack.Screen name="Cliente_login_cadastrar" component={ClienteLoginCadastrar} />
        <Stack.Screen name="Area_do_cliente" component={AreaCliente} />
        <Stack.Screen name="ComoUsarApp" component={ComoUsarApp} />
        <Stack.Screen name="listaProduto" component={ProductList} />
        <Stack.Screen name="Verification" component={VerificationCodigo} initialParams={{ mode: "cadastro" }} />
        <Stack.Screen name="updatePassword" component={UpdatePassword} />

      </Stack.Navigator>
    </NavigationContainer>

  );
}
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});