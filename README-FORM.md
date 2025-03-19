# Formulaire de Contact - Documentation

Ce document explique comment configurer et utiliser le système de gestion des formulaires de contact pour le site web Hexium.

## Fonctionnalités

- Envoi de formulaires de contact avec différents sujets (Projet, Emploi, Collaboration, Autre)
- Envoi d'emails avec des destinataires et sujets différents selon le type de formulaire
- Téléchargement de fichiers sur AWS S3
- Création de prospects dans SellSy pour les contacts de type "Projet"

## Configuration

### 1. Variables d'environnement

Ajoutez les variables d'environnement suivantes dans votre fichier `.env` :

```
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=votre_access_key_id
AWS_SECRET_ACCESS_KEY=votre_secret_access_key
AWS_REGION=votre_region
S3_BUCKET_NAME=votre_bucket_name

# Email Configuration
EMAIL_HOST=votre_host_smtp
EMAIL_PORT=votre_port_smtp
EMAIL_USER=votre_utilisateur_smtp
EMAIL_PASS=votre_mot_de_passe_smtp
EMAIL_FROM=votre_email_expediteur

# SellSy API Configuration
SELLSY_CONSUMER_TOKEN=votre_consumer_token
SELLSY_CONSUMER_SECRET=votre_consumer_secret
SELLSY_USER_TOKEN=votre_user_token
SELLSY_USER_SECRET=votre_user_secret
```

### 2. Dépendances

Assurez-vous d'avoir installé les dépendances nécessaires :

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner nodemailer
```

## Fonctionnement

### Formulaire de contact

Le formulaire de contact se trouve dans le fichier `src/pages/contact.astro`. Il contient les champs suivants :

- Sujet (Projet, Emploi, Collaboration, Autre)
- Prénom
- Nom
- Email
- Téléphone (optionnel)
- Entreprise (optionnel, affiché uniquement pour les sujets Projet, Collaboration et Autre)
- Message
- Documents (optionnel)
- Accord de confidentialité

### Traitement du formulaire

Le traitement du formulaire est géré par l'API endpoint `src/pages/api/contact.ts`. Voici ce qui se passe lorsqu'un formulaire est soumis :

1. Les données du formulaire sont validées
2. Les fichiers sont téléchargés sur AWS S3
3. Si le sujet est "Projet", un nouveau prospect est créé dans SellSy
4. Un email est envoyé avec les informations du formulaire et les liens vers les fichiers téléchargés

### Configuration des emails

Les emails sont configurés dans le fichier `src/utils/email.ts`. Voici la configuration actuelle :

- Projet - anthony@hexium.io - [PROJET]
- Emploi - contact@hexium.io - [EMPLOI]
- Collaboration - contact@hexium.io - [COLLAB]
- Autre - contact@hexium.io - [AUTRE]

## Personnalisation

### Modifier les destinataires des emails

Pour modifier les destinataires des emails, modifiez le fichier `src/utils/email.ts` :

```typescript
export const emailConfig = {
  project: {
    to: 'nouveau_email@example.com',
    subject: '[PROJET]',
  },
  // ...
};
```

### Modifier le contenu des emails

Pour modifier le contenu des emails, modifiez la fonction `generateEmailContent` dans le fichier `src/utils/email.ts`.

### Modifier la configuration de SellSy

Pour modifier la configuration de SellSy, modifiez le fichier `src/utils/sellsy.ts`.

## Dépannage

### Les emails ne sont pas envoyés

- Vérifiez que les variables d'environnement EMAIL_* sont correctement configurées
- Vérifiez que le serveur SMTP est accessible
- Vérifiez les logs du serveur pour plus d'informations

### Les fichiers ne sont pas téléchargés sur S3

- Vérifiez que les variables d'environnement AWS_* sont correctement configurées
- Vérifiez que le bucket S3 existe et est accessible
- Vérifiez que les permissions du bucket S3 sont correctement configurées

### Les prospects ne sont pas créés dans SellSy

- Vérifiez que les variables d'environnement SELLSY_* sont correctement configurées
- Vérifiez que l'API SellSy est accessible
- Vérifiez les logs du serveur pour plus d'informations 