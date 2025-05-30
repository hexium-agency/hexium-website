export interface Option {
  label: string;
  value: number;
  value_type?: 'additive' | 'multiplicative' | 'multiplicative_page';
  had_design?: boolean;
  secondary_value?: number;
  pass_next_step?: boolean;
  multiplier?: number;
  min?: number;
  max?: number;
  slides_type?: 'pages' | 'methods' | 'APIs';
}

export interface StepConfig {
  id: string;
  type: 'select' | 'slider' | 'multi-select';
  title: string;
  subtitle?: string;
  options?: Option[];
}

export const mobileStepsConfig: StepConfig[] = [
  {
    id: 'platform',
    type: 'select',
    title: 'Choisissez votre plateforme:',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'iOS' },
      { value: 0, label: 'Android' },
      { value: 0.25, value_type: 'multiplicative', label: 'Les deux' },
    ],
  },
  {
    id: 'specifications',
    type: 'select',
    title: 'Avez-vous un cahier des charges ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 5, value_type: 'additive', label: "J'ai une ébauche de cahier des charges" },
      { value: 3, value_type: 'additive', label: 'Mon cahier des charges est prêt' },
      { value: 8, value_type: 'additive', label: "Je n'ai pas de cahier des charges" },
    ],
  },
  {
    id: 'device-type',
    type: 'select',
    title: 'Je veux que mon application soit consultable sur...',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Mobile' },
      { value: 0, label: 'Tablette' },
      { value: 0.15, value_type: 'multiplicative', label: 'Les deux' },
    ],
  },
  {
    id: 'orientation',
    type: 'select',
    title: "Quelle orientation de l'application voulez-vous ?",
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Portrait' },
      { value: 0, label: 'Paysage' },
      { value: 0.4, value_type: 'multiplicative', label: 'Les deux' },
    ],
  },
  {
    id: 'design',
    type: 'select',
    title: 'Avez vous déja un design pour votre application ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, had_design: true, label: 'Oui' },
      { value: 0, had_design: false, label: 'Non' },
    ],
  },
  {
    id: 'design-complexity',
    type: 'select',
    title: 'Souhaitez-vous un design simple ou complexe ?',
    subtitle: 'Une seule réponse possible',
    options: [
      {
        value: 1,
        secondary_value: 2,
        value_type: 'multiplicative_page',
        label: 'Design simple (templates)',
      },
      {
        value: 2,
        secondary_value: 3.5,
        value_type: 'multiplicative_page',
        label: 'Design complexe (personnalisé)',
      },
    ],
  },
  {
    id: 'pages',
    type: 'slider',
    title: 'Combien de pages souhaitez-vous ?',
    subtitle: 'Utilisez le curseur pour sélectionner le nombre de pages',
    options: [{ value: 1, min: 1, max: 20, label: 'page', slides_type: 'pages' }],
  },
  {
    id: 'economical-model',
    type: 'select',
    title: 'Quel est votre modèle économique ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Freemium' },
      { value: 0, label: 'Abonnement' },
      { value: 0, label: 'Achats In-App' },
      { value: 2, pass_next_step: true, label: 'Publicités' },
      { value: 0, pass_next_step: true, label: 'Aucun' },
    ],
  },
  {
    id: 'payment-methods',
    type: 'slider',
    title: 'Combien de méthodes de paiement souhaitez-vous ?',
    subtitle: 'Utilisez le curseur pour sélectionner le nombre de méthodes de paiement',
    options: [
      { value: 1, min: 1, max: 5, multiplier: 3, label: 'méthode', slides_type: 'methods' },
    ],
  },
  {
    id: 'functionalities',
    type: 'multi-select',
    title: 'Quelles fonctionnalités principales souhaitez-vous ?',
    subtitle: 'Plusieurs réponses possibles',
    options: [
      { value: 3, value_type: 'additive', label: 'Authentification' },
      { value: 2, value_type: 'additive', label: 'Profil utilisateur' },
      { value: 8, value_type: 'additive', label: 'Messagerie' },
      { value: 4, value_type: 'additive', label: 'NFC/Bluetooth/WIFI' },
      { value: 3, value_type: 'additive', label: 'Géolocalisation' },
      { value: 3, value_type: 'additive', label: 'Notifications Push' },
      { value: 3, value_type: 'additive', label: 'Notifications In-App' },
      { value: 2, value_type: 'additive', label: 'Vérification SMS' },
      { value: 3, value_type: 'additive', label: 'Galerie de médias' },
      { value: 10, value_type: 'additive', label: 'Mode Hors ligne' },
      { value: 7, value_type: 'additive', label: 'Panel administrateur' },
      { value: 9, value_type: 'additive', label: 'Lives/Discussion vidéo' },
      { value: 11, value_type: 'additive', label: 'E-Commerce' },
      { value: 6, value_type: 'additive', label: 'Commentaires' },
      { value: 3, value_type: 'additive', label: 'Analytics' },
      { value: 4, value_type: 'additive', label: 'Multi-langue' },
      { value: 3, value_type: 'additive', label: 'E-Mailing' },
      { value: 6, value_type: 'additive', label: 'CMS' },
      { value: 4, value_type: 'additive', label: 'Real Time Communication' },
      { value: 8, value_type: 'additive', label: 'Calendrier' },
    ],
  },
  {
    id: 'api-number',
    type: 'slider',
    title: "Combien d'API tierces souhaitez-vous ?",
    subtitle: "Utilisez le curseur pour sélectionner le nombre d'API tierces",
    options: [{ value: 0, min: 0, max: 5, label: 'API', multiplier: 3, slides_type: 'APIs' }],
  },
  {
    id: 'roles',
    type: 'select',
    title: 'Combien de rôles souhaitez-vous (Administrateur, Modérateur, etc.) ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: '1' },
      { value: 0.1, value_type: 'multiplicative', label: '2' },
      { value: 0.2, value_type: 'multiplicative', label: '3+' },
    ],
  },
  {
    id: 'project-maturity',
    type: 'select',
    title: 'Maturité du projet ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: "Je me renseigne, j'ai deja d'autres devis" },
      { value: 0, label: 'Projet réfléchi, mais aucun devis' },
      { value: 0, label: 'Je me renseigne par curiosité' },
    ],
  },
  {
    id: 'user-type',
    type: 'select',
    title: 'Je fais cette demande en tant que...',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Particulier' },
      { value: 0, label: 'Association' },
      { value: 0, label: 'Administration' },
      { value: 0, label: 'Entreprise' },
      { value: 0, label: 'Autre' },
    ],
  },
];

