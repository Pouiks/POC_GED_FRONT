import React, { useEffect, useState } from "react";
import UploadPageImage from "../components/UploadPageImage";
import DocumentBlock from "../components/DocumentBlock";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";
import { useTheme } from "../context/ThemeContext";
import { translate, setLanguage } from "../utils/translate";
import CustomButton from "../components/CustomButton";

const UploadPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [decodedData, setDecodedData] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(0);

  useEffect(() => {
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme]);

  const decodeToken = (token) => {
    const [header, payload] = token.split(".");
    if (!payload) throw new Error("Invalid token format");
    return JSON.parse(atob(payload));
  };

  const initializeCompletionStatus = (tabsData) => {
    const status = {};
    tabsData.forEach((tab) => {
      tab.sections.forEach((section) => {
        status[section.title] = 0; // Toujours à 0 au chargement
      });
    });
    return status;
  };

  const buildTabsFromData = (data) => {
    return data.map((locataire, index) => {
      const locataireId = `Locataire_${index + 1}`;
      const locataireBlocks = [];
      const garantSections = [];
      let representantLegalSection = null;

      locataireBlocks.push({
        id: locataireId,
        label: translate(`documents_for_${locataire[locataireId]?.toLowerCase().replace(/ /g, "_")}`),
        required: true,
        file: null,
      });

      if (locataire[`${locataireId}_mineur`]) {
        const representantLegalDocs = Object.entries(
          locataire[`${locataireId}_representant_legal`] || {}
        ).map(([docKey, docValue]) => ({
          id: `${locataireId}_representant_legal-${docKey}`,
          label: translate(docKey),
          required: true,
          file: docValue || null,
        }));

        representantLegalSection = {
          title: translate("Representant_legal"),
          blocks: representantLegalDocs,
        };
      }

      for (let i = 1; i <= 2; i++) {
        const garantKey = `${locataireId}_garant_${i}`;
        const garant = locataire[garantKey];

        if (garant) {
          const garantDocs = Object.entries(garant)
            .filter(([docKey]) => docKey !== "moral" && docKey !== "physique")
            .map(([docKey, docValue]) => ({
              id: `${garantKey}-${docKey}`,
              label: translate(docKey),
              required: true,
              file: docValue || null,
            }));

          garantSections.push({
            title: `${translate("Garants")} ${i}`,
            blocks: garantDocs,
          });
        }
      }

      return {
        title: `${translate("Locataire")} ${index + 1}`,
        sections: [
          { title: translate("Locataire"), blocks: locataireBlocks },
          ...(representantLegalSection ? [representantLegalSection] : []),
          ...garantSections,
        ],
      };
    });
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = decodeToken(token);
        setDecodedData(decoded);
        const dynamicTabs = buildTabsFromData(decoded.Data || []);
        setTabs(dynamicTabs);

        // Initialiser le compteur de remplissage pour chaque section
        const initialStatus = initializeCompletionStatus(dynamicTabs);
        setCompletionStatus(initialStatus);
      } catch (err) {
        console.error("Token decoding error:", err);
      }
    }
  }, []);

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === "fr" ? "en" : "fr";
    setLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    if (decodedData) {
      const updatedTabs = buildTabsFromData(decodedData.Data || []);
      setTabs(updatedTabs);

      // Réinitialiser l'état en fonction de la nouvelle langue
      const updatedStatus = initializeCompletionStatus(updatedTabs);
      setCompletionStatus(updatedStatus);
    }
  };

  const handleUpload = (sectionTitle, isUploaded) => {
    setCompletionStatus((prev) => ({
      ...prev,
      [sectionTitle]: isUploaded
        ? prev[sectionTitle] + 1
        : Math.max(prev[sectionTitle] - 1, 0),
    }));
  };

  const getDocumentLabel = (filledCount, totalCount) => {
    return totalCount === 1
      ? `${filledCount}/${totalCount} document rempli`
      : `${filledCount}/${totalCount} documents remplis`;
  };

  const isSectionComplete = (sectionTitle, totalDocs) => {
    return completionStatus[sectionTitle] === totalDocs;
  };

  return (
    <Box display="flex" height="100vh">
      {/* Colonne pour l'image */}
      <Box
        sx={{
          flex: "0 0 40%",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          backgroundColor: "var(--primary-color)",
        }}
      >
        <UploadPageImage theme={theme} />
      </Box>

      {/* Colonne pour le contenu */}
      <Box
        sx={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          padding: "20px",
          backgroundColor: theme["bg-color"],
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={2}>
          <CustomButton
            isLanguageButton={false}
            onClick={toggleTheme}
          />
          <CustomButton
            isLanguageButton={true}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          indicatorColor={theme["primary-color"]}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.title}
              style={{
                color: index === activeTab ? theme["primary-color"] : theme["primary-color"],
              }}
            />
          ))}
        </Tabs>

        {tabs[activeTab]?.sections.map((section, sectionIndex) => (
          <Accordion
            key={sectionIndex}
            expanded={expandedAccordion === sectionIndex}
            onChange={() =>
              setExpandedAccordion((prev) =>
                prev === sectionIndex ? -1 : sectionIndex
              )
            }
            sx={{
              border: `1px solid ${theme["secondary-color"]}`,
              backgroundColor: theme["tertiary-color"],
              margin: "10px 0",
              borderRadius: "10px",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: theme["text-color"] }} />}>
              <Typography
                variant="h6"
                style={{ color: theme["text-color"], display: "flex", alignItems: "center" }}
              >
                {section.title}{" "}
                ({getDocumentLabel(
                  completionStatus[section.title],
                  section.blocks.length
                )})
                {isSectionComplete(section.title, section.blocks.length) && (
                  <CheckCircleIcon
                    style={{
                      color: "green",
                      marginLeft: "10px",
                      verticalAlign: "middle",
                    }}
                    titleAccess="Section complète"
                  />
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexWrap="wrap" gap={3}>
                {section.blocks.map((block) => (
                  <DocumentBlock
                    key={block.id}
                    id={block.id}
                    label={block.label}
                    isRequired={block.required}
                    onUpload={(file) =>
                      handleUpload(section.title, Boolean(file))
                    }
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default UploadPage;
