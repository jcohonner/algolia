import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';

const databaseList = [
  {
    "label": "Audit / Finance / Assurance",
    "children": [
      "Corporate Finance",
      "Autres",
      "Audit / Consolidation / Transaction Services",
      "Finance de marché",
      "Actuariat",
      "Fonds d'investissement"
    ]
  },
  {
    "label": "Business",
    "children": [
      "Autres",
      "Commercial",
      "Business Development",
      "Acheteur",
      "Account Management"
    ]
  },
  {
    "label": "Conseil",
    "children": [
      "Autres",
      "Digital",
      "MOA / IT",
      "Management / Organisation",
      "Stratégie",
      "Innovation"
    ]
  },
  {
    "label": "Créa",
    "children": [
      "UX Design",
      "Graphisme / Illustration",
      "UI Design",
      "Production audiovisuelle",
      "Autres",
      "Direction créative",
      "Motion Design"
    ]
  },
  {
    "label": "Hôtellerie / Restauration",
    "children": [
      "Salle",
      "Cuisine",
      "Réception",
      "Etages",
      "Pâtisserie"
    ]
  },
  {
    "label": "Immobilier",
    "children": [
      "Autres",
      "Négociateur",
      "Responsable de travaux",
      "Gestionnaire",
      "Conseiller financier"
    ]
  },
  {
    "label": "Industrie",
    "children": [
      "Autres",
      "Technicien de maintenance",
      "Technicien de production",
      "Opérateur de production",
      "Ouvrier",
      "Responsable qualité",
      "Responsable de production",
      "Responsable réglementaire",
      "Directeur de production"
    ]
  },
  {
    "label": "Marketing / Communication",
    "children": [
      "Marketing",
      "Communication",
      "Community Management / Social Media",
      "Autres",
      "SEO / SEM",
      "Marketing opérationnel",
      "Traffic Management",
      "Marketing stratégique",
      "Evénementiel",
      "Marketing développement"
    ]
  },
  {
    "label": "Media",
    "children": [
      "Autres",
      "Rédacteur",
      "Journaliste",
      "Gestion de projet",
      "Attaché de presse",
      "Planning média",
      "Planning stratégique"
    ]
  },
  {
    "label": "Métiers de la mode",
    "children": [
      "Chef de produit",
      "Autres",
      "Styliste",
      "Achats",
      "Modéliste",
      "Confection",
      "Directeur artistique",
      "Chef de groupe"
    ]
  },
  {
    "label": "Relation client",
    "children": [
      "Support / Service client",
      "Customer Success",
      "Autres"
    ]
  },
  {
    "label": "Retail",
    "children": [
      "Conseiller de vente",
      "Logistique / Achats",
      "Autres",
      "Direction de magasin",
      "Manager des ventes",
      "Visual Merchandising",
      "Magasinier",
      "Responsable formation"
    ]
  },
  {
    "label": "Santé / Médical / Social",
    "children": [
      "Médecin",
      "Autres",
      "Infirmier",
      "Auxiliaire de vie sociale",
      "Aide-soignant"
    ]
  },
  {
    "label": "Support",
    "children": [
      "Opérations",
      "Développement RH / Formation",
      "Comptabilité",
      "Recrutement",
      "Services généraux / Office Management",
      "Juridique",
      "Autres",
      "Direction financière",
      "Contrôle de gestion",
      "Secrétariat"
    ]
  },
  {
    "label": "Tech",
    "children": [
      "Project / Product Management",
      "Dev Fullstack",
      "Autres",
      "DevOps / Infra",
      "Télécoms / Réseaux",
      "Dev Backend",
      "Recherche / R&D",
      "Dev Frontend",
      "Sécurité",
      "Data Engineering"
    ]
  },
  {
    "label": "Tourisme",
    "children": [
      "Conseiller voyages",
      "Transports",
      "Production",
      "Technicien voyages"
    ]
  }
];

// 1. Create a React component
const RefinementList = ({ items, refine }) => {
  const itemHash = {};
  items.forEach(item => {
    itemHash[item.label] = item;
  });

  const fullItemList = databaseList.map(parent => {
    const children = parent.children.map(child => {
      // itemHash[child];
      const key = `${parent.label} | ${child}`;
      return {
        label: child,
        key,
        isRefined: itemHash[key] ? itemHash[key].isRefined : false,
        count: itemHash[key] ? itemHash[key].count : 0,
        value: itemHash[key] ? itemHash[key].value : [],
      };
    });
    return {
      label: parent.label,
      children,
    };
  });

  return (
    <div ClassName="ais-RefinementList">
      <ul className="ais-RefinementList-list">
        {fullItemList.map(parent => (
          <li key={parent.label} className="ais-RefinementList-item">
            {parent.label}
            <ul className="ais-RefinementList-list">
              {parent.children.map(child => (
                <li key={child.key} className="ais-RefinementList-item">
                  <label className="ais-RefinementList-label">
                    <input
                      className="ais-RefinementList-checkbox"
                      type="checkbox"
                      checked={child.isRefined}
                      disabled={child.count == 0}
                      onChange={() => {
                        refine(child.value);
                      }}
                    />
                    <span className="ais-RefinementList-labelText">
                      {child.label}
                    </span>
                    {child.count ? (
                      <span className="ais-RefinementList-count">
                        {child.count}
                      </span>
                    ) : (
                      ''
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 2. Connect the component using the connector
const ProfessionRefinementList = connectRefinementList(RefinementList);

export default ProfessionRefinementList;
