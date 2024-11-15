import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";

export default function EntregasScreen() {
  const [dataConsulta, setDataConsulta] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alunosAutorizados, setAlunosAutorizados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [fotoAluno, setFotoAluno] = useState(null);
  const navigation = useNavigation();

  const buscarAlunosAutorizados = async () => {
    if (!dataConsulta) return;

    const formattedDate = dataConsulta.toISOString().split("T")[0];
    try {
      const response = await api.get(
        `/autorizacao/filter/getByDate/${formattedDate}`
      );
      setAlunosAutorizados(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos autorizados:", error);
    }
  };

  const marcarComoEntregue = async (alunoId) => {
    const formattedDate = dataConsulta.toISOString().split("T")[0];
    try {
      await api.put(`/autorizacao/marcar-entregue/${alunoId}`, {
        dataEntrega: formattedDate,
      });
      buscarAlunosAutorizados();
    } catch (error) {
      console.error("Erro ao marcar como entregue:", error);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarFoto = async (ra) => {
    try {
      const response = await api.get(`/aluno/${ra}/foto`);
      if (response.data) {
        const { type, foto } = response.data;
        setFotoAluno(`data:${type};base64,${foto}`);
      }
    } catch (error) {
      console.error("Erro ao carregar foto do aluno:", error);
      setFotoAluno(null);
    }
  };

  const formatarDataHora = (data) => {
    if (!data) return "N/A";
    const dt = new Date(data);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
  };

  const abrirModal = async (aluno) => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    setAlunoSelecionado(aluno);

    carregarFoto(aluno.ra);

    const alunoComNome = alunos.find((a) => a.ra === aluno.ra);
    if (alunoComNome) {
      setAlunoSelecionado((prevAluno) => ({
        ...prevAluno,
        nome: alunoComNome.nome,
      }));
    }

    setModalVisible(true);
  };

  const carregarAlunos = async () => {
    try {
      const response = await api.get("/aluno/filter/getAllRaAndName");
      setAlunos(response.data);
    } catch (error) {
      Alert.alert("Erro", error?.response?.data?.erro);
    }
  };

  const fecharModal = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    setModalVisible(false);
    setAlunoSelecionado(null);
    setFotoAluno(null);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataConsulta;
    setShowDatePicker(false);
    setDataConsulta(currentDate);
  };

  const excluirAutorizacao = async (alunoId) => {
    const formattedDate = dataConsulta.toISOString().split("T")[0];
    try {
      await api.delete(`/autorizacao/${alunoId}`, {
        data: { data: formattedDate },
      });
      buscarAlunosAutorizados();
    } catch (error) {
      console.error("Erro ao excluir autorização:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarAlunosAutorizados();
    }, [dataConsulta])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entregas de Lanches</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {dataConsulta
            ? dataConsulta.toLocaleDateString()
            : "Data (AAAA-MM-DD)"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dataConsulta}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <FlatList
        data={alunosAutorizados}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.nome} <Text style={styles.raText}>RA: {item.ra}</Text>
            </Text>

            {item.dataEntrega ? (
              <TouchableOpacity
                style={[styles.entregarButton, styles.entregueButton]}
              >
                <Text style={styles.buttonText}>Entregue</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.entregarButton}
                onPress={() => marcarComoEntregue(item._id)}
              >
                <Text style={styles.buttonText}>Entregar</Text>
              </TouchableOpacity>
            )}
            {!item.dataEntrega && (
              <>
                <TouchableOpacity
                  style={styles.editarButton}
                  onPress={() =>
                    navigation.navigate("Lanches", {
                      ra: item.ra,
                      quantidade: item.qtdeLanches,
                      dataLiberacao: item.dataLiberacao,
                      idAutorizacao: item._id,
                    })
                  }
                >
                  <Text style={styles.buttonText}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.excluirButton}
                  onPress={() => excluirAutorizacao(item._id)}
                >
                  <Text style={styles.buttonText}>❌</Text>
                </TouchableOpacity>
              </>
            )}
            {item.dataEntrega && (
              <TouchableOpacity
                style={styles.visualizarButton}
                onPress={() => abrirModal(item)}
              >
                <Text style={styles.buttonText}>🔍</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Detalhes do Aluno</Text>
            {fotoAluno && (
              <Image
                source={{ uri: fotoAluno }}
                style={styles.alunoFoto}
                resizeMode="cover"
              />
            )}
            {alunoSelecionado && (
              <>
                <Text>Nome: {alunoSelecionado.nome}</Text>
                <Text>RA: {alunoSelecionado.ra}</Text>
                <Text>
                  Quantidade de lanches: {alunoSelecionado.qtdeLanches}
                </Text>
                <Text>
                  Data de autorização:{" "}
                  {formatarDataHora(alunoSelecionado.dataLiberacao)}
                </Text>
                <Text>
                  Data de entrega:{" "}
                  {formatarDataHora(alunoSelecionado.dataEntrega)}
                </Text>
              </>
            )}
            <TouchableOpacity style={styles.fecharButton} onPress={fecharModal}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#d3eaf5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#003366",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  raText: {
    fontWeight: "bold",
  },
  entregarButton: {
    backgroundColor: "#003366",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  entregadoButton: {
    backgroundColor: "#00b300",
  },
  editarButton: {
    backgroundColor: "#0066cc",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  excluirButton: {
    backgroundColor: "#0066cc",
    padding: 8,
    borderRadius: 5,
  },
  visualizarButton: {
    backgroundColor: "#0066cc",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  alunoFoto: {
    width: 100,
    height: 100,
    borderRadius: 75,
    alignSelf: "center",
  },
  fecharButton: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
});
