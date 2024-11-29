import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "@/src/app/style/colors";

interface Breadcrumb {
  label: string;
  onPress?: () => void; // Função opcional para navegar ao clicar
}

interface Props {
  title?: string; // Título opcional
  breadcrumbs?: Breadcrumb[]; // Itens de navegação dinâmicos
  showLogo?: boolean; // Exibe ou não o logo
}

export default function Header({ title = "", breadcrumbs = [], showLogo = true }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity onPress={breadcrumb.onPress}>
                <Text style={styles.navItem}>{breadcrumb.label}</Text>
              </TouchableOpacity>
              {index < breadcrumbs.length - 1 && <Text style={styles.navSeparator}>/</Text>}
            </React.Fragment>
          ))
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </View>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Image
            resizeMode="cover"
            style={styles.logo}
            source={require("@/assets/images/logo.jpg")}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    backgroundColor: "#009240",
  },
  navbar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#2B4C2F",
    gap: 12,
  },
  navItem: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  navSeparator: {
    color: "#FFFFFF",
    fontSize: 20,
    marginHorizontal: 2,
    fontWeight: "900",
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "absolute",
    right: 0,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.cinza[100],
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