export const pwaStepsConfig: StepConfig[] = [
  {
    id: 'specifications',
    type: 'select',
    title: 'Avez-vous un cahier des charges ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 5, value_type: 'additive', label: "J'ai une ébauche de cahier des charges" },
      { value: 3, value_type: 'additive', label: 'Mon cahier des charges est prêt' },
      { value: 8, value_type: 'additive', label: "Je n'ai pas de cahier des charges" },
    ],
  },
  {
    id: 'device-type',
    type: 'select',
    title: 'Je veux que mon application soit consultable sur...',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Mobile' },
      { value: 0, label: 'Tablette' },
      { value: 0.15, value_type: 'multiplicative', label: 'Les deux' },
    ],
  },
  {
    id: 'orientation',
    type: 'select',
    title: "Quelle orientation de l'application voulez-vous ?",
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Portrait' },
      { value: 0, label: 'Paysage' },
      { value: 0.4, value_type: 'multiplicative', label: 'Les deux' },
    ],
  },
  {
    id: 'design',
    type: 'select',
    title: 'Avez vous déja un design pour votre application ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, had_design: true, label: 'Oui' },
      { value: 0, had_design: false, label: 'Non' },
    ],
  },
  {
    id: 'design-complexity',
    type: 'select',
    title: 'Souhaitez-vous un design simple ou complexe ?',
    subtitle: 'Une seule réponse possible',
    options: [
      {
        value: 1,
        secondary_value: 2,
        value_type: 'multiplicative_page',
        label: 'Design simple (templates)',
      },
      {
        value: 2,
        secondary_value: 3.5,
        value_type: 'multiplicative_page',
        label: 'Design complexe (personnalisé)',
      },
    ],
  },
  {
    id: 'pages',
    type: 'slider',
    title: 'Combien de pages souhaitez-vous ?',
    subtitle: 'Utilisez le curseur pour sélectionner le nombre de pages',
    options: [{ value: 1, min: 1, max: 20, label: 'page', slides_type: 'pages' }],
  },
  {
    id: 'economical-model',
    type: 'select',
    title: 'Quel est votre modèle économique ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Freemium' },
      { value: 0, label: 'Abonnement' },
      { value: 0, label: 'Achats In-App' },
      { value: 2, pass_next_step: true, label: 'Publicités' },
      { value: 0, pass_next_step: true, label: 'Aucun' },
    ],
  },
  {
    id: 'payment-methods',
    type: 'slider',
    title: 'Combien de méthodes de paiement souhaitez-vous ?',
    subtitle: 'Utilisez le curseur pour sélectionner le nombre de méthodes de paiement',
    options: [
      { value: 1, min: 1, max: 5, multiplier: 3, label: 'méthode', slides_type: 'methods' },
    ],
  },
  {
    id: 'functionalities',
    type: 'multi-select',
    title: 'Quelles fonctionnalités principales souhaitez-vous ?',
    subtitle: 'Plusieurs réponses possibles',
    options: [
      { value: 3, value_type: 'additive', label: 'Authentification' },
      { value: 2, value_type: 'additive', label: 'Profil utilisateur' },
      { value: 8, value_type: 'additive', label: 'Messagerie' },
      { value: 4, value_type: 'additive', label: 'NFC/Bluetooth/WIFI' },
      { value: 3, value_type: 'additive', label: 'Géolocalisation' },
      { value: 3, value_type: 'additive', label: 'Notifications Push' },
      { value: 3, value_type: 'additive', label: 'Notifications In-App' },
      { value: 2, value_type: 'additive', label: 'Vérification SMS' },
      { value: 3, value_type: 'additive', label: 'Galerie de médias' },
      { value: 10, value_type: 'additive', label: 'Mode Hors ligne' },
      { value: 7, value_type: 'additive', label: 'Panel administrateur' },
      { value: 9, value_type: 'additive', label: 'Lives/Discussion vidéo' },
      { value: 11, value_type: 'additive', label: 'E-Commerce' },
      { value: 6, value_type: 'additive', label: 'Commentaires' },
      { value: 3, value_type: 'additive', label: 'Analytics' },
      { value: 4, value_type: 'additive', label: 'Multi-langue' },
      { value: 3, value_type: 'additive', label: 'E-Mailing' },
      { value: 6, value_type: 'additive', label: 'CMS' },
      { value: 4, value_type: 'additive', label: 'Real Time Communication' },
      { value: 8, value_type: 'additive', label: 'Calendrier' },
    ],
  },
  {
    id: 'api-number',
    type: 'slider',
    title: "Combien d'API tierces souhaitez-vous ?",
    subtitle: "Utilisez le curseur pour sélectionner le nombre d'API tierces",
    options: [{ value: 0, min: 0, max: 5, label: 'API', multiplier: 3, slides_type: 'APIs' }],
  },
  {
    id: 'roles',
    type: 'select',
    title: 'Combien de rôles souhaitez-vous (Administrateur, Modérateur, etc.) ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: '1' },
      { value: 0.1, value_type: 'multiplicative', label: '2' },
      { value: 0.2, value_type: 'multiplicative', label: '3+' },
    ],
  },
  {
    id: 'project-maturity',
    type: 'select',
    title: 'Maturité du projet ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: "Je me renseigne, j'ai deja d'autres devis" },
      { value: 0, label: 'Projet réfléchi, mais aucun devis' },
      { value: 0, label: 'Je me renseigne par curiosité' },
    ],
  },
  {
    id: 'user-type',
    type: 'select',
    title: 'Je fais cette demande en tant que...',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Particulier' },
      { value: 0, label: 'Association' },
      { value: 0, label: 'Administration' },
      { value: 0, label: 'Entreprise' },
      { value: 0, label: 'Autre' },
    ],
  },
];

