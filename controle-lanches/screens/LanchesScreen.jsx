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
  const [idAutorizacao, setIdAutorizacao] = useState(null); // Para armazenar o id da autorização

  // Dados recebidos da navegação
  const {
    ra,
    quantidade: quantidadeAutorizada,
    dataLiberacao: dataLiberacaoParam,
    idAutorizacao: idAutorizacaoParam, // Recebe o ID da autorização
  } = route.params || {};

  // Carregar alunos do banco
  const carregarAlunos = async () => {
    try {
      const response = await api.get("/aluno/filter/getAllRaAndName");
      setAlunos(response.data);
    } catch (error) {
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  // Carregar foto do aluno selecionado
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

  // Efeito para carregar os dados quando a tela for acessada
  useEffect(() => {
    carregarAlunos();
  }, []); // Carrega alunos apenas uma vez

  // Efeito para setar os dados quando o aluno for encontrado
  useEffect(() => {
    if (ra && alunos.length > 0) {
      const alunoEncontrado = alunos.find((aluno) => aluno.ra === ra);
      if (alunoEncontrado) {
        setAlunoSelecionado(alunoEncontrado.ra);
        carregarFoto(alunoEncontrado.ra); // Carregar a foto do aluno
        setQuantidade(String(quantidadeAutorizada || "")); // Preenche a quantidade
        if (dataLiberacaoParam) {
          setDataLiberacao(new Date(dataLiberacaoParam)); // Preenche a data de liberação
        }
        if (idAutorizacaoParam) {
          setIdAutorizacao(idAutorizacaoParam); // Armazena o ID da autorização
        }
      }
    }
  }, [
    alunos,
    ra,
    quantidadeAutorizada,
    dataLiberacaoParam,
    idAutorizacaoParam,
  ]); // Recarrega quando os dados mudarem

  // Função para autorizar o lanche
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
        ra: alunoSelecionado, // Agora estamos usando alunoSelecionado
        qtdeLanches: quantidade,
      });

      // Se a autorização for bem-sucedida, atualizamos o estado
      setDataLiberacao(new Date());
      setQuantidade("");
      setAlunoSelecionado(null); // Limpa a seleção do aluno após autorizar
      setFotoAluno(null); // Limpa a foto após a autorização
    } catch (error) {
      console.error("Erro ao autorizar lanche:", error);
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  // Função para atualizar a autorização
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
        ra: alunoSelecionado, // Usando alunoSelecionado em vez de ra
        idAutorizacao: idAutorizacao,
        dataLiberacao: dataLiberacao.toISOString(),
        qtdeLanches: quantidade,
      });

      // Se a atualização for bem-sucedida, notificamos o usuário e limpamos os campos
      Alert.alert("Sucesso", "Autorização atualizada com sucesso!");
      setQuantidade("");
      setAlunoSelecionado(null);
      setFotoAluno(null);
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      console.error("Erro ao atualizar lanche:", error);
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  // Alterar data de liberação
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
      <Text style={styles.title}>Controle de Lanches</Text>

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
        <Button title="Salvar Alterações" onPress={atualizarLanche} />
      ) : (
        <Button title="Autorizar Lanche" onPress={autorizarLanche} />
      )}
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
