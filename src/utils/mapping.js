const mapping = {
  "Étudiant": {
    requiredDocuments: ["piece_identite", "certificat_scolarite", "justificatif_domicile", "rib"],
  },
  "Salarié": {
    requiredDocuments: ["piece_identite", "bulletins_de_salaire", "contrat_travail", "avis_imposition", "justificatif_domicile", "rib"],
  },
  "Travailleur indépendant": {
    requiredDocuments: [
      "piece_identite",
      "avis_imposition",
      "kbis_siret",
      "justificatif_urssaf",
      "justificatif_domicile",
      "rib",
    ],
  },
  "Retraité": {
    requiredDocuments: ["piece_identite", "avis_imposition", "attestation_pension", "justificatif_domicile", "rib"],
  },
  "Chômeur": {
    requiredDocuments: ["piece_identite", "attestation_pole_emploi", "avis_imposition", "justificatif_domicile"],
  },
  "ReprésentantLégal": {
    requiredDocuments: ["piece_identite", "justificatif_domicile", "attestation_prise_en_charge", "releves_bancaires"],
  },
  "Étranger": {
    requiredDocuments: ["piece_identite", "titre_sejour", "documents_specifiques"],
  },
};

export default mapping;