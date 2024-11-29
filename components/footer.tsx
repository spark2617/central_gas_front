import { colors } from "@/src/app/style/colors"
import React from "react"
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"

interface Props {
  themeDark: boolean
}

export default function Footer({ themeDark }: Props) {
  return (
    <View style={[styles.promoContainer, {
      backgroundColor: themeDark ? "#2B4C2F" : '#009240', 
      borderTopWidth: themeDark ? 1 : 0,
      borderColor: colors.cinza[100],
    },]}>
      <Text style={styles.promoText}>
        VOCÊ GOSTARIA DE TER ACESSO AS CAMPANHAS PROMOCIONAIS DA CENTRAL DE GÁS E ÁGUA E GANHAR MUITAS RECARGAS DE GÁS OU MUITOS PRODUTOS OFERECIDOS AQUI NO APP?
      </Text>
      <Text style={styles.promoSubText}>
        ENTÃO BASTA CLICAR NO LINK A BAIXO, VOCÊ SERÁ DIRECIONADO (A) PARA O GRUPO QUE A CENTRAL TEM NO WHATSAP NELE VOCÊ SERÁ INFORMADO(A) DE TODAS AS CAMPANHA QUE IRÃO ACONTECER TODAS AS SEMANAS.
      </Text>
      <TouchableOpacity style={[styles.linkButton, {
        borderWidth: themeDark ? 1 : 0,
        borderColor: colors.cinza[100]
      }]}>
        <Text style={styles.linkButtonText}>LINK</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  promoContainer: {
    padding: 20,
    alignItems: 'center',

  },
  promoText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 10,
    fontWeight:"900"
  },
  promoSubText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 20,
    fontWeight:"900"
  },
  linkButton: {
    backgroundColor: '#2B4C2F',
    padding: 10,
    borderRadius: 5,


  },
  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
})