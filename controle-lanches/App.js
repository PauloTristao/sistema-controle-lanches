import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AlunosScreen from "./screens/AlunosScreen";
import LanchesScreen from "./screens/LanchesScreen";
import EntregasScreen from "./screens/EntregasScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Alunos" component={AlunosScreen} />
        <Stack.Screen name="Lanches" component={LanchesScreen} />
        <Stack.Screen name="Entregas" component={EntregasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
