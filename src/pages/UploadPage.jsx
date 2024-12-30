import React, { useEffect, useState } from "react";
import UploadPageImage from "../components/UploadPageImage";
import DocumentBlock from "../components/DocumentBlock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "../context/ThemeContext";
import { translate, setLanguage } from "../utils/translate";

const UploadPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [tabs, setTabs] = useState([]); // Onglets pour chaque locataire
  const [activeTab, setActiveTab] = useState(0); // Onglet actif
  const [error, setError] = useState(null); // Gestion des erreurs
  const [currentLanguage, setCurrentLanguage] = useState("fr"); // Langue actuelle
  const [decodedData, setDecodedData] = useState(null); // Données décodées une fois pour éviter de les perdre

  // Injecter les variables de thème
  useEffect(() => {
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme]);

  // Décodage du token
  const decodeToken = (token) => {
    const [header, payload, signature] = token.split(".");
    if (!payload) throw new Error("Format du token invalide");
    return JSON.parse(atob(payload));
  };

  // Construction des onglets et sections
  const buildTabsFromData = (data) => {
    return data.map((locataire, index) => {
      const locataireId = `Locataire_${index + 1}`;
      const locataireBlocks = [];
      const garantBlocks = [];
      const representantLegalBlocks = [];
  
      Object.entries(locataire).forEach(([key, value]) => {
        if (key === locataireId) {
          // Documents du locataire
          locataireBlocks.push({
            id: key,
            label: translate(`documents_for_${value.toLowerCase().replace(/ /g, "_")}`),
            required: true,
            file: null,
          });
        } else if (key.startsWith(`${locataireId}_garant`) && value !== null) {
          // Documents des garants
          Object.entries(value).forEach(([docKey, docValue]) => {
            if (docValue === null) {
              garantBlocks.push({
                id: `${key}-${docKey}`,
                label: translate(docKey), // Traduction ici
                required: true,
                file: null,
              });
            }
          });
        } else if (key === `${locataireId}_representant_legal` && value !== null) {
          // Documents du représentant légal
          Object.entries(value).forEach(([docKey, docValue]) => {
            if (docValue === null) {
              representantLegalBlocks.push({
                id: `${key}-${docKey}`,
                label: translate(docKey), // Traduction ici
                required: true,
                file: null,
              });
            }
          });
        }
      });
  
      return {
        title: `${translate("Locataire")} ${index + 1}`,
        sections: [
          { title: translate("Locataire"), blocks: locataireBlocks },
          { title: translate("Garants"), blocks: garantBlocks },
          { title: translate("Representant_legal"), blocks: representantLegalBlocks },
        ],
      };
    });
  };
  

  // Initialisation des onglets
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = decodeToken(token);
        setDecodedData(decoded); // Stocker les données décodées
        const dynamicTabs = buildTabsFromData(decoded.Data || []);
        setTabs(dynamicTabs);
      } catch (err) {
        console.error("Erreur lors du décodage :", err);
        setError("Token invalide ou expiré.");
      }
    } else {
      setError("Aucun token trouvé dans l'URL.");
    }
  }, []);

  const handleUpload = (blockId, file) => {
    const fileExtension = file.type.split("/")[1].toLowerCase();
    const allowedTypes = ["pdf", "jpeg", "jpg", "png"];

    if (!allowedTypes.includes(fileExtension)) {
      alert(
        `Format non autorisé (${fileExtension}). Formats autorisés : PDF, JPEG, JPG, PNG.`
      );
      return;
    }

    setTabs((prev) =>
      prev.map((tab, tabIndex) =>
        tabIndex === activeTab
          ? {
              ...tab,
              sections: tab.sections.map((section) => ({
                ...section,
                blocks: section.blocks.map((block) =>
                  block.id === blockId ? { ...block, file } : block
                ),
              })),
            }
          : tab
      )
    );
  };

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === "fr" ? "en" : "fr";
    setLanguage(newLanguage); // Mettre à jour la langue dans le contexte des traductions
    setCurrentLanguage(newLanguage); // Mettre à jour l'état local
    if (decodedData) {
      const updatedTabs = buildTabsFromData(decodedData.Data || []); // Reconstruire les onglets avec les données décodées
      setTabs(updatedTabs);
    }
  };

  const handleSubmit = () => {
    const missingFiles = tabs.flatMap((tab) =>
      tab.sections.flatMap((section) =>
        section.blocks.filter((block) => block.required && !block.file)
      )
    );

    if (missingFiles.length > 0) {
      alert(
        `Certains documents obligatoires ne sont pas remplis : ${missingFiles
          .map((block) => block.label)
          .join(", ")}`
      );
      return;
    }

    console.log("Données soumises :", tabs);
    alert("Tous les documents ont été soumis avec succès !");
  };

  return (
    <Box display="flex" height="100vh">
      {/* Colonne pour l'image */}
      <Box flex="1" bgcolor="var(--bg-color)" display="flex" justifyContent="center" alignItems="center">
        <UploadPageImage theme={theme} />
      </Box>

      {/* Colonne pour le contenu */}
      <Box flex="2" padding="20px">
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={toggleTheme}>
            {translate("toggle_theme")}
          </Button>
          <Button
            variant="contained"
            onClick={handleLanguageChange}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // Espace entre le drapeau et le texte
            }}
          >
            <img
              src={`/images/${currentLanguage === "fr" ? "fr" : "en"}.png`}
              alt={currentLanguage === "fr" ? "Drapeau français" : "Drapeau britannique"}
              style={{
                width: "20px",
                height: "15px",
                borderRadius: "2px",
                objectFit: "cover",
              }}
            />
            {currentLanguage.toUpperCase()}
          </Button>

        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          indicatorColor="primary"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.title}
              style={{
                color: index === activeTab ? "var(--text-color)" : "var(--inactive-tab-color)",
              }}
            />
          ))}
        </Tabs>

        {/* Contenu des onglets */}
        {tabs[activeTab]?.sections.map((section, sectionIndex) => (
          <Box key={sectionIndex} mt={4}>
            <h3 style={{ textAlign: "left" }}>{section.title}</h3>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-start"
              gap={3}
              mt={2}
            >
              {section.blocks.map((block) => (
                <DocumentBlock
                  key={block.id}
                  id={block.id}
                  label={block.label}
                  isRequired={block.required}
                  onUpload={(file) => handleUpload(block.id, file)}
                />
              ))}
            </Box>
          </Box>
        ))}

        <Box display="flex" justifyContent="center" mt={4}>
          <Button variant="contained"  onClick={handleSubmit}>
            {translate("submit_documents")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadPage;
