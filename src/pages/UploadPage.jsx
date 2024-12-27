import React, { useState } from "react";
import DocumentBlock from "../components/DocumentBlock";
import mockBlocks from "../utils/mockData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "../context/ThemeContext";

const UploadPage = () => {
  const { toggleTheme } = useTheme();
  const [blocks, setBlocks] = useState(mockBlocks);

  // Vérification des types autorisés
  const allowedTypes = ["pdf", "jpeg", "jpg", "png"];

  const handleUpload = (blockId, file) => {
    const fileExtension = file.type.split("/")[1].toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      alert(
        `Format non autorisé (${fileExtension}). Les formats autorisés sont : PDF, JPEG, JPG, PNG.`
      );
      return;
    }

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, file } : block
      )
    );
  };

  // Vérification avant envoi
  const handleSubmit = () => {
    const missingFiles = blocks.filter(
      (block) => block.isRequired && !block.file
    );

    if (missingFiles.length > 0) {
      alert(
        `Certains documents obligatoires ne sont pas remplis : ${missingFiles
          .map((block) => block.label)
          .join(", ")}`
      );
      return;
    }

    // Affichage des données si tout est rempli
    console.log("Données soumises :", blocks);
    alert("Tous les documents ont été soumis avec succès !");
  };

  return (
    <Box>
      {/* Bouton pour basculer le thème */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" onClick={toggleTheme}>
          Basculer le thème
        </Button>
      </Box>

      {/* Blocs dynamiques */}
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3} mt={4}>
        {blocks.map((block) => (
          <DocumentBlock
            key={block.id}
            id={block.id}
            label={block.label}
            isRequired={block.required}
            onUpload={(file) => handleUpload(block.id, file)}
          />
        ))}
      </Box>

      {/* Bouton d'envoi */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button variant="contained" onClick={handleSubmit}>
          Envoyer mes documents
        </Button>
      </Box>
    </Box>
  );
};

export default UploadPage;
