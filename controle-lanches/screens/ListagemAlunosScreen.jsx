import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

export default function ListagemAlunosScreen() {
  const [alunos, setAlunos] = useState([]);
  const navigation = useNavigation();

  const carregarAlunos = async () => {
    try {
      const response = await api.get("/aluno/filter/getAllRaAndName");
      setAlunos(response.data);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar os alunos.");
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAlunos();
    }, [])
  );

  const handleEditar = (item) => {
    navigation.navigate("Alunos", { aluno: item });
  };

  const handleExcluir = async (item) => {
    Alert.alert(
      "Excluir Aluno",
      `Tem certeza que deseja excluir o aluno ${item.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await api.delete(`/aluno/${item.ra}`);
              carregarAlunos();
              Alert.alert("Sucesso", "Aluno excluído com sucesso.");
            } catch (error) {
              Alert.alert("Erro", "Erro ao excluir o aluno.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.nome} <Text style={styles.raText}>RA: {item.ra}</Text>
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditar(item)}
        >
          <Text style={styles.buttonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluir(item)}
        >
          <Text style={styles.buttonText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Alunos")}
      >
        <Text style={styles.buttonText}>Adicionar Novo Aluno</Text>
      </TouchableOpacity>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.ra}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#d3eaf5",
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  raText: {
    fontWeight: "normal",
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  editButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
    marginRight: 5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
});
