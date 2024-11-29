import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { registerUser } from "@/src/app/service/API/cliente_api";
import NotificationModal from "@/src/app/service/modal/NotificationModal";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import Header from "./Header";
import Footer from "./footer";
import { verificationCode } from "@/src/app/service/API/verificationCode";
import { reenviarCodigo } from "@/src/app/service/API/reeviarCodigo";
import { Ionicons } from "@expo/vector-icons";

interface FormValues {
  nome: string;
  telefone: string;
  rua: string;
  bairro: string;
  complemento: string;
  numero: string;
  estado: string;
  cidade: string;
  senha: string;
  confirmarSenha: string;
}

const initialValues: FormValues = {
  nome: "",
  telefone: "",
  rua: "",
  bairro: "",
  complemento: "",
  numero: "",
  estado: "",
  cidade: "",
  senha: "",
  confirmarSenha: "",
};

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Nome é obrigatório")
    .matches(/\s/, "O nome completo deve conter pelo menos nome e sobrenome."),
  telefone: Yup.string()
    .required("Telefone é obrigatório"),
  rua: Yup.string().required("Rua é obrigatória"),
  bairro: Yup.string().required("Bairro é obrigatório"),
  complemento: Yup.string().required("Campo é obrigatório"),
  numero: Yup.string().required("Número é obrigatório"),
  estado: Yup.string().required("Estado é obrigatório"),
  cidade: Yup.string().required("Cidade é obrigatória"),
  senha: Yup.string().required("Senha é obrigatória").length(6,"Senha deve ter no mínimo 6 digítos"),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref("senha")], "As senhas não coincidem.")
    .required("Confirmação de senha é obrigatória"),
});

