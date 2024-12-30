const mapping = {
    Locataire: {
      "Salarié (secteur privé)": [
        "piece_identite",
        "bulletins_de_salaire",
        "contrat_travail",
        "avis_imposition",
        "justificatif_domicile",
        "rib"
      ],
      Fonctionnaire: [
        "piece_identite",
        "bulletins_de_salaire",
        "contrat_travail",
        "avis_imposition",
        "justificatif_domicile",
        "rib",
        "attestation_de_fonction"
      ],
      "Travailleur indépendant": [
        "piece_identite",
        "avis_imposition",
        "kbis_siret",
        "justificatif_urssaf",
        "justificatif_domicile",
        "rib"
      ],
      Étudiant: [
        "piece_identite",
        "certificat_scolarite",
        "justificatif_domicile",
        "rib"
      ],
      "Chômeur ou allocataire": [
        "piece_identite",
        "attestation_pole_emploi",
        "avis_imposition",
        "justificatif_domicile"
      ],
      Mineur: [
        "certificat_naissance",
        "justificatif_scolaire",
        "rib_representant_legal"
      ],
      Retraité: [
        "piece_identite",
        "avis_imposition",
        "attestation_pension",
        "justificatif_domicile",
        "rib"
      ],
      "Étranger (hors UE)": [
        "piece_identite",
        "titre_sejour",
        "documents_specifiques"
      ]
    },
    Garant: {
      "Salarié (secteur privé)": [
        "piece_identite",
        "bulletins_de_salaire",
        "contrat_travail",
        "avis_imposition",
        "justificatif_domicile",
        "rib"
      ],
      Fonctionnaire: [
        "piece_identite",
        "bulletins_de_salaire",
        "contrat_travail",
        "avis_imposition",
        "justificatif_domicile",
        "rib",
        "attestation_de_fonction"
      ],
      "Travailleur indépendant": [
        "piece_identite",
        "avis_imposition",
        "releves_bancaires",
        "justificatif_domicile",
        "attestation_revenus"
      ],
      Étudiant: [
        "piece_identite",
        "bulletins_de_salaire",
        "avis_imposition",
        "justificatif_domicile",
        "rib"
      ],
      "Chômeur ou allocataire": [
        "piece_identite",
        "bulletins_de_salaire",
        "avis_imposition",
        "justificatif_domicile",
        "rib"
      ],
      Mineur: [],
      Retraité: [
        "piece_identite",
        "avis_imposition",
        "attestation_pension",
        "justificatif_domicile",
        "rib"
      ],
      "Étranger (hors UE)": [
        "piece_identite",
        "titre_sejour",
        "documents_specifiques"
      ]
    },
    RepresentantLegal: {
      default: [
        "piece_identite",
        "justificatif_domicile",
        "attestation_prise_en_charge",
        "releves_bancaires"
      ]
    }
  };
  