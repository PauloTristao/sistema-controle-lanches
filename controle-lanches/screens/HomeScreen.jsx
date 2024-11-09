import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema de Gerenciamento de Lanches</Text>
      <Button
        title="Gerenciar Alunos"
        onPress={() => navigation.navigate("Alunos")}
      />
      <Button
        title="Controle de Lanches"
        onPress={() => navigation.navigate("Lanches")}
      />
      <Button
        title="Entregas de Lanches"
        onPress={() => navigation.navigate("Entregas")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
