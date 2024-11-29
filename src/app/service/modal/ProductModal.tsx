import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { getToken } from "../storagem/token";
import { createPedidos } from "../API/pedido";

export default function ResultadoPesquisaModal({
  visible,
  onClose,
  onSeePrice,
  onCancelOrder,
  notification,
}) {
  const [orderResults, setOrderResults] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [loading, setLoading] = useState(false); // Para controlar o estado de loading do botão

  // Função para buscar os resultados armazenados no AsyncStorage
  async function buscarEmpresaMaisProxima() {
    try {
      const result = await AsyncStorage.getItem("orderResults");
      if (result !== null) {
        const parsedResult = JSON.parse(result);
        if (parsedResult.produtos) {
          setOrderResults(parsedResult.produtos);
        } else {
          console.log("Nenhum produto encontrado.");
        }
      } else {
        console.log("Nenhum resultado encontrado no AsyncStorage.");
      }
    } catch (error) {
      console.error("Erro ao ler dados do AsyncStorage", error);
    }
  }

  // Função para atualizar a data selecionada
  const handleDateChange = (id, event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(null); // Fecha o DatePicker no Android
    }

    if (date) {
      setSelectedDates((prevDates) => ({
        ...prevDates,
        [id]: date, // Usa o produto_id como chave
      }));
    }
  };

  // Função para limpar a data selecionada
  const clearSelectedDate = (id) => {
    setSelectedDates((prevDates) => {
      const newDates = { ...prevDates };
      delete newDates[id]; // Remove a data associada ao produto_id
      return newDates;
    });
  };

  // Função para confirmar pedido
  const confirmarPedido = async (produtoId, quantidade) => {
    setLoading(true); // Ativa o loading no botão

    const token = await getToken();
    const pedido = {
      produto_id: produtoId,
      expectativa: selectedDates[produtoId] || null, // Se houver data, utiliza, caso contrário, null
      quantidade: quantidade,
    };

    console.log(pedido.quantidade)

    try {
      const response = await createPedidos(token, pedido); // Chama a função para criar o pedido
      console.log('Pedido criado com sucesso:', response);
      
      // Remove o produto da lista após confirmação
      setOrderResults((prevResults) => prevResults.filter(item => item.produto_id !== produtoId));

      notification()


    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    } finally {
      setLoading(false); // Desativa o loading do botão
    }
  };

  // Função para cancelar o pedido
  const cancelarPedido = (produtoId) => {
    setOrderResults((prevResults) => prevResults.filter(item => item.produto_id !== produtoId));
    onCancelOrder(produtoId); // Chama a função onCancelOrder se precisar de alguma ação adicional
  };

  useEffect(() => {
    if (visible) {
      buscarEmpresaMaisProxima();
    }
  }, [visible]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };



  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Resultado da Pesquisa</Text>

          <FlatList
            data={orderResults}
            keyExtractor={(item) => item.produto_id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: item.logo_empresa || "https://via.placeholder.com/50",
                    }}
                    style={styles.companyImage}
                  />
                  <Text style={styles.companyName}>{item.empresa_nome.toUpperCase()}</Text>
                  <Text>{formatCurrency(item.preco * item.quantidade)}</Text>
                </View>
                <View style={styles.unitInfo}>
                  <Text>Unidade: {item.produto_nome.toUpperCase()}</Text>
                  <Text>Quantidade: {item.quantidade}x {formatCurrency(item.preco)}</Text>
                </View>

                {/* Campo de Data */}
                <View style={styles.dateContainer}>
                  <Text style={styles.expectativaText}>Expectativa:</Text>
                  <Icon
                    name="calendar"
                    size={20}
                    color="#333"
                    style={styles.calendarIcon}
                    onPress={() => setShowDatePicker(item.produto_id)} // Garante que é o produto_id
                  />
                  <Text style={styles.dateText}>
                    {selectedDates[item.produto_id]
                      ? selectedDates[item.produto_id]?.toLocaleDateString("pt-BR")
                      : "Selecione a data"}
                  </Text>

                  {/* Botão para limpar a data */}
                  {selectedDates[item.produto_id] && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => clearSelectedDate(item.produto_id)}
                    >
                      <Text style={styles.clearButtonText}>Remover</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showDatePicker === item.produto_id && (
                  <DateTimePicker
                    value={selectedDates[item.produto_id] || new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()} // Restringe a seleção de datas anteriores
                    onChange={(event, date) => handleDateChange(item.produto_id, event, date)} // Usa produto_id
                  />
                )}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.seePriceButton}
                    onPress={() => confirmarPedido(item.produto_id, item.quantidade)}
                    disabled={loading} // Desabilita o botão durante o carregamento
                  >
                    <Text style={styles.seePriceText}>
                      {loading ? "Carregando..." : "Confirmar Pedido"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => cancelarPedido(item.produto_id)}>
                    <Text style={styles.cancelText}>Cancelar Pedido</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  resultItem: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  companyImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  unitInfo: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 12,
    color: "#777",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "80%",
  },
  expectativaText: {
    fontSize: 14,
    marginRight: 10,
    color: "#555",
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  clearButton: {
    backgroundColor: "#E57373",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  clearButtonText: {
    color: "#FFF",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  seePriceButton: {
    flex: 1,
    backgroundColor: "#2B4C2F",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: "center",
  },
  seePriceText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E57373",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  cancelText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#CCC",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  closeButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
