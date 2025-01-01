import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "../context/ThemeContext";
import { translate } from "../utils/translate";

const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpeg", ".jpg", ".png"];
const MAX_FILE_SIZE_MB = 20; // Taille maximale autorisée pour les fichiers

const DocumentBlock = ({ id, label, isRequired, initialFile, onUpload }) => {
  const { theme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState(initialFile || null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false); // État de validation du fichier

  useEffect(() => {
    if (initialFile) {
      setUploadedFile(initialFile);
      validateFile(initialFile);
    }
  }, [initialFile]);

  // Fonction de validation complète
  const validateFile = (file) => {
    if (!file) return false;

    const validMimeTypes = ALLOWED_FILE_TYPES.map((type) => type.toLowerCase());
    if (!validMimeTypes.includes(file.mimeType.toLowerCase())) {
      setError(translate("invalid_file_format"));
      setIsValid(false);
      return false;
    }

    const fileSizeInMB = parseFloat(file.size.split(" ")[0]);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      setError(translate("file_too_large"));
      setIsValid(false);
      return false;
    }

    setError(null);
    setIsValid(true);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

      if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(fileExtension)) {
        setError(translate("invalid_file_format"));
        setUploadedFile(null);
        onUpload(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(translate("file_too_large"));
        setUploadedFile(null);
        onUpload(null);
        return;
      }

      setError(null);
      const mimeType = file.type.split("/").pop().toUpperCase();
      const size =
        file.size >= 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
          : (file.size / 1024).toFixed(2) + " KB";

      const fileDetails = { name: file.name, mimeType, size };
      setUploadedFile(fileDetails);
      onUpload(fileDetails);
    }
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setError(null);
    setIsValid(false);
    onUpload(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovered(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const mimeType = file.type.split("/").pop().toUpperCase();
      const size =
        file.size >= 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
          : (file.size / 1024).toFixed(2) + " KB";

      const fileDetails = { name: file.name, mimeType, size };
      const isValid = validateFile(fileDetails);

      if (isValid) {
        setUploadedFile(fileDetails);
        onUpload(fileDetails);
      } else {
        setUploadedFile(null);
        onUpload(null);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Label du bloc */}
      <div
        style={{
          fontWeight: theme["text-weight"] || "bold",
          textAlign: "center",
          color: theme["primary-color"],
        }}
      >
        {label} {isRequired && <span style={{ color: theme["required-color"] }}>*</span>}
      </div>
      {/* Bloc principal */}
      <div
        className={`file-upload-form ${isHovered ? "hovered" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: `2px dashed ${isValid ? "green" : theme["secondary-color"]}`,
          padding: "20px",
          borderRadius: theme["block-border-radius"],
          width: "150px", // Largeur augmentée
          height: "150px", // Hauteur augmentée
          position: "relative",
          backgroundColor: theme["dragDropBackgroundColor"],
          textAlign: "center",
          color: theme["dragDropTextColor"],
        }}
      >
        {!uploadedFile ? (
          <>
            <svg viewBox="0 0 640 512" height="150px" style={{ fill: theme["primary-color"] }}>
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              ></path>
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
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: theme["text-color"],
              height: "100%",
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
              <strong>{translate("type")}:</strong> {uploadedFile.mimeType}
              <br />
              <strong>{translate("size")}:</strong> {uploadedFile.size}
            </div>
            <div style={{ display: "flex", alignItems: "center", position: "absolute", bottom: "5px", left: "5px" }}>
              <span style={{ color: "green", fontWeight: "bold" }}>{translate("document_valid")}</span>
              <CheckCircleIcon
                style={{
                  color: "green",
                  marginLeft: "5px",
                }}
                titleAccess={translate("file_uploaded_successfully")}
              />
            </div>
          </div>
        )}
        {error && <p style={{ color: theme["required-color"], fontSize: "12px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default DocumentBlock;
