import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Lanches</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Listagem")}
        >
          <Text style={styles.buttonText}>Gerenciar Alunos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Lanches")}
        >
          <Text style={styles.buttonText}>Controle de Lanches</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Entregas")}
        >
          <Text style={styles.buttonText}>Entregas de Lanches</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#d3eaf5",
    height: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 60,
    textAlign: "center",
    color: "#FFD700",
    textTransform: "uppercase",
    padding: 10,
    textShadowColor: "#003366",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "100%",
    height: "70%",
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
