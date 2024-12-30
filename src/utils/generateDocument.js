function generateDocuments(data) {
    const result = {};
  
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith("Locataire")) {
        const profileDocuments = mapping.Locataire[value] || [];
        result[key] = profileDocuments.map((doc) => ({ [doc]: null }));
      } else if (key.startsWith("Garant")) {
        const profileDocuments = mapping.Garant[value] || [];
        result[key] = profileDocuments.map((doc) => ({ [doc]: null }));
      } else if (key.includes("representant_legal")) {
        const profileDocuments = mapping.RepresentantLegal.default;
        result[key] = profileDocuments.map((doc) => ({ [doc]: null }));
      }
    });
  
    return result;
  }
  