import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../services/api";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function AlunoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const aluno = route.params?.aluno;

  const [ra, setRa] = useState(aluno ? aluno.ra : "");
  const [nome, setNome] = useState(aluno ? aluno.nome : "");
  const [foto, setFoto] = useState(aluno ? aluno.foto : null);
  const [fotoTirada, setFotoTirada] = useState(false);

  useEffect(() => {
    if (aluno && aluno.ra) {
      carregarFoto(aluno.ra);
    }
  }, [aluno]);

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("É necessário conceder permissão para usar a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setFotoTirada(true);
      setFoto(result.assets[0].base64);
    }
  };

  const carregarFoto = async (ra) => {
    try {
      const response = await api.get(`/aluno/${ra}/foto`);
      if (response.data) {
        const { type, foto } = response.data;
        setFoto(`data:${type};base64,${foto}`);
      }
    } catch (error) {
      console.error("Erro ao carregar foto do aluno:", error);
      setFoto(null);
    }
  };

  const salvarAluno = async () => {
    if (!ra || !nome || !foto) {
      Alert.alert("Erro", "Preencha todos os campos e tire uma foto.");
      return;
    }

    try {
      let alunoId = aluno?._id;
      console.log(1);

      const fotoParaEnvio = foto.substring(0, 10).includes("data")
        ? foto.replace("data:image/png;base64,", "")
        : foto;
      console.log(2);
      console.log(fotoParaEnvio.substring(0, 10));
      const objAluno = {
        ra,
        nome,
        foto: fotoParaEnvio,
      };
      console.log(3);

      const url = alunoId ? `/aluno/${alunoId}` : "/aluno";
      const method = alunoId ? "put" : "post";
      console.log("1");

      console.log(4);
      const response = await api[method](url, objAluno);
      console.log(alunoId);

      if (response.status >= 200 && response.status < 300) {
        Alert.alert(
          "Sucesso",
          alunoId ? "Aluno atualizado com sucesso!" : "Aluno salvo com sucesso!"
        );

        setRa("");
        setNome("");
        setFoto(null);
        setFotoTirada(false);
        navigation.navigate("Listagem");
      } else {
        Alert.alert("Erro", "Erro ao salvar o aluno.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", error?.response?.data?.erro || "Erro desconhecido.");
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

      {foto && fotoTirada && (
        <Image
          source={{ uri: `data:image/png;base64,${foto}` }}
          style={styles.image}
        />
      )}
      {foto && !fotoTirada && (
        <Image source={{ uri: foto }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.button} onPress={tirarFoto}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={salvarAluno}>
        <Text style={styles.buttonText}>
          {aluno ? "Atualizar Aluno" : "Salvar Aluno"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#d3eaf5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#fff",
    width: "100%",
  },
  button: {
    backgroundColor: "#003366",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
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
  image: {
    width: 150,
    height: 150,
    marginVertical: 20,
    alignSelf: "center",
  },
});
