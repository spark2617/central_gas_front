import { login_cliente } from "@/src/app/service/API/login_cliente";
import NotificationModal from "@/src/app/service/modal/NotificationModal";
import { colors } from "@/src/app/style/colors"
import { useNavigation } from "@react-navigation/native";
import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react"
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import * as Yup from "yup";
import Header from "./Header";
import Footer from "./footer";
import { checkPasswordRecoveryCode } from "@/src/app/service/API/verificationCode";
import { resendPasswordRecoveryCode } from "@/src/app/service/API/reeviarCodigo";
import { recuperarSenha } from "@/src/app/service/API/cliente_api";
import { Ionicons } from "@expo/vector-icons";
import { saveToken } from "@/src/app/service/storagem/token";


interface FormValues {
  telefone: string;
  senha: string;
}

const validationSchema = Yup.object().shape({
  telefone: Yup.string()
    .required("Telefone é obrigatório"),
  senha: Yup.string().required("Senha é obrigatória"),

});


export default function Login() {

  const [isModalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("")

  const [isSubmitting, setIssubmitting] = useState(false)

  const [typeModal, setTypeModal] = useState("envio")

  const navigation = useNavigation();

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [telefone, setTelefone] = useState("")

  const [isLoading, setIsLoading] = useState(false);

  const showNotification = () => {
    setModalVisible(true);
  };

  const closeNotification = () => {
    setModalVisible(false);

    typeModal == "envio" ? navigation.navigate('Verification', { num: `55${telefone}` , mode: "recuperar_senha", functionVerificationCodeRecuperarSenha: checkPasswordRecoveryCode, reenviarCodigoRecuperarSenha: resendPasswordRecoveryCode }) : ""
  };



  function togglePasswordVisibility() {
    setPasswordVisible(!isPasswordVisible);
  };

  async function handleLogin(values: FormValues) {

    const data = {
      telefone: `55${values.telefone}`,
      password: values.senha
    }

    try {
      setIssubmitting(true)
      const response = await login_cliente(data)
      setIssubmitting(false)
      
      await saveToken(response.token)
      navigation.navigate('Area_do_cliente')

    } catch (error) {

      setTypeModal("error")

      const status = error.response?.status
      console.log(error)

      let errorMessage = "Senha ou Telefone está incorreto"

      if (status == 400) {
        errorMessage = " Senha ou Telefone está incorreto"

      } else if (status === 401) {
        if (error.response.data.detail === "Não encontramos esse usuario em nossa base de dados") {
          errorMessage = "Número de telefone não cadastrado"
        }
        else {
          errorMessage = "Senha incorreta"
        }
      }
      else if (status == 500) {
        errorMessage = "Error no servidor. Tente novamente mais tarde!"
      }
      setIssubmitting(false)
      setMensagemModal(errorMessage)
      showNotification()

    }
  }

  async function handleClickEsqueciSenha(telefone: string) {
    setIsLoading(true)
    if (!telefone) {
      setMensagemModal("Por favor, insira um telefone válido antes de prosseguir.");
      setTypeModal("error");
      setModalVisible(true);
      setIsLoading(false)
      return;
    }

    const data = { telefone: `55${telefone}` };

    try {
      await recuperarSenha(data);

      setMensagemModal("Estamos enviando um código no WhatsApp para recuperação de senha.");
      setTypeModal("envio");
      setModalVisible(true);

      setTelefone(telefone)
    } catch (error) {

      const status = error.response.status

      if (status == 404) {
        setMensagemModal("Verifique seu numero de telefone")
      } else if (status == 500) {
        setMensagemModal("Erro no servidor. Tente novamente mais tarde.")
      }

      setTypeModal("error");
      setModalVisible(true);
    }
    setIsLoading(false)
  }



  return (
    <ScrollView style={{ backgroundColor: "#009240" }}>

      <Header
        breadcrumbs={[
          { label: "Página Inicial", onPress: () => navigation.navigate("Home") },
          { label: "Como usar app", onPress: () => navigation.navigate("ComoUsarApp") },
          { label: "Cadastrar", onPress: () => navigation.navigate("Cliente_login_cadastrar", { screen: "Cadastrar" }) },
        ]}
      />
      <Formik
        initialValues={{
          telefone: "",
          senha: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >

        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>LOGIN</Text>
            <TextInput style={styles.input} placeholder="TELEFONE CELULAR COM DDD" placeholderTextColor="#C4C4C4" onChangeText={handleChange("telefone")} onBlur={handleBlur("telefone")} keyboardType="phone-pad" />
            {touched.telefone && errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}


            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="SENHA"
                placeholderTextColor="#C4C4C4"
                autoCapitalize="none"
                secureTextEntry={!isPasswordVisible}
                onChangeText={handleChange("senha")}
                onBlur={handleBlur("senha")}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#a6a6a6"
                />
              </TouchableOpacity>
            </View>
            {touched.senha && errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit()} disabled={isSubmitting}>

              {isSubmitting ? (
                <ActivityIndicator color="green" />
              ) : (
                <Text style={styles.submitButtonText}>ACESSAR O APP</Text>
              )}


            </TouchableOpacity>

            <View style={styles.containerEsqSenha}>
              <TouchableOpacity onPress={() => handleClickEsqueciSenha(values.telefone)}>
                <Text style={styles.textEsqSenha}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </View>

            {/* modal de notificação */}
            <NotificationModal
              visible={isModalVisible}
              onClose={closeNotification}
              message={mensagemModal}
              type={typeModal}
            />


          </View>
        )}

      </Formik>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      )}
      <Footer themeDark={false} />
    </ScrollView>

  )
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
  formContainer: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#2B4C2F',
    height: 400,
    borderTopWidth:3,
    borderBottomWidth:3,
    borderColor:"#fff"
  },
  formTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    color: '#000',
    height: 45,
    marginTop: 15,
  },
  inputContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginRight: 5,
  },
  mediumInput: {
    flex: 2,
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 35,
  },
  submitButtonText: {
    color: '#2B4C2F',
    fontWeight: 'bold',
  },

  containerEsqSenha: {
    justifyContent: "center",
    alignItems: "center",
    width: "auto"
  },
  textEsqSenha: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 30,
    color: colors.cinza[100]
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginVertical: 5,
  },
})