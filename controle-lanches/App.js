import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AlunosScreen from "./screens/AlunosScreen";
import LanchesScreen from "./screens/LanchesScreen";
import EntregasScreen from "./screens/EntregasScreen";
import HomeScreen from "./screens/HomeScreen";
import ListagemAlunosScreen from "./screens/ListagemAlunosScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alunos"
          component={AlunosScreen}
          options={{ headerTitle: "Gerenciar Alunos" }}
        />
        <Stack.Screen
          name="Listagem"
          component={ListagemAlunosScreen}
          options={{ headerTitle: "Gerenciar Alunos" }}
        />
        <Stack.Screen
          name="Lanches"
          component={LanchesScreen}
          options={{ headerTitle: "Controle de Lanches" }}
        />
        <Stack.Screen
          name="Entregas"
          component={EntregasScreen}
          options={{ headerTitle: "Entregas de Lanches" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
