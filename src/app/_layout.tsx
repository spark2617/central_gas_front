import React from "react";
import { Stack } from "expo-router";
import { StatusBar, Platform, StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        translucent
        backgroundColor="#171717" 
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#009240" },
          statusBarColor: "#171717", // Para Android
          statusBarStyle: "light",   // Para iOS
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
