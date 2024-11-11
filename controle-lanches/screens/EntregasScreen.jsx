import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../services/api";
import { useNavigation } from "@react-navigation/native"; // Importa o hook de navegação
import { useFocusEffect } from "@react-navigation/native"; // Importa o useFocusEffect

export default function EntregasScreen() {
  const [dataConsulta, setDataConsulta] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [alunosAutorizados, setAlunosAutorizados] = useState([]);
  const navigation = useNavigation(); // Inicializa o hook de navegação

  const buscarAlunosAutorizados = async () => {
    if (!dataConsulta) return;

    const formattedDate = dataConsulta.toISOString().split("T")[0];

    try {
      const response = await api.get(
        `/autorizacao/filter/getByDate/${formattedDate}`
      );
      console.log(response.data);
      setAlunosAutorizados(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos autorizados:", error);
    }
  };

  const marcarComoEntregue = async (alunoId) => {
    const formattedDate = dataConsulta.toISOString().split("T")[0];
    try {
      // Chama a API para marcar como entregue
      await api.put(`/autorizacao/marcar-entregue/${alunoId}`, {
        dataEntrega: formattedDate,
      });

      // Atualiza a lista de autorizações
      buscarAlunosAutorizados();
    } catch (error) {
      console.error("Erro ao marcar como entregue:", error);
    }
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

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataConsulta;
    setShowDatePicker(false);
    setDataConsulta(currentDate);
  };

  // UseFocusEffect para recarregar dados sempre que a tela for acessada
  useFocusEffect(
    useCallback(() => {
      buscarAlunosAutorizados();
    }, [dataConsulta]) // A dependência é a data, para que sempre que a data mudar, a lista seja recarregada
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
              {item.nome} RA: {item.ra}
            </Text>

            {/* Condicional para verificar se já foi entregue */}
            {item.dataEntrega ? (
              // Se já foi entregue
              <TouchableOpacity
                style={[styles.entregarButton, styles.entregueButton]}
              >
                <Text style={styles.buttonText}>Entregue</Text>
              </TouchableOpacity>
            ) : (
              // Se não foi entregue
              <TouchableOpacity
                style={styles.entregarButton}
                onPress={() => marcarComoEntregue(item._id)}
              >
                <Text style={styles.buttonText}>Entregar</Text>
              </TouchableOpacity>
            )}

            {/* Botões Editar e Excluir apenas se não foi entregue */}
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
    backgroundColor: "#4CAF50", // Verde para botão de entrega
    padding: 10,
    borderRadius: 5,
  },
  entregueButton: {
    backgroundColor: "#FF0000", // Vermelho para quando for entregue
  },
  editarButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
  },
  excluirButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
