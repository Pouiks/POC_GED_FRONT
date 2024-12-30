import React from "react";

const UploadPageImage = ({ theme }) => {
  const imageSrc = theme?.image || "/images/default.png"; // Récupérer l'image depuis le thème

  return (
    <img
      src={imageSrc}
      alt="Thematic Image"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover", // Remplissage proportionnel
      }}
    />
  );
};

export default UploadPageImage;
