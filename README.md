# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Patrimoine public

  Prototype d'une application web de gestion du patrimoine public. L'interface rassemble les principaux parcours de suivi des biens de l'État: inventaire, localisation, affectations, maintenance, réformes et fonctions de gestion associées.

  ## Fonctionnalités et modules

  - **Connexion de démonstration** : choix d'un profil et d'un rôle prédéfinis, sans mot de passe.
  - **Tableau de bord** : indicateurs patrimoniaux, tendances, alertes et activités récentes.
  - **Registre du patrimoine** : consultation et recherche de biens, ajout d'un actif et accès à sa fiche détaillée.
  - **Cartographie** : vue géographique du patrimoine, localisation d'un bien immobilier et consultation des appartements d'un immeuble.
  - **Inventaire** : suivi des campagnes et des vérifications réalisées sur les différents sites.
  - **Mouvements** : traçabilité des affectations, transferts et changements de localisation.
  - **Maintenance** : suivi des demandes d'intervention par actif, priorité et statut.
  - **Réforme / sortie** : consultation et suivi des biens proposés à la réforme, au recyclage ou à la destruction.
  - **Rapports** : synthèse et visualisation de données patrimoniales.
  - **Ressources humaines** : répertoire de démonstration des collaborateurs.
  - **Intra** : actualités, annonces, documents et ressources internes.
  - **Accès et absences** : registre des entrées, sorties et absences.
  - **Achats** : demandes et commandes, avec leur fournisseur, leur montant et leur statut.
  - **Stocks** : consultation des articles, des seuils et des quantités; simulation d'entrées et de sorties.
  - **Finance et comptabilité** : aperçu de démonstration des budgets, dépenses et engagements.
  - **Fournisseurs** : répertoire des entreprises et de leurs informations de suivi.
  - **Paramètres** : aperçu de référentiels et de paramètres de gestion.

  Les modules transverses proposent, selon le cas, la recherche, le filtrage, l'ajout de lignes et l'export CSV. Les données créées ou ajustées dans le prototype ne sont conservées que dans l'état courant de l'application.

  ## Technologies et approche UX/UI

  - **React 19** et **TypeScript** : construction des écrans en composants et typage des données.
  - **Vite** : serveur de développement avec rechargement à chaud et génération du build.
  - **Tailwind CSS 4** : styles utilitaires et adaptation de l'interface aux différentes tailles d'écran.
  - **Base UI**, composants inspirés de **shadcn/ui** et **class-variance-authority** : éléments d'interface et variantes de composants.
  - **Lucide React** : icônes.
  - **Leaflet** et **React Leaflet** : composants de cartographie.
  - **Geist Variable** : typographie de l'interface.
  - **ESLint** : vérification statique du code.

  Côté UX/UI, l'application est organisée autour d'une navigation latérale par domaines, d'un en-tête avec recherche et profil, et de pages de gestion conçues pour parcourir des tableaux et des indicateurs. La navigation latérale s'adapte aux petits écrans. Il s'agit d'une interface de démonstration, pas d'un système de gestion prêt pour la production.

  ## Prérequis

  - Node.js et npm installés.
  - Une connexion Internet est nécessaire pour récupérer les dépendances à la première installation.

  ## Installation et démarrage

  Depuis le dossier du projet, exécuter :

  ```bash
  npm install
  npm run dev
  ```

  Vite affiche l'adresse locale dans le terminal, généralement `http://localhost:5173`. Ouvrir cette adresse dans un navigateur, puis choisir l'un des profils proposés sur l'écran de connexion.

  ## Commandes disponibles

  ```bash
  npm run dev      # Démarrer le serveur de développement
  npm run build    # Vérifier les types et construire l'application
  npm run lint     # Lancer ESLint
  npm run preview  # Prévisualiser le build de production
  ```

  ## Organisation du code

  - `src/App.tsx` : état principal, navigation entre les écrans et transmission des données.
  - `src/components/layout/` : structure générale de l'application, en-tête et navigation latérale.
  - `src/components/ui/` : composants d'interface réutilisables.
  - `src/pages/` : pages de connexion, tableau de bord et modules métier.
  - `src/data/mockData.ts` : profils utilisateurs et jeux de données de démonstration.
  - `src/types.ts` : types TypeScript partagés, notamment ceux des actifs et des demandes.
  - `src/lib/` : fonctions utilitaires partagées, dont l'export CSV.
  - `src/index.css` et `src/App.css` : styles globaux et styles de l'application.
  - `public/` : ressources statiques servies directement par Vite.

  ## Limites du prototype

  Les profils de connexion sont simulés: il n'y a ni authentification réelle ni gestion des droits côté serveur. Les données sont définies localement dans `src/data/mockData.ts`; aucun backend ni base de données n'est configuré dans le projet. Les ajouts et changements d'état servent à la démonstration et ne constituent pas une sauvegarde durable. Le module Finance est explicitement une vue de démonstration et ne remplace pas un système comptable réglementaire.
# application-web-de-gestion
