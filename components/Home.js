import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { AppContext } from "./ContextApp";
import Wheel from "./Ruleta";

const { width } = Dimensions.get("window");
const radius = width * 0.4; // tamaño de la ruleta

export default function Home() {
  const { jugadores } = React.useContext(AppContext);

  // const jugadores = ["pepe", "jose", "toboas", "papas", "Jeni", "gabi", "cata"];

  const [competidor, setCompetidor] = useState("");
  const [busca, setBusca] = useState(false);
  const [girando, setGirando] = useState(false);
  const [research, setResearch] = useState(false);
  const [ganador, setGanador] = useState(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const buscarJugador = () => {
    if (busca) return; // si ya está girando, no hacer nada
    if (research) {
      setCompetidor("");
      setResearch(false);
      if (ganador) {
        setGanador(null);
        return;
      }
    }
    setBusca(true);

    // cambia los nombres rápidamente cada 100ms
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * jugadores.length);
      setCompetidor(jugadores[randomIndex]);
    }, 100);

    // detener la búsqueda después de 5 segundos
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current); // frena el cambio rápido
      const ganador = jugadores[Math.floor(Math.random() * jugadores.length)];
      setCompetidor(ganador);
      setBusca(false);
      setResearch(true);
    }, 5000);
  };

  // limpiar ambos si el componente se desmonta
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);
  /* const buscarJugador = () => {
    if (jugadores.length === 0) alert("No hay jugadores disponibles");
    setCompetidor(".....");
    setBusca(true);

    const player = Math.floor(Math.random() * jugadores.length);
    setTimeout(() => {
      setCompetidor(jugadores[player]);
      setBusca(false);
    }, 3000);
  };
+/*/

  /*   const listaPremios = premios.length > 0 ? premios : premiosEjemplo;

  const girarRuleta = () => {
    if (girando) return;
    if (!competidor) {
      alert("Primero debes buscar un jugador");
      return;
    }

    setGanador(null);
    setGirando(true);

    const giros = 5; // cantidad de vueltas completas
    const premioIndex = Math.floor(Math.random() * listaPremios.length);
    const anguloPorPremio = 360 / listaPremios.length;
    const sectorCenter = premioIndex * anguloPorPremio;
    const anguloFinal = 360 * giros + (360 - (sectorCenter % 360));

    Animated.timing(rotateAnim, {
      toValue: anguloFinal,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setGirando(false);
      setGanador(listaPremios[premioIndex]);
      rotateAnim.setValue(anguloFinal % 360); // deja el ángulo final
    });
  };

  const interpolacion = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const colores = [
    "rgba(245, 66, 66, 0.6)",
    "rgba(245, 161, 66, 0.6)",
    "rgba(245, 226, 66, 0.6)",
    "rgba(66, 245, 84, 0.6)",
    "rgba(66, 135, 245, 0.6)",
    "rgba(184, 66, 245, 0.6)",
  ];
  const sectores = listaPremios.map((premio, i) => {
    const rotacion = (360 / listaPremios.length) * i;
    return (
      <View
        key={i}
        style={[
          styles.sector,
          {
            borderBlockColor: colores[i],
            transform: [
              { rotate: `${rotacion}deg` },
              { translateY: -radius / 2 },
            ],
          },
        ]}
      >
        <Text style={styles.texto}>{premio}</Text>
      </View>
    );
  }); */

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#222831" }}>
      <View style={styles.container}>
        <Text style={[styles.resultado, { width: width, textAlign: "center" }]}>
          👤 {competidor ? ` Participante: ${competidor}` : "  Quien Juega?"}
        </Text>
        <Pressable
          style={[
            styles.boton,
            busca && { backgroundColor: "#999" },
            { marginBottom: 40 },
          ]}
          onPress={jugadores.length > 0 ? buscarJugador : null}
          disabled={busca}
        >
          <Ionicons
            name={busca ? "play-outline" : "play"}
            size={20}
            color={"white"}
          ></Ionicons>
          <Text style={styles.textoBoton}>
            {research
              ? "limpiar nombre"
              : busca
              ? "Buscando JUGADOR..."
              : "BUSCAR JUGADOR"}
          </Text>
        </Pressable>

        {/* <Animated.View
          style={[styles.ruleta, { transform: [{ rotate: interpolacion }] }]}
        >
          {sectores}
        </Animated.View>

        <TouchableOpacity
          style={[styles.boton, girando && { backgroundColor: "#999" }]}
          onPress={girarRuleta}
          disabled={girando}
        >
          <Ionicons
            name={girando ? "play-outline" : "play"}
            size={20}
            color={"white"}
          ></Ionicons>
          <Text style={styles.textoBoton}>
            {girando ? "Girando..." : "GIRAR"}
          </Text>
        </TouchableOpacity> */}
        <Wheel competidor={competidor} research={research} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222831",
  },
  ruleta: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderWidth: 3,
    borderColor: "rgba(219, 166, 51,1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  resultado: {
    color: "#fff",
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
});
