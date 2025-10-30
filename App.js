import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Home";
import NewTask from "./components/NewTask";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppProvider } from "./components/ContextApp";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: "rgba(219, 166, 51,1)" },
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerTitleStyle: { fontWeight: "bold" },
            tabBarIcon: ({ focused, color, size }) => {
              let icono;

              if (route.name === "Ruleta") {
                icono = focused ? "disc" : "disc-outline";
              } else if (route.name === "Premios y Participantes") {
                icono = focused ? "gift" : "gift-outline";
              }
              return <Ionicons name={icono} size={size} color={color} />;
            },
            tabBarActiveTintColor: "rgba(85, 82, 88, 1)",
            tabBarInactiveTintColor: "rgba(148, 143, 153, 1)",
            tabBarStyle: {
              backgroundColor: "rgba(219, 166, 51,1)",
              borderTopWidth: 0,
            },
          })}
        >
          <Tab.Screen name="Ruleta" component={Home} />
          <Tab.Screen
            name="Premios y Participantes"
            component={NewTask}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: focused ? "bold" : "normal",
                    color: focused
                      ? "rgba(85, 82, 88, 1)"
                      : "rgba(148, 143, 153, 1)",
                  }}
                >
                  Participantes{"\n"}Premios
                </Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
