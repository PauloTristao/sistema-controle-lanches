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

export default function LanchesScreen({ route, navigation }) {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [dataLiberacao, setDataLiberacao] = useState(new Date());
  const [quantidade, setQuantidade] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fotoAluno, setFotoAluno] = useState(null);
  const [idAutorizacao, setIdAutorizacao] = useState(null);

  const {
    ra,
    quantidade: quantidadeAutorizada,
    dataLiberacao: dataLiberacaoParam,
    idAutorizacao: idAutorizacaoParam,
  } = route.params || {};

  const carregarAlunos = async () => {
    try {
      const response = await api.get("/aluno/filter/getAllRaAndName");
      setAlunos(response.data);
    } catch (error) {
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  const carregarFoto = async (ra) => {
    try {
      const response = await api.get(`/aluno/${ra}/foto`);
      if (response.data) {
        const { type, foto } = response.data;
        setFotoAluno(`data:${type};base64,${foto}`);
      }
    } catch (error) {
      Alert.alert("Erro", error?.response?.data?.erro);
      setFotoAluno(null);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  useEffect(() => {
    if (ra && alunos.length > 0) {
      const alunoEncontrado = alunos.find((aluno) => aluno.ra === ra);
      if (alunoEncontrado) {
        setAlunoSelecionado(alunoEncontrado.ra);
        carregarFoto(alunoEncontrado.ra);
        setQuantidade(String(quantidadeAutorizada || ""));
        if (dataLiberacaoParam) {
          setDataLiberacao(new Date(dataLiberacaoParam));
        }
        if (idAutorizacaoParam) {
          setIdAutorizacao(idAutorizacaoParam);
        }
      }
    }
  }, [
    alunos,
    ra,
    quantidadeAutorizada,
    dataLiberacaoParam,
    idAutorizacaoParam,
  ]);

  const autorizarLanche = async () => {
    try {
      if (!alunoSelecionado || !dataLiberacao || !quantidade) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
      }
      if (quantidade > 3) {
        Alert.alert("Erro", "A quantidade máxima de lanches é 3.");
        return;
      }

      await api.post("/autorizacao", {
        dataLiberacao: dataLiberacao.toISOString(),
        ra: alunoSelecionado,
        qtdeLanches: quantidade,
      });

      setDataLiberacao(new Date());
      setQuantidade("");
      setAlunoSelecionado(null);
      setFotoAluno(null);
    } catch (error) {
      console.error("Erro ao autorizar lanche:", error);
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  const atualizarLanche = async () => {
    try {
      if (!idAutorizacao) {
        Alert.alert("Erro", "Nenhuma autorização selecionada para editar.");
        return;
      }
      if (!quantidade) {
        Alert.alert("Erro", "Preencha a quantidade de lanches.");
        return;
      }
      if (quantidade > 3) {
        Alert.alert("Erro", "A quantidade máxima de lanches é 3.");
        return;
      }

      await api.put(`/autorizacao/${idAutorizacao}`, {
        ra: alunoSelecionado,
        idAutorizacao: idAutorizacao,
        dataLiberacao: dataLiberacao.toISOString(),
        qtdeLanches: quantidade,
      });

      Alert.alert("Sucesso", "Autorização atualizada com sucesso!");
      setQuantidade("");
      setAlunoSelecionado(null);
      setFotoAluno(null);
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar lanche:", error);
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataLiberacao;
    setShowDatePicker(false);
    setDataLiberacao(currentDate);
  };

  const onAlunoSelecionado = (ra) => {
    setAlunoSelecionado(ra);
    carregarFoto(ra);
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={alunoSelecionado}
          onValueChange={onAlunoSelecionado}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Aluno" value={null} />
          {alunos.map((aluno) => (
            <Picker.Item
              key={aluno._id}
              label={`${aluno.ra} - ${aluno.nome}`}
              value={aluno.ra}
            />
          ))}
        </Picker>
        {fotoAluno && (
          <Image
            source={{ uri: fotoAluno }}
            style={styles.alunoFoto}
            resizeMode="cover"
          />
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Quantidade de Lanches"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        maxLength={1}
      />

      {idAutorizacao ? (
        <TouchableOpacity style={styles.button} onPress={atualizarLanche}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={autorizarLanche}>
          <Text style={styles.buttonText}>Autorizar Lanche</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#d3eaf5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
  pickerContainer: {
    marginVertical: 20,
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  alunoFoto: {
    width: 150,
    height: 150,
    marginVertical: 20,
    alignSelf: "center",
    borderRadius: 10,
  },
});
