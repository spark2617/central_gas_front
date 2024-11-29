import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const NotificationModal = ({ visible, onClose, message, type }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Ícone de Notificação */}
          {type == "envio" ? <MaterialIcons name="mail-outline" size={32} color="#4CAF50" /> :
            type == "error" ? <FontAwesome name="times-circle" size={32} color="#FF3B30" /> :
              type == "sucesso" ? <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
                : <MaterialIcons name="cloud-off" size={32} color="#FF3B30" />}

          
          {/* Texto da Notificação */}
          <Text style={styles.messageText}>{message}</Text>

          {/* Botão de Fechar */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#171717',
    fontWeight: "500"
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NotificationModal;
