import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../services/api";

export default function EntregasScreen() {
  const [dataConsulta, setDataConsulta] = useState("");
  const [alunosAutorizados, setAlunosAutorizados] = useState([]);

  const buscarAlunosAutorizados = async () => {
    if (!dataConsulta) return;
    const response = await api.get(`/lanches?data=${dataConsulta}`);
    setAlunosAutorizados(response.data);
  };

  const marcarComoEntregue = async (alunoId) => {
    await api.post(`/entregas`, { alunoId, data: dataConsulta });
    buscarAlunosAutorizados();
  };

  useEffect(() => {
    if (dataConsulta) buscarAlunosAutorizados();
  }, [dataConsulta]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entregas de Lanches</Text>
      <TextInput
        style={styles.input}
        placeholder="Data (AAAA-MM-DD)"
        value={dataConsulta}
        onChangeText={setDataConsulta}
      />
      <Button title="Buscar Autorizados" onPress={buscarAlunosAutorizados} />
      <FlatList
        data={alunosAutorizados}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.nome} - RA: {item.ra}
            </Text>
            <TouchableOpacity
              style={styles.entregarButton}
              onPress={() => marcarComoEntregue(item._id)}
            >
              <Text style={styles.buttonText}>Marcar como Entregue</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entregarButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
