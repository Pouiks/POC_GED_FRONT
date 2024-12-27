import React, { createContext, useContext, useState, useEffect } from "react";
import darkTheme from "../theme/darkTheme";
import lightTheme from "../theme/lightTheme";
import { getQueryParam } from "../utils/parseUrlParams";

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  // Applique le thème en fonction du paramètre de l'URL
  useEffect(() => {
    const brand = getQueryParam("brand");
    if (brand === "uxco") {
      setTheme(darkTheme);
    } else if (brand === "ecla") {
      setTheme(lightTheme);
    }
  }, []);

  // Injecte les variables CSS dans le document
  useEffect(() => {
    const root = document.documentElement;
    Object.keys(theme).forEach((key) => {
      root.style.setProperty(`--${key}`, theme[key]);
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;