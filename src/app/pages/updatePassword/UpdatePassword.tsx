import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import NotificationModal from "../../service/modal/NotificationModal";
import { colors } from "../../style/colors";
import { atualizarSenha } from "../../service/API/cliente_api";

export default function UpdatePassword({ route }: any) {

  const { num, codigo } = route.params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");
  const [typeModal, setTypeModal] = useState("envio");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .required("Nova senha é obrigatória"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "As senhas não coincidem")
      .required("Confirmação de senha é obrigatória"),
  });

  const handleSubmitUpdatePassword = async (values: any) => {
    const data = {
      nova_senha: values.newPassword,
      codigo: codigo,
      telefone: `55${num}`
    };

    try {
      setIsSubmitting(true);

      const response = await atualizarSenha(data);
      const successMessage = "Senha atualizada com sucesso!";
      setMensagemModal(successMessage);
      setTypeModal("sucesso");
      showNotification();

    } 
    catch (error) {
      let errorMessage = "Erro ao atualizar senha. Tente novamente.";

      console.log(JSON.stringify(error.response.data))

      // if (error.response) {
      //   const status = error.response.status;
      //   if (status === 400) {
      //     errorMessage = error.response.data.message || "Dados inválidos.";
      //   } else if (status === 500) {
      //     errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
      //   }
      // } else if (error.request) {
      //   errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      //   setTypeModal("conection");
      // }

      setMensagemModal(errorMessage);
      setTypeModal("error");
      showNotification();

    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = () => setModalVisible(true);
  const closeNotification = () => setModalVisible(false);

  const goBack = () => navigation.goBack();

  return (
    <View style={{ flex: 1, padding: 50 }}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="arrow-back" size={36} color="white" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.formTitle}>Atualizar Senha</Text>

        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmitUpdatePassword(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Nova Senha */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.newPassword && errors.newPassword ? styles.inputError : null,
                  ]}
                  placeholder="Nova senha"
                  placeholderTextColor="#C4C4C4"
                  secureTextEntry={!showNewPassword}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#C4C4C4"
                  />
                </TouchableOpacity>
              </View>
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              {/* Confirmar Senha */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    touched.confirmPassword && errors.confirmPassword ? styles.inputError : null,
                  ]}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#C4C4C4"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  autoCapitalize="none"
                  value={values.confirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#C4C4C4"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="green" />
                ) : (
                  <Text style={styles.submitButtonText}>ATUALIZAR SENHA</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <NotificationModal
          visible={isModalVisible}
          onClose={closeNotification}
          message={mensagemModal}
          type={typeModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
  inputContainer: {
    position: "relative",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    color: "#000",
    fontSize: 16,
    paddingRight: 40,
    height: 45,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    textAlign: "left",
    marginTop: -10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#2B4C2F",
    fontWeight: "bold",
  },
});
