import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';

const databaseSectorList = [
  {
    label: 'Architecture',
    children: ['Architecture', 'Aménagement / Design'],
  },
  {
    label: 'Association / ONG',
    children: ['Association', 'ONG', 'Fondation'],
  },
  {
    label: 'Banques / Assurances / Finance',
    children: ['Banque', 'FinTech / InsurTech', 'Assurance', 'Finance'],
  },
  {
    label: 'Conseil / Audit',
    children: [
      'IT / Digital',
      'Organisation / Management',
      'Transformation',
      'Stratégie',
      'Audit',
      'Digital Marketing / Data Marketing',
      'Transaction Services',
      'Supply Chain',
      'Expertise comptable',
    ],
  },
  {
    label: 'Culture / Média / Divertissement',
    children: [
      'Média',
      'Télévision / Production audiovisuelle',
      'Sport',
      'Jeux vidéo',
      'Musique',
      'Edition',
      'Presse écrite',
      'Loteries / Jeux de hasard',
      'Musées / Institutions culturelles',
      "Art / Marché de l'art",
    ],
  },
  {
    label: 'Distribution',
    children: ['E-commerce', 'Distribution sélective', 'Grande distribution'],
  },
  {
    label: 'Education / Formation / Recrutement',
    children: [
      'Formation',
      'Recrutement',
      'Ressources humaines',
      'EdTech',
      'Education',
    ],
  },
  {
    label: 'Food et boisson',
    children: [
      'FoodTech',
      'Restauration',
      'Grande consommation',
      'Boissons',
      'Epicerie fine',
      'Artisanat de bouche',
    ],
  },
  {
    label: 'Hôtellerie / Tourisme / Loisirs',
    children: ['Tourisme', 'Hôtellerie', 'Loisirs'],
  },
  {
    label: 'Immobilier',
    children: ['Immobilier particulier', 'Immobilier commercial'],
  },
  {
    label: 'Industrie',
    children: [
      'Energie',
      'Bâtiment / Travaux publics',
      'Aéronautique / Spatiale',
      'Electronique / Télécommunications',
      'Pharmaceutique / Biotechnologique',
      'Métallurgie',
      'Automobile',
      'Agroalimentaire / Nutrition animale',
      'Ferroviaire',
    ],
  },
  {
    label: 'Ingénierie',
    children: ["Bureau d'études et d'ingénierie", 'Ingénieries Spécialisées'],
  },
  {
    label: 'Légal / Justice',
    children: ['Service juridique', 'Justice'],
  },
  {
    label: 'Mobilité / Transport',
    children: ['Logistique', 'Mobilité', 'Transports maritime et routier'],
  },
  {
    label: 'Mode / Luxe / Beauté / Art de vivre',
    children: ['Luxe', 'Mode', 'Cosmétique', 'Art de vivre', 'Joaillerie'],
  },
  {
    label: 'Publicité / Marketing / Agence',
    children: [
      'Digital',
      'Marketing / Communication',
      'Publicité',
      'AdTech  / MarTech',
      'Evénementiel',
      'Design',
      'Relations publiques',
    ],
  },
  {
    label: 'Santé / Social / Environnement',
    children: [
      'Environnement / Développement durable',
      'Santé',
      'Économie collaborative',
      'SocialTech / GreenTech',
      'Services à la personne',
    ],
  },
  {
    label: 'Secteur public et administration',
    children: [
      'Administration publique',
      'Collectivités publiques et territoriales',
      'Administration scolaire et universitaire',
    ],
  },
  {
    label: 'Services aux entreprises',
    children: [
      "Accompagnement d'entreprises",
      'Coworking',
      'Incubateur / Accélérateur',
      "Conciergerie d'entreprise",
    ],
  },
  {
    label: 'Tech',
    children: [
      'Logiciels',
      'SaaS / Cloud Services',
      'Cybersécurité',
      'Big Data',
      'Application mobile',
      'Intelligence artificielle / Machine Learning',
      'Objets connectés',
      'Blockchain',
      'Robotique',
    ],
  },
];

// 1. Create a React component
const RefinementList = ({ items, refine }) => {
  const itemHash = {};
  items.forEach(item => {
    itemHash[item.label] = item;
  });

  const fullItemList = databaseSectorList.map(parent => {
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
const SectorRefinementList = connectRefinementList(RefinementList);

export default SectorRefinementList;
