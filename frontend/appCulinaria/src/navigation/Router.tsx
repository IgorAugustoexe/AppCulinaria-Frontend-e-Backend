import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { selectUserAuthToken } from "../redux/reducers/UserReducer";
import { HeaderButtonLogout } from "../components/HeaderButtonLogout";
import ModalInfoScreen from "../screens/general/ModalInfoScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import RecipeListScreen from "../screens/recipes/RecipeListScreen";
import RecipeFormScreen from "../screens/recipes/RecipeFormScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const isAuthenticated = useSelector(selectUserAuthToken);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="RecipeList"
              component={RecipeListScreen}
              options={{
                title: "Receitas",
                headerRight: HeaderButtonLogout,
              }}
            />
            <Stack.Screen
              name="RecipeForm"
              component={RecipeFormScreen}
              options={({ route }: any) => ({
                title: route.params?.recipe ? "Editar Receita" : "Cadastrar Receita",
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Entrar" }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Cadastrar" }} />
          </>
        )}
        <Stack.Screen
          name="ModalInfo"
          component={ModalInfoScreen}
          options={{
            presentation: "transparentModal",
            animation: "fade",
            gestureEnabled: false,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
