import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEmpresasMaisProximas } from '../API/empresaMaisProxima';
import { getToken } from '../storagem/token';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Visible {
  visible: boolean;
  onClose: () => void;
  onModalResult: () => void;
}

const ModalFazerPedido = ({ visible, onClose, onModalResult }: Visible,) => {
  const produtos = [
    { id: '1', nome: 'Gás' },
    { id: '2', nome: 'Água' },
    { id: '3', nome: 'Mangueira' },
    { id: '4', nome: 'Registro' },
    { id: '5', nome: 'Bomba Hidráulica de Água' },
    { id: '6', nome: 'Carvão' },
  ];

  const [selectedProducts, setSelectedProducts] = useState<any>({});


  const handleProductToggle = (product: any) => {
    setSelectedProducts((prevSelected: any) => {
      const newSelected = { ...prevSelected };
      if (newSelected[product.id]) {
        delete newSelected[product.id];
      } else {
        newSelected[product.id] = { ...product, quantidade: 1 };
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (productId: string, increment: boolean) => {
    setSelectedProducts((prevSelected: any) => {
      const currentQuantity = prevSelected[productId]?.quantidade || 1;
      const newQuantity = increment ? currentQuantity + 1 : Math.max(currentQuantity - 1, 1);
      return {
        ...prevSelected,
        [productId]: {
          ...prevSelected[productId],
          quantidade: newQuantity,
        },
      };
    });
  };


  const handleConfirmOrder = async () => {
    // Cria uma lista de IDs e quantidades dos produtos selecionados
    const orderDetails = Object.values(selectedProducts).map((product: any) => ({
      id: Number(product.id),  // Converte o ID para número
      nome: product.nome,
      quantidade: Number(product.quantidade),  // Garante que a quantidade seja um número
    }));

    try {
      const token = await getToken(); // Pega o token do contexto ou autenticação
      
      // Faz a requisição à API, passando os detalhes do pedido
      const response = await getEmpresasMaisProximas(token, orderDetails);

      await AsyncStorage.setItem('orderResults', JSON.stringify(response));

      onClose();
      onModalResult();
      setSelectedProducts({});  
  
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      // Aqui você pode adicionar algum tratamento de erro para o usuário
    }
  };
  
  
  


  return (

    <Modal visible={visible} animationType="slide" transparent={true}>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Escolha aqui o(s) produto(s) que deseja </Text>
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <TouchableOpacity
                  style={[
                    styles.productToggle,
                    selectedProducts[item.id] && styles.selectedProduct,
                  ]}
                  onPress={() => handleProductToggle(item)}
                >
                  <Text style={styles.productText}>{item.nome}</Text>
                </TouchableOpacity>
                {selectedProducts[item.id] && (
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, false)}>
                      <Ionicons name="remove-circle-outline" size={24} color="#00796b" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {selectedProducts[item.id].quantidade}
                    </Text>
                    <TouchableOpacity onPress={() => handleQuantityChange(item.id, true)}>
                      <Ionicons name="add-circle-outline" size={24} color="#00796b" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            ListEmptyComponent={<Text>Nenhum produto disponível.</Text>}
          />

          <TouchableOpacity
            style={[styles.confirmButton, !Object.keys(selectedProducts).length && styles.disabledButton]}
            onPress={handleConfirmOrder}
            disabled={!Object.keys(selectedProducts).length}
          >
            <Text style={styles.confirmButtonText}>Proceguir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: 300
  },
  productToggle: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#28a745',
    borderWidth: 1,

  },
  selectedProduct: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00796b',
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#f00',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ModalFazerPedido;
