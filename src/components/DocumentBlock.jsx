import React, { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const DocumentBlock = ({ id, label, isRequired, onUpload }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("Format de fichier non autorisé. Veuillez sélectionner un fichier PDF, JPG, JPEG ou PNG.");
        setUploadedFile(null);
        onUpload(id, null);
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
      onUpload(id, fileDetails);
    }
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setError(null);
    onUpload(id, null);
  };

  return (
    <div className="block-container">
      <label className="block-label">
        {label} {isRequired && <span className="block-required">*</span>}
      </label>
      <div
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {uploadedFile ? (
          <>
            <div className="block-file-info">
              <strong>{uploadedFile.mimeType}</strong>
              <span>{uploadedFile.name}</span>
              <small>{uploadedFile.size}</small>
            </div>
            <CloseIcon
              className="close-icon"
              onClick={handleDelete}
              titleAccess="Supprimer le fichier"
            />
            {/* Ajout de l'icône de validation */}
            <CheckCircleIcon className="check-icon"titleAccess="Document valide" />
          </>
        ) : (
          <UploadFileIcon
            className={`block-icon ${isHovered ? "hovered" : ""}`}
          />
        )}
        <input
          type="file"
          className="block-input"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="block-error">{error}</p>}
    </div>
  );
};

export default DocumentBlock;
