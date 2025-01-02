import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "../context/ThemeContext";
import { translate } from "../utils/translate";

const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE_MB = 20; // Taille maximale autorisée pour les fichiers

const DocumentBlock = ({ id, label, isRequired, initialFile, onUpload, onDelete, allUploadedFiles }) => {
  const { theme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState(initialFile || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialFile) {
      setUploadedFile(initialFile);
    }
  }, [initialFile]);

  useEffect(() => {
    const syncedFile = allUploadedFiles?.find((f) => f.id === id);
    if (syncedFile && syncedFile.name !== uploadedFile?.name) {
      setUploadedFile(syncedFile); // Synchroniser uniquement si nécessaire
    }
  }, [allUploadedFiles, id]);

  const validateFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(translate("invalid_file_format"));
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(translate("file_too_large"));
      return false;
    }
    const isDuplicate = allUploadedFiles?.some(
      (uploadedFile) => uploadedFile.name === file.name && uploadedFile.type === file.type
    );
    if (isDuplicate) {
      setError(translate("duplicate_file_error"));
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      const fileDetails = {
        id,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      };
      setUploadedFile(fileDetails);
      onUpload(fileDetails); // Appeler uniquement si le fichier est valide
    } else {
      setUploadedFile(null); // Réinitialiser l'état en cas d'erreur
    }
  };

  const handleDelete = () => {
    if (uploadedFile) {
      onDelete(uploadedFile);
    }
    setUploadedFile(null);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      const fileDetails = {
        id,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      };
      setUploadedFile(fileDetails);
      onUpload(fileDetails); // Appeler uniquement si le fichier est valide
    } else {
      setUploadedFile(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ fontWeight: theme["text-weight"], textAlign: "center", color: theme["primary-color"] }}>
        {label} {isRequired && <span style={{ color: theme["required-color"] }}>*</span>}
      </div>
      <div
        className="file-upload-form"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: `2px dashed ${uploadedFile ? "green" : theme["secondary-color"]}`,
          padding: "15px", // Réduit la marge interne
          borderRadius: theme["block-border-radius"],
          width: "180px", // Taille ajustée pour réduire la largeur
          height: "160px", // Taille ajustée pour réduire la hauteur
          position: "relative",
          backgroundColor: theme["dragDropBackgroundColor"],
          textAlign: "center",
          color: theme["dragDropTextColor"],
          wordWrap: "break-word", // Permet le retour à la ligne pour le texte long
          overflowWrap: "break-word",
        }}
      >
        {!uploadedFile ? (
          <>
            <svg viewBox="0 0 640 512" height="100px" style={{ fill: theme["primary-color"] }}>
              <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
            </svg>
            <p style={{ color: theme["upload-text-color"], fontWeight: "bold" }}>
              {translate("drag_file_here")}
            </p>
            <label
              htmlFor={`file-${id}`}
              style={{
                backgroundColor: theme["upload-background-button-color"],
                color: theme["upload-background-text-color"],
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {translate("browse_file")}
              <input
                id={`file-${id}`}
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf,.jpeg,.jpg,.png"
              />
            </label>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: theme["text-color"],
            }}
          >
            <CloseIcon
              style={{
                color: theme["required-color"],
                position: "absolute",
                top: "5px",
                right: "5px",
                cursor: "pointer",
              }}
              onClick={handleDelete}
              titleAccess={translate("remove_file")}
            />
            <div>
              <strong>{translate("name")}:</strong> {uploadedFile.name}
              <br />
              <strong>{translate("type")}:</strong> {uploadedFile.type}
              <br />
              <strong>{translate("size")}:</strong> {uploadedFile.size}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircleIcon
                style={{ color: "green", marginRight: "5px" }}
                titleAccess={translate("file_uploaded_successfully")}
              />
              <span style={{ color: "green", fontWeight: "bold" }}>{translate("document_valid")}</span>
            </div>
          </div>
        )}
        {error && <p style={{ color: theme["required-color"], fontSize: "12px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default DocumentBlock;
