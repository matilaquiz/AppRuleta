import React from "react";
import { Text, StyleSheet, View, Dimensions, TextInput } from "react-native";
import { AppContext } from "./ContextApp";

const radius = Dimensions.get("window").width * 0.4; // tamaño de la ruleta
export default function NewTask() {
  const { jugadores, setJugadores, premios, setPremios } =
    React.useContext(AppContext);
  const [nuevoJugador, setNuevoJugador] = React.useState("");
  const [nuevoPremio, setNuevoPremio] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", fontSize: 24 }}>
        Escriba los participantes
      </Text>
      <TextInput
        style={styles.Input}
        placeholder="Escriba el nuevo participante"
        placeholderTextColor="#7e7777ff"
        onChangeText={setNuevoJugador}
        value={nuevoJugador}
        onSubmitEditing={() => {
          if (nuevoJugador.trim() === "") return;
          const jugadorExistente = jugadores.find(
            (j) => j === nuevoJugador.trim()
          );
          if (jugadorExistente) {
            alert("El participante ya existe");
          } else {
            setJugadores([...jugadores, nuevoJugador]);
          }
          setNuevoJugador("");
        }}
      />
      <View style={styles.card}>
        {jugadores.map((j, i) => (
          <Text style={styles.textoBoton} key={i}>
            {j}
          </Text>
        ))}
      </View>

      <Text style={{ color: "white", fontSize: 24 }}>Escriba los paremios</Text>
      <TextInput
        style={styles.Input}
        placeholder="Escriba el nuevo premio"
        placeholderTextColor="#7e7777ff"
        onChangeText={setNuevoPremio}
        value={nuevoPremio}
        onSubmitEditing={() => {
          if (nuevoPremio.trim() === "") return;
          setPremios([...premios, nuevoPremio]);
          setNuevoPremio("");
        }}
      />
      <View style={styles.card}>
        {premios.map((j, i) => (
          <Text style={styles.textoBoton} key={i}>
            {j}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222831",
  },
  Input: {
    width: radius * 1.5,
    backgroundColor: "rgba(250, 249, 247, 1)",
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    textAlign: "center",
  },
  card: {
    width: radius * 2,

    marginTop: 20,
    backgroundColor: "rgba(85, 82, 88, 1)",
    backgroundColor: "rgba(85, 82, 88, 1)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(219, 166, 51,1)",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative",
    overflow: "hidden",
    padding: 10,
  },
  sector: {
    position: "absolute",
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  indicador: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "red",
    marginBottom: 10,
  },
  boton: {
    marginTop: 40,
    backgroundColor: "#6b7531ff",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textoBoton: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "white",
    width: "auto",
    height: 30,
    fontSize: 18,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
