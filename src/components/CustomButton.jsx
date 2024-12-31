import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useTheme } from "../context/ThemeContext";
import { translate, setLanguage } from "../utils/translate";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme["primary-color"], // Couleur principale
  color: theme["tertiary-color"], // Texte blanc ou neutre
  "&:hover": {
    backgroundColor: theme["secondary-color"], // Couleur secondaire au survol
  },
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
}));

const CustomButton = ({ isLanguageButton, currentLanguage, onLanguageChange }) => {
  const { theme } = useTheme();

  return (
    <StyledButton
      onClick={isLanguageButton ? onLanguageChange : undefined}
    //   sx={{
    //     backgroundColor: theme["primary-color"],
    //     "&:hover": { backgroundColor: theme["secondary-color"] },
    //   }}
    >
      {isLanguageButton && (
        <img
          src={`/images/${currentLanguage === "fr" ? "fr" : "en"}.png`}
          alt={currentLanguage === "fr" ? "French flag" : "British flag"}
          style={{
            width: "20px",
            height: "15px",
            borderRadius: "2px",
            objectFit: "cover",
          }}
        />
      )}
      {isLanguageButton
        ? currentLanguage.toUpperCase()
        : translate("toggle_theme")}
    </StyledButton>
  );
};

export default CustomButton;
