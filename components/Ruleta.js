import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { AppContext } from "./ContextApp";
export default function Wheel({ competidor, research }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const { premios } = React.useContext(AppContext);

  const premiosEjemplo = [
    "auto",
    "motocicleta",
    "bicicleta",
    "patinete",
    "skateboard",
  ];

  const itemsToUse = premios.length > 0 ? premios : premiosEjemplo;
  const colorsArray = [
    "#E74C3C",
    "#3498DB",
    "#F1C40F",
    "#2ECC71",
    "#9B59B6",
    "#E67E22",
    "#1ABC9C",
    "#F39C12",
    "#8E44AD",
    "#16A085",
    "#D35400",
    "#2980B9",
    "#C0392B",
    "#27AE60",
    "#BDC3C7",
  ];
  const { width } = Dimensions.get("window");
  const radius = width * 0.4; // un poco más chico para que entre bien
  const numSegments = itemsToUse.length;
  const anglePerSegment = 360 / numSegments;

  useEffect(() => {
    if (research) {
      setWinner(null);
    }
  }, [research]);

  // crea los paths (arcos) de la ruleta
  const createWheelPaths = () => {
    const paths = [];
    for (let i = 0; i < numSegments; i++) {
      const startAngle = (i * 2 * Math.PI) / numSegments;
      const endAngle = ((i + 1) * 2 * Math.PI) / numSegments;

      const x1 = radius + radius * Math.cos(startAngle);
      const y1 = radius + radius * Math.sin(startAngle);
      const x2 = radius + radius * Math.cos(endAngle);
      const y2 = radius + radius * Math.sin(endAngle);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const d = `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;

      paths.push({
        d,
        label: itemsToUse[i],
        rotate: i * anglePerSegment + anglePerSegment / 2, // centro del sector para rotar el texto
        color: colorsArray[i % colorsArray.length], // si hay más items que colores, se repiten
      });
    }
    return paths;
  };

  const wheelPaths = createWheelPaths();

  // ----- función de giro corregida -----
  const spinWheel = (competidor) => {
    if (spinning || numSegments === 0) return;
    if (!competidor) {
      alert("Primero debes buscar un jugador");
      return;
    }
    setSpinning(true);
    setWinner(null);

    // 1) elegimos el índice ganador (aleatorio)
    const premioIndex = Math.floor(Math.random() * itemsToUse.length);

    // 2) calculamos el centro del sector elegido (medido desde 0° = eje X positivo / derecha)
    const sectorCenter = premioIndex * anglePerSegment + anglePerSegment / 2;

    // 3) queremos que (sectorCenter + R) % 360 === 270 (270° = arriba)
    //    entonces Rbase = 270 - sectorCenter
    const Rbase = 270 - sectorCenter;

    // 4) añadir vueltas completas para buena animación + offset aleatorio dentro del sector
    const spins = 6; // cantidad de vueltas completas
    const offset = (Math.random() - 0.5) * anglePerSegment; // +/- mitad de sector

    const finalRotation = spins * 360 + Rbase + offset;

    // 5) animar
    Animated.timing(rotation, {
      toValue: finalRotation,
      duration: 4500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // normalizamos el valor a 0..360 para no tener números gigantes
      const normalized = ((finalRotation % 360) + 360) % 360;
      rotation.setValue(normalized);
      setSpinning(false);
      setWinner(itemsToUse[premioIndex]);
    });
  };

  // Interpolación para rotar con Animated
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>
        {winner && research
          ? `🎯 ¡${competidor} ganaste un/a ${winner}!`
          : "Ruleta"}
      </Text>

      {/* contenedor del svg + indicador (relativo) */}
      <View
        style={{
          width: radius * 2,
          height: radius * 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* indicador fijo en la parte superior del círculo */}
        <View style={[styles.indicator, { top: -12 }]} />

        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Svg width={radius * 2} height={radius * 2}>
            <G>
              {wheelPaths.map((seg, i) => (
                <G key={i}>
                  <Path
                    d={seg.d}
                    fill={seg.color}
                    stroke="#333"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={radius}
                    y={radius / 4} // ubica el texto cerca del borde interior del sector
                    fill="white"
                    fontSize={Math.max(12, Math.floor(radius * 0.12))}
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${
                      seg.rotate + 90
                    }, ${radius}, ${radius})`}
                  >
                    {seg.label}
                  </SvgText>
                </G>
              ))}
            </G>
          </Svg>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.boton, spinning && { backgroundColor: "#999" }]}
        onPress={() => spinWheel(competidor)}
        disabled={spinning}
      >
        <Ionicons
          name={spinning ? "play-outline" : "play"}
          size={20}
          color={"white"}
        ></Ionicons>
        <Text style={styles.textoBoton}>
          {spinning ? "Girando..." : "GIRAR"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222831",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 28,
    fontWeight: "700",
    justifyContent: "center",
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#42a5f5",
    padding: 12,
    borderRadius: 10,
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

  indicator: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "red",
    zIndex: 10,
  },
});
