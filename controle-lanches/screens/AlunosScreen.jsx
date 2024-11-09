import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../services/api";

import * as ImagePicker from "expo-image-picker";

export default function AlunoScreen() {
  const [ra, setRa] = useState("");
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);

  // Função para abrir a câmera
  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("É necessário conceder permissão para usar a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true, // Garante que a imagem seja capturada em base64
      quality: 0.5, // Ajusta a qualidade da imagem, caso queira reduzir o tamanho
    });

    if (!result.canceled) {
      setFoto(result.assets[0].base64); // Armazena a imagem em base64
    }
  };

  // Função para salvar o aluno
  const salvarAluno = async () => {
    if (!ra || !nome || !foto) {
      Alert.alert("Erro", "Preencha todos os campos e tire uma foto.");
      return;
    }

    try {
      const objAluno = {
        ra,
        nome,
        foto,
      };
      const response = await api.post("/aluno", objAluno);
      if (response.ok) {
        Alert.alert("Sucesso", "Aluno salvo com sucesso!");
        setRa("");
        setNome("");
        setFoto(null);
      } else {
        Alert.alert("Erro", "Erro ao salvar o aluno.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao se conectar com o servidor.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RA</Text>
      <TextInput
        style={styles.input}
        value={ra}
        onChangeText={setRa}
        placeholder="Digite o RA do aluno"
      />

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome do aluno"
      />

      <Button title="Tirar Foto" onPress={tirarFoto} />

      {foto && (
        <Image
          source={{ uri: `data:image/png;base64,${foto}` }}
          style={styles.image}
        />
      )}

      <Button title="Salvar Aluno" onPress={salvarAluno} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 20,
    alignSelf: "center",
  },
});
