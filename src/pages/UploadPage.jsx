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
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(0);

  const initializeUploadedFiles = (tabsData) => {
    const files = {};
    tabsData.forEach((tab, tabIndex) => {
      tab.sections.forEach((section) => {
        const sectionKey = `${tabIndex}-${section.title}`;
        files[sectionKey] = {};
      });
    });
    return files;
  };

  const buildTabsFromData = (data) => {
    return data.map((locataire, index) => ({
      title: `${translate("locataire")} ${index + 1}`,
      sections: [
        {
          title: translate("locataire_documents"),
          blocks: Object.entries(locataire.documents || {}).map(([key, value]) => ({
            id: `${key}-${index}`,
            label: translate(key),
            required: true,
            file: value || null,
          })),
        },
        {
          title: translate("representant_legal"),
          blocks: Object.entries(locataire.representantLegal?.documents || {}).map(([key, value]) => ({
            id: `${key}-legal-${index}`,
            label: translate(key),
            required: true,
            file: value || null,
          })),
        },
        ...(locataire.garants || []).map((garant, garantIndex) => ({
          title: `${translate("garants")} ${garantIndex + 1}`,
          blocks: Object.entries(garant.documents || {}).map(([key, value]) => ({
            id: `${key}-garant-${index}-${garantIndex}`,
            label: translate(key),
            required: true,
            file: value || null,
          })),
        })),
      ],
    }));
  };

  const handleFileUpload = (file, sectionTitle, blockId) => {
    if (!file) return;

    if (!uploadedFiles[sectionTitle]) {
      uploadedFiles[sectionTitle] = {};
    }

    const isDuplicate = Object.values(uploadedFiles[sectionTitle]).some(
      (uploadedFile) => uploadedFile?.name === file.name && uploadedFile?.type === file.type
    );

    if (isDuplicate) {
      alert(translate("duplicate_file_error"));
      return false;
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [sectionTitle]: {
        ...prev[sectionTitle],
        [blockId]: file,
      },
    }));

    console.log(`Fichier ajouté dans la section "${sectionTitle}" :`, file);
    return true;
  };

  const handleFileDelete = (file, sectionTitle, blockId) => {
    setUploadedFiles((prev) => {
      const updatedSection = { ...prev[sectionTitle] };
      delete updatedSection[blockId];
      return {
        ...prev,
        [sectionTitle]: updatedSection,
      };
    });

    console.log(`Fichier supprimé de la section "${sectionTitle}" :`, file);
  };

  const isSectionComplete = (sectionTitle, totalDocs) => {
    return Object.keys(uploadedFiles[sectionTitle] || {}).length === totalDocs;
  };

  const getDocumentLabel = (filledCount, totalCount) => {
    return totalCount === 1
      ? `${filledCount}/${totalCount} ${translate("document_filled")}`
      : `${filledCount}/${totalCount} ${translate("documents_filled")}`;
  };

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === "fr" ? "en" : "fr";
    setLanguage(newLanguage);
    setCurrentLanguage(newLanguage);

    if (decodedData) {
      const tabsData = buildTabsFromData(decodedData.locataires || []);
      setTabs(tabsData);
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setDecodedData(decoded);

        const tabsData = buildTabsFromData(decoded.locataires || []);
        setTabs(tabsData);

        const files = initializeUploadedFiles(tabsData);
        setUploadedFiles(files);
      } catch (err) {
        console.error("Erreur lors du décodage du token :", err);
      }
    }
  }, []);

  return (
    <Box display="flex" height="100vh">
      <Box sx={{ flex: "0 0 40%", height: "100vh", backgroundColor: theme["primary-color"] }}>
        <UploadPageImage theme={theme} />
      </Box>
      <Box sx={{ flex: 1, height: "100vh", overflowY: "auto", padding: "20px", backgroundColor: theme["bg-color"] }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <CustomButton isLanguageButton={false} onClick={toggleTheme} />
          <CustomButton isLanguageButton={true} currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange} />
        </Box>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.title} />
          ))}
        </Tabs>

        {tabs[activeTab]?.sections.map((section, sectionIndex) => (
          <Accordion
            key={sectionIndex}
            expanded={expandedAccordion === sectionIndex}
            onChange={() => setExpandedAccordion((prev) => (prev === sectionIndex ? -1 : sectionIndex))}
            sx={{ marginBottom: "20px" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {section.title} (
                {getDocumentLabel(
                  Object.keys(uploadedFiles[`${activeTab}-${section.title}`] || {}).length,
                  section.blocks.length
                )}
                )
                {isSectionComplete(`${activeTab}-${section.title}`, section.blocks.length) && (
                  <CheckCircleIcon style={{ color: "green", marginLeft: "10px" }} />
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: "wrap"}}>
              {section.blocks.map((block) => (
                <DocumentBlock
                  key={block.id}
                  id={block.id}
                  label={block.label}
                  isRequired={block.required}
                  initialFile={
                    uploadedFiles[`${activeTab}-${section.title}`]?.[block.id] || null
                  }
                  onUpload={(file) => handleFileUpload(file, `${activeTab}-${section.title}`, block.id)}
                  onDelete={(file) => handleFileDelete(file, `${activeTab}-${section.title}`, block.id)}
                  allUploadedFiles={Object.values(uploadedFiles[`${activeTab}-${section.title}`] || {})}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default UploadPage;
