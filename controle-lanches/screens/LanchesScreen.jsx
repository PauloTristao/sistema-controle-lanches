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
  const [fotoAluno, setFotoAluno] = useState(null); // Estado para armazenar a foto do aluno

  // Carregar alunos do banco
  const carregarAlunos = async () => {
    console.log("Carregando alunos...");
    const response = await api.get("/aluno/filter/getAllRaAndName");
    setAlunos(response.data);
  };

  // Carregar foto do aluno selecionado
  const carregarFoto = async (ra) => {
    try {
      const response = await api.get(`/aluno/${ra}/foto`);
      if (response.data) {
        const { type, data } = response.data;
        // Verifique se 'data' é um array de bytes
        console.log(data[10]);
        if (Array.isArray(data)) {
          const byteArray = new Uint8Array(data);
          const base64String = Buffer.from(byteArray).toString("base64");
          // console.log("Base64 gerado:", base64String.slice(0, 1000));
          setFotoAluno(`data:${type};base64,${base64String}`);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar foto:", error);
      setFotoAluno(null);
    }
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
    setFotoAluno(null); // Limpa a foto após a autorização
  };

  // Função para lidar com a mudança da data
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataLiberacao;
    setShowDatePicker(false);
    setDataLiberacao(currentDate);
  };

  // Função que será chamada quando o aluno for selecionado
  const onAlunoSelecionado = (ra) => {
    setAlunoSelecionado(ra);
    carregarFoto(ra); // Chama a função para carregar a foto
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
          onValueChange={onAlunoSelecionado} // Agora chama a função onAlunoSelecionado
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Aluno" value={null} />
          {alunos.map((aluno) => (
            <Picker.Item
              key={aluno._id}
              label={`${aluno.ra} - ${aluno.nome}`}
              value={aluno.ra} // Passando o RA como valor
            />
          ))}
        </Picker>
        {fotoAluno && (
          <Image
            source={{ uri: fotoAluno }} // Exibe a foto do aluno
            style={styles.alunoFoto}
            resizeMode="cover"
          />
        )}
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