export const webAppStepsConfig: StepConfig[] = [
  {
    id: 'app-type',
    type: 'select',
    title: 'Je fais cette demande en tant que...',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Site vitrine' },
      { value: 0, label: 'Application métier / SAAS' },
      { value: 11, label: 'E-Commerce' },
      { value: 0, label: 'Reseau social, Forum...' },
      { value: 0, label: 'Autre' },
    ],
  },
  {
    id: 'specifications',
    type: 'select',
    title: 'Avez-vous un cahier des charges ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 5, value_type: 'additive', label: "J'ai une ébauche de cahier des charges" },
      { value: 3, value_type: 'additive', label: 'Mon cahier des charges est prêt' },
      { value: 8, value_type: 'additive', label: "Je n'ai pas de cahier des charges" },
    ],
  },
  {
    id: 'project-type',
    type: 'select',
    title: "Nouveau projet ou refonte d'une application web existante ?",
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Nouveau projet' },
      { value: 0, label: "Refonte d'une application web existante" },
    ],
  },
  {
    id: 'design',
    type: 'select',
    title: 'Avez vous déja un design pour votre application ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, had_design: true, label: 'Oui' },
      { value: 0, had_design: false, label: 'Non' },
    ],
  },
  {
    id: 'design-complexity',
    type: 'select',
    title: 'Souhaitez-vous un design simple ou complexe ?',
    subtitle: 'Une seule réponse possible',
    options: [
      {
        value: 1,
        secondary_value: 2,
        value_type: 'multiplicative_page',
        label: 'Design simple (templates)',
      },
      {
        value: 2,
        secondary_value: 3.5,
        value_type: 'multiplicative_page',
        label: 'Design complexe (personnalisé)',
      },
    ],
  },
  {
    id: 'pages',
    type: 'slider',
    title: 'Combien de pages souhaitez-vous ?',
    subtitle: 'Utilisez le curseur pour sélectionner le nombre de pages',
    options: [{ value: 1, min: 1, max: 20, label: 'page', slides_type: 'pages' }],
  },
  {
    id: 'economical-model',
    type: 'select',
    title: 'Quel est votre modèle économique ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Freemium' },
      { value: 0, label: 'Abonnement' },
      { value: 2, pass_next_step: true, label: 'Publicités' },
      { value: 0, pass_next_step: true, label: 'Aucun' },
    ],
  },
  {
    id: 'payment-methods',
    type: 'slider',
    title: 'Combien de méthodes de paiement souhaitez-vous ?',
    subtitle: 'Utilisez le curseur pour sélectionner le nombre de méthodes de paiement',
    options: [
      { value: 1, min: 1, max: 5, multiplier: 3, label: 'méthode', slides_type: 'methods' },
    ],
  },
  {
    id: 'functionalities',
    type: 'multi-select',
    title: 'Quelles fonctionnalités principales souhaitez-vous ?',
    subtitle: 'Plusieurs réponses possibles',
    options: [
      { value: 3, value_type: 'additive', label: 'Authentification' },
      { value: 2, value_type: 'additive', label: 'Profil utilisateur' },
      { value: 8, value_type: 'additive', label: 'Messagerie' },
      { value: 4, value_type: 'additive', label: 'Génération de documents' },
      { value: 3, value_type: 'additive', label: 'Géolocalisation' },
      { value: 3, value_type: 'additive', label: 'Notifications' },
      { value: 2, value_type: 'additive', label: 'Vérification SMS' },
      { value: 3, value_type: 'additive', label: 'Galerie de médias' },
      { value: 7, value_type: 'additive', label: 'Panel administrateur' },
      { value: 9, value_type: 'additive', label: 'Lives/Discussion vidéo' },
      { value: 6, value_type: 'additive', label: 'Commentaires' },
      { value: 3, value_type: 'additive', label: 'Analytics' },
      { value: 4, value_type: 'additive', label: 'Multi-langue' },
      { value: 3, value_type: 'additive', label: 'E-Mailing' },
      { value: 6, value_type: 'additive', label: 'CMS' },
      { value: 4, value_type: 'additive', label: 'Real Time Communication' },
      { value: 8, value_type: 'additive', label: 'Calendrier' },
    ],
  },
  {
    id: 'api-number',
    type: 'slider',
    title: "Combien d'API tierces souhaitez-vous ?",
    subtitle: "Utilisez le curseur pour sélectionner le nombre d'API tierces",
    options: [{ value: 0, min: 0, max: 5, label: 'API', multiplier: 3, slides_type: 'APIs' }],
  },
  {
    id: 'roles',
    type: 'select',
    title: 'Combien de rôles souhaitez-vous (Administrateur, Modérateur, etc.) ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: '1' },
      { value: 0.1, value_type: 'multiplicative', label: '2' },
      { value: 0.2, value_type: 'multiplicative', label: '3+' },
    ],
  },
  {
    id: 'seo',
    type: 'select',
    title: 'Souhaitez-vous optimiser votre site pour le SEO (référencement) ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Non' },
      { value: 0, label: 'Oui, basique' },
      { value: 0, label: 'Oui, complet' },
    ],
  },
  {
    id: 'project-maturity',
    type: 'select',
    title: 'Maturité du projet ?',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: "Je me renseigne, j'ai deja d'autres devis" },
      { value: 0, label: 'Projet réfléchi, mais aucun devis' },
      { value: 0, label: 'Je me renseigne par curiosité' },
    ],
  },
  {
    id: 'user-type',
    type: 'select',
    title: 'Je fais cette demande en tant que...',
    subtitle: 'Une seule réponse possible',
    options: [
      { value: 0, label: 'Particulier' },
      { value: 0, label: 'Association' },
      { value: 0, label: 'Administration' },
      { value: 0, label: 'Entreprise' },
      { value: 0, label: 'Autre' },
    ],
  },
];
