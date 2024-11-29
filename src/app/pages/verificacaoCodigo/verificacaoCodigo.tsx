import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { colors } from "../../style/colors";
import NotificationModal from "../../service/modal/NotificationModal";
import { useNavigation } from "@react-navigation/native";

export default function VerificationCodigo({ route }: any) {
  const { num, mode, functionVerificationCodeCadastro, functionVerificationCodeRecuperarSenha, reenviarCodigoCadastro, reenviarCodigoRecuperarSenha } = route.params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [typeModal, setTypeModal] = useState("envio");
  const [isLoading, setIsLoading] = useState(false);
  const [codigo, setCodigo] = useState("")
  const navigation = useNavigation();

  const showNotification = () => setModalVisible(true);
  function closeNotification() {
    setModalVisible(false);
    typeModal === "sucesso" && mode === "login" ? navigation.navigate("updatePassword", { num: num, codigo: codigo }) : ""
    typeModal === "sucesso" && mode === "cadastro" ? navigation.navigate('Cliente_login_cadastrar', { screen: 'Login' }) : ""

  }
  const goBack = () => navigation.goBack();

  const validationSchema = Yup.object().shape({
    codigo: Yup.string().required("Código é obrigatório"),
  });

  const handleClickVerificationCode = async (values: any) => {
    const data = { telefone: `${num}`, codigo: values.codigo };

    try {
      setIsSubmitting(true);

      const response =
        mode === "cadastro"
          ? await functionVerificationCodeCadastro(data)
          : await functionVerificationCodeRecuperarSenha(data);


      setMensagemModal("Código verificado com sucesso!");

      setTypeModal("sucesso");
      showNotification();

      setCodigo(values.codigo)
    } catch (error) {
      console.log("entrou no erro, pag: verification")
      setTypeModal("error");
      let errorMessage = "Erro ao verificar o código. Tente novamente.";

      if (error.response) {
        const status = error.response.status;
        errorMessage =
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : status === 400
              ? "Código inválido."
              : status === 500
                ? "Erro interno do servidor. Tente novamente mais tarde."
                : "Erro desconhecido. Tente novamente.";
      }

      else if (error.request) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
        setTypeModal("conection");
      }
      setMensagemModal(errorMessage);
      showNotification();

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickReenviarCode = async () => {
    const data = { telefone: `${num}` };

    try {
      setIsLoading(true)
      const response =
        mode === "cadastro"
          ? await reenviarCodigoCadastro(data)
          : await reenviarCodigoRecuperarSenha(data);

      const successMessage = "Código reenviado com sucesso!";
      setMensagemModal(successMessage);
      setTypeModal("sucesso");
      showNotification();
    } catch (error) {
      setMensagemModal("Erro ao reenviar código. Tente novamente.");
      setTypeModal("error");
      showNotification();
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
    <View style={{ flex: 1, padding: 50 }}>


      <TouchableOpacity onPress={goBack}>
        <Ionicons name="arrow-back" size={36} color="white" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.formTitle}>
          {mode === "cadastro" ? "Verificação de cadastro" : "Recuperação de senha"}
        </Text>
        <NotificationModal
          visible={isModalVisible}
          onClose={closeNotification}
          message={mensagemModal}
          type={typeModal}
        />

        <Formik
          initialValues={{ codigo: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleClickVerificationCode(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                style={[styles.input, touched.codigo && errors.codigo ? styles.inputError : null]}
                placeholder="Código"
                keyboardType="numeric"
                placeholderTextColor="#C4C4C4"
                onChangeText={handleChange("codigo")}
                onBlur={handleBlur("codigo")}
                value={values.codigo}
              />
              {touched.codigo && errors.codigo && <Text style={styles.errorText}>{errors.codigo}</Text>}

              <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()}>
                {isSubmitting ? (
                  <ActivityIndicator color="green" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {mode === "cadastro" ? "VERIFICAR CADASTRO" : "VERIFICAR RECUPERAÇÃO"}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.containerEsqSenha}>
                <TouchableOpacity onPress={handleClickReenviarCode}>
                  <Text style={styles.textEsqSenha}>Reenviar código</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>

      </View>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  container: {
    marginTop: 98,
    padding: 20,
    backgroundColor: "#2B4C2F",
    borderRadius: 6,
  },
  formTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 8,
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    height: 45,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    textAlign: "center",
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 35,
  },
  submitButtonText: {
    color: "#2B4C2F",
    fontWeight: "bold",
  },
  containerEsqSenha: {
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  textEsqSenha: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 40,
    color: colors.cinza[100],
  },
});
