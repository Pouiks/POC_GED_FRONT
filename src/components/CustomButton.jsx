import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useTheme } from "../context/ThemeContext";
import { translate } from "../utils/translate";

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

const CustomButton = ({ isLanguageButton, currentLanguage, onLanguageChange, onClick }) => {
  const { theme } = useTheme();

  return (
    <StyledButton
      onClick={isLanguageButton ? onLanguageChange : onClick}
    >
      {isLanguageButton && (
        <img
          src={`/images/${currentLanguage === "fr" ? "fr" : "en"}.png`}
          alt={currentLanguage === "fr" ? translate("french_flag") : translate("british_flag")}
          style={{
            width: "20px",
            height: "15px",
            borderRadius: "2px",
            objectFit: "cover",
          }}
        />
      )}
      {isLanguageButton
        ? translate(currentLanguage === "fr" ? "switch_to_english" : "switch_to_french")
        : translate("toggle_theme")}
    </StyledButton>
  );
};

export default CustomButton;