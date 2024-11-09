import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../services/api";
import { Buffer } from "buffer";

export default function LanchesScreen() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [dataLiberacao, setDataLiberacao] = useState(new Date());
  const [quantidade, setQuantidade] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Carregar alunos do banco
  const carregarAlunos = async () => {
    console.log("Carregando alunos...");
    const response = await api.get("/aluno/filter/getAll");
    setAlunos(response.data);
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  // Função para autorizar lanche
  const autorizarLanche = async () => {
    if (!alunoSelecionado || !dataLiberacao || !quantidade) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (quantidade > 3) {
      Alert.alert("Erro", "A quantidade máxima de lanches é 3.");
      return;
    }

    await api.post("/lanches", {
      alunoId: alunoSelecionado,
      data: dataLiberacao.toISOString(),
      quantidade,
    });
    setDataLiberacao(new Date());
    setQuantidade("");
    setAlunoSelecionado(null); // Limpa a seleção do aluno após autorizar
  };

  // Função para lidar com a mudança da data
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataLiberacao;
    setShowDatePicker(false);
    setDataLiberacao(currentDate);
  };

  const renderFotoAluno = () => {
    const aluno = alunos.find((aluno) => aluno._id === alunoSelecionado);

    if (aluno && aluno.foto) {
      const { type, data } = aluno.foto;

      // Verifique se 'data' é um array de bytes
      if (Array.isArray(data)) {
        // Criando um Uint8Array a partir do array de bytes
        const byteArray = new Uint8Array(data);

        // Convertendo o Uint8Array para Base64
        const base64String = Buffer.from(byteArray).toString("base64");

        // Logando as primeiras 1000 letras para debugging
        console.log(base64String.slice(0, 1000));
        console.log(type);

        return (
          <Image
            source={{
              uri: `data:${type};base64,${base64String}`, // Formatando a string para exibição
            }}
            style={styles.alunoFoto} // Estilo da imagem
            resizeMode="cover" // Ajuste o modo de redimensionamento conforme necessário
          />
        );
      } else {
        console.warn("O formato de dados da foto é inválido.");
      }
    } else {
      console.warn("Foto não disponível para o aluno selecionado.");
    }

    return null; // Retornando null se não houver aluno ou foto
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Lanches</Text>

      {/* Data de Liberação (DatePicker) */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {dataLiberacao
            ? dataLiberacao.toLocaleDateString()
            : "Data de Liberação"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dataLiberacao}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Seletor de Alunos */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={alunoSelecionado}
          onValueChange={(itemValue) => setAlunoSelecionado(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Aluno" value={null} />
          {alunos.map((aluno) => (
            <Picker.Item key={aluno._id} label={aluno.nome} value={aluno._id} />
          ))}
        </Picker>
        {alunoSelecionado && renderFotoAluno()}
        {/* Renderiza a foto do aluno */}
      </View>

      {/* Quantidade de Lanches */}
      <TextInput
        style={styles.input}
        placeholder="Quantidade de Lanches"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        maxLength={1}
      />

      <Button title="Autorizar Lanche" onPress={autorizarLanche} />
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  alunoFoto: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 50,
  },
});