export default function Cadastrar() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("")

  const [fone, setFone] = useState("")

  const [typeModal, setTypeModal] = useState("envio")

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();


  const showNotification = () => {
    setModalVisible(true);


  };

  const closeNotification = () => {
    setModalVisible(false);
    typeModal == "envio" ? navigation.navigate('Verification', { num: `${fone}`, mode: "cadastro", functionVerificationCodeCadastro: verificationCode, reenviarCodigoCadastro: reenviarCodigo }) : ""
  };


  function togglePasswordVisibility() {
    setPasswordVisible(!isPasswordVisible);
  };


  const handleCadastro = async (values: FormValues) => {
    const userData = {
      nome_completo: values.nome,
      telefone: `55${values.telefone}`,
      password: values.senha,
      endereco: {
        cidade: values.cidade.toLowerCase(),
        estado: values.estado,
        bairro: values.bairro,
        rua: values.rua,
        numero: values.numero,
        tipo_moradia: values.complemento,
      },
    };

    try {
      setIsSubmitting(true);

      await registerUser(userData);

      setMensagemModal("Estamos enviando um código de verificação para o seu número. Por favor, verifique o WhatsApp.")

      setTypeModal("envio")
      setFone(userData.telefone)

    } catch (error) {

      let errorMessage = "Ocorreu um erro ao realizar o cadastro.";
      setTypeModal("error")
      if (error.response) {


        const { status, data } = error.response;

        switch (status) {
          case 400:
            errorMessage = data.message || "Dados inválidos. Verifique as informações e tente novamente.";
            break;
          case 409:
            errorMessage = "Dados já cadastrados. Usuário já existente.";
            break;
          case 500:
            errorMessage = "Erro no servidor. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = data.message || "Erro desconhecido. Tente novamente.";
            break;
        }
      } else if (error.request) {
        // Erros de rede
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
        setTypeModal("conection")
      } else {

        errorMessage = error.message || "Erro inesperado. Tente novamente.";
      }
      setMensagemModal(errorMessage)
    } finally {
      showNotification()
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <Header
        breadcrumbs={[
          { label: "Página Inicial", onPress: () => navigation.navigate("") },
          { label: "Como usar app", onPress: () => navigation.navigate("ComoUsarApp") },
          { label: "Login", onPress: () => navigation.navigate("Cliente_login_cadastrar", { screen: "Login" }) },
        ]}
      />

      <Formik
        initialValues={{
          nome: "",
          telefone: "",
          rua: "",
          bairro: "",
          complemento: "",
          numero: "",
          estado: "",
          cidade: "",
          senha: "",
          confirmarSenha: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleCadastro}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <View style={styles.introContainer}>
              <Text style={styles.introText}>
                COM ESSE APP A PESQUISA PELO MELHOR PREÇO E ATENDIMENTO POR REVENDAS DE GÁS, ÁGUA, GELO, CARVÃO E LENHA PRÓXIMO A SUA CASA VAI FICAR MAIS PRÁTICA E FÁCIL...
              </Text>
              <Text style={styles.introSubText}>O PRIMEIRO PASSO É FAZER O SEU CADASTRO....</Text>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>CADASTRO</Text>

              <TextInput
                style={styles.input}
                placeholder="NOME COMPLETO"
                placeholderTextColor="#C4C4C4"
                value={values.nome}
                onChangeText={handleChange("nome")}
                onBlur={handleBlur("nome")}
              />
              {touched.nome && errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

              <TextInput
                style={styles.input}
                placeholder="TELEFONE CELULAR COM DDD"
                placeholderTextColor="#C4C4C4"
                value={values.telefone}
                onChangeText={handleChange("telefone")}
                onBlur={handleBlur("telefone")}
                keyboardType="phone-pad"
              />
              {touched.telefone && errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

              <TextInput
                style={styles.input}
                placeholder="RUA"
                placeholderTextColor="#C4C4C4"
                value={values.rua}
                onChangeText={handleChange("rua")}
                onBlur={handleBlur("rua")}
              />
              {touched.rua && errors.rua && <Text style={styles.errorText}>{errors.rua}</Text>}

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.input,]}
                    placeholder="BAIRRO"
                    placeholderTextColor="#C4C4C4"
                    value={values.bairro}
                    onChangeText={handleChange("bairro")}
                    onBlur={handleBlur("bairro")}
                  />
                  {touched.bairro && errors.bairro && <Text style={styles.errorText}>{errors.bairro}</Text>}
                </View>

                <View >
                  <TextInput
                    style={[styles.input,]}
                    placeholder="CASA, APTO, ETC..."
                    placeholderTextColor="#C4C4C4"
                    value={values.complemento}
                    onChangeText={handleChange("complemento")}
                    onBlur={handleBlur("complemento")}
                  />
                  {touched.complemento && errors.complemento && <Text style={styles.errorText}>{errors.complemento}</Text>}
                </View>

                <View >
                  <TextInput
                    style={[styles.input,]}
                    placeholder="NÚMERO"
                    placeholderTextColor="#C4C4C4"
                    value={values.numero}
                    onChangeText={handleChange("numero")}
                    onBlur={handleBlur("numero")}
                    keyboardType="numeric"
                  />
                  {touched.numero && errors.numero && <Text style={styles.errorText}>{errors.numero}</Text>}
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.input,]}
                    placeholder="ESTADO"
                    placeholderTextColor="#C4C4C4"
                    value={values.estado}
                    onChangeText={handleChange("estado")}
                    onBlur={handleBlur("estado")}
                  />
                  {touched.estado && errors.estado && <Text style={styles.errorText}>{errors.estado}</Text>}
                </View>

                <View style={{ flex: 1 }}>
                  <TextInput
                    style={[styles.input,]}
                    placeholder="CIDADE"
                    placeholderTextColor="#C4C4C4"
                    value={values.cidade}
                    onChangeText={handleChange("cidade")}
                    onBlur={handleBlur("cidade")}
                  />
                  {touched.cidade && errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="CRIAR SENHA"
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

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="CONFIRMAR SENHA"
                  placeholderTextColor="#C4C4C4"
                  autoCapitalize="none"
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={handleChange("confirmarSenha")}
                  onBlur={handleBlur("confirmarSenha")}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#a6a6a6"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmarSenha && errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="green" />
                ) : (
                  <Text style={styles.submitButtonText}>FINALIZAR CADASTRO</Text>
                )}
              </TouchableOpacity>
            </View>

            <NotificationModal
              visible={isModalVisible}
              onClose={closeNotification}
              message={mensagemModal}
              type={typeModal}
            />
          </View>
        )}
      </Formik>
      <Footer themeDark={false} />
    </ScrollView>
  );

}


const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  introContainer: {
    backgroundColor: '#009240',
    padding: 10,
    alignItems: 'center',
  },
  introText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
  },
  introSubText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#2B4C2F',
    borderTopWidth: 3,
    borderColor: "#fff",
    borderBottomWidth: 3,
  },
  formTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    color: '#000',
    height: 45
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#2B4C2F',
    fontWeight: 'bold',
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginVertical: 5,
  },
});
