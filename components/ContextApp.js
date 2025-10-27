import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [premios, setPremios] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  return (
    <AppContext.Provider
      value={{
        premios,
        setPremios,
        jugadores,
        setJugadores,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
