import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "../context/ThemeContext";
import { translate, setLanguage } from "../utils/translate";


const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const DocumentBlock = ({ id, label, isRequired, initialFile, onUpload }) => {
  const { theme } = useTheme(); // Accéder au thème
  const [uploadedFile, setUploadedFile] = useState(initialFile || null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialFile) {
      setUploadedFile(initialFile);
    }
  }, [initialFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("Invalid file format. Only PDF, JPG, JPEG, and PNG are allowed.");
        setUploadedFile(null);
        onUpload(null); // Informe que le fichier est supprimé ou non valide
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
      onUpload(fileDetails); // Informe que le fichier a été uploadé
    }
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setError(null);
    onUpload(null); // Informe que le fichier a été supprimé
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
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("Invalid file format. Only PDF, JPG, JPEG, and PNG are allowed.");
        setUploadedFile(null);
        onUpload(null); // Informe que le fichier est supprimé ou non valide
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
      onUpload(fileDetails); // Informe que le fichier a été uploadé
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Label en dehors du bloc */}
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
          border: `2px dashed ${theme["secondary-color"]}`,
          padding: "10px",
          borderRadius: theme["block-border-radius"],
          minWidth: theme["block-width"],
          minHeight: theme["block-height"],
          position: "relative",
          backgroundColor: theme["dragDropTextColor"],
          textAlign: "center",
          color: theme["dragDropTextColor"],
        }}
      >
        {!uploadedFile ? (
          <>
            <svg viewBox="0 0 640 512" height="50px" style={{ fill: theme["primary-color"] }}>
              <path
                d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
              ></path>
            </svg>
            <p style={{ color: theme["upload-text-color"], fontWeight:"bold" }}>{translate("browse_file")}</p>
            <p style={{ color: theme["upload-text-color"] , fontWeight:"bold", marginTop:'-10px'}}>{translate("here")}</p>
            <label
              htmlFor={`file-${id}`}
              className="browse-button"
              style={{
                backgroundColor: theme["upload-background-button-color"],
                color: theme["upload-background-text-color"],
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Browse file
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
          <div style={{ textAlign: "left", color: theme["text-color"] }}>
            <strong>Type:</strong> {uploadedFile.mimeType}
            <br />
            <strong>Name:</strong> {uploadedFile.name}
            <br />
            <strong>Size:</strong> {uploadedFile.size}
            <CheckCircleIcon
              style={{
                color: "green",
                marginLeft: "10px",
                verticalAlign: "middle",
              }}
              titleAccess="File uploaded successfully"
            />
            <CloseIcon
              style={{
                color: theme["required-color"],
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={handleDelete}
              titleAccess="Remove file"
            />
          </div>
        )}
        {error && <p style={{ color: theme["required-color"], fontSize: "12px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default DocumentBlock;
