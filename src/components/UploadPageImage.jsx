import React from "react";

const UploadPageImage = ({ theme }) => {
  const imageSrc = theme?.image || "/images/default.png"; // Récupérer l'image depuis le thème

  return (
    <img
      src={imageSrc}
      alt="Thematic Image"
      style={{
        maxWidth: "100%",
        overflowX: "hidden",
        height: "100vh",
        objectFit: "cover", // Assure un affichage proportionnel
      }}
    />
  );
};

export default UploadPageImage;
