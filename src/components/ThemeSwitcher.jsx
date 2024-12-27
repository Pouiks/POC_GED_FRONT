import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "10px 20px",
        backgroundColor: theme.accentColor,
        color: theme.textColor,
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Basculer le thème
    </button>
  );
};

export default ThemeSwitcher;
