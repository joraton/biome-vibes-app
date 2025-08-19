# 🔐 Guide de Configuration de l'Authentification Clerk + Convex

## ✅ Étapes Complétées

✅ Installation des dépendances Clerk et Convex  
✅ Configuration du schéma de base de données Convex  
✅ Création des composants d'authentification  
✅ Intégration dans l'application React  
✅ Configuration de base de Convex (déploiement créé)  

## 🚀 Étapes Restantes (À Faire par l'Utilisateur)

### 1. Créer un Compte Clerk

1. Allez sur [https://clerk.com](https://clerk.com)
2. Créez un compte gratuit
3. Créez une nouvelle application
4. Choisissez vos méthodes de connexion (email/mot de passe, Google, etc.)

### 2. Configurer le JWT Template dans Clerk

1. Dans le tableau de bord Clerk, allez dans **JWT Templates**
2. Cliquez sur **New template**
3. Sélectionnez **Convex** dans la liste
4. **IMPORTANT**: Ne renommez PAS le template - il doit rester "convex"
5. Copiez l'**Issuer URL** (format: `https://verb-noun-00.clerk.accounts.dev`)

### 3. Récupérer les Clés API Clerk

1. Dans le tableau de bord Clerk, allez dans **API Keys**
2. Copiez votre **Publishable Key** (commence par `pk_test_`)
3. Copiez votre **Secret Key** (commence par `sk_test_`)

### 4. Configurer les Variables d'Environnement Convex

1. Allez sur [https://dashboard.convex.dev/d/helpful-hippopotamus-665/settings/environment-variables](https://dashboard.convex.dev/d/helpful-hippopotamus-665/settings/environment-variables)
2. Ajoutez la variable `CLERK_JWT_ISSUER_DOMAIN` avec l'Issuer URL de l'étape 2

### 5. Mettre à Jour le Fichier .env.local

Remplacez les valeurs dans `.env.local` :

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_VOTRE_VRAIE_CLE_ICI
CLERK_SECRET_KEY=sk_test_VOTRE_VRAIE_CLE_ICI
CLERK_JWT_ISSUER_DOMAIN=https://VOTRE-DOMAINE.clerk.accounts.dev

# Convex Configuration (déjà configuré)
VITE_CONVEX_URL=https://helpful-hippopotamus-665.convex.cloud
CONVEX_DEPLOYMENT=dev:helpful-hippopotamus-665
```

### 6. Redémarrer le Serveur

Après avoir mis à jour les variables d'environnement :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm run dev
```

## 🎯 Fonctionnalités Implémentées

- ✅ **Authentification complète** avec Clerk
- ✅ **Synchronisation automatique** des utilisateurs avec Convex
- ✅ **Interface utilisateur** avec boutons de connexion/inscription
- ✅ **Schéma de base de données** pour utilisateurs, évaluations et historique
- ✅ **Composants d'authentification** réutilisables
- ✅ **Intégration transparente** avec l'application existante

## 🔧 Fonctionnalités Disponibles Après Configuration

1. **Connexion/Inscription** via modal Clerk
2. **Profil utilisateur** avec avatar et informations
3. **Sauvegarde des évaluations** de biomes
4. **Historique des visites** personnalisé
5. **Synchronisation temps réel** avec Convex
6. **Accès aux données utilisateur** dans toute l'application

## 🐛 Résolution de Problèmes

### Erreur "Invalid publishableKey"
- Vérifiez que vous avez remplacé `pk_test_your_key_here` par votre vraie clé
- Redémarrez le serveur après modification

### Erreur "CLERK_JWT_ISSUER_DOMAIN not set"
- Configurez la variable dans le tableau de bord Convex
- Vérifiez que l'URL correspond exactement à celle de Clerk

### Page blanche ou erreurs de compilation
- Vérifiez que toutes les dépendances sont installées
- Redémarrez le serveur de développement

## 📚 Documentation

- [Documentation Clerk](https://clerk.com/docs)
- [Documentation Convex](https://docs.convex.dev)
- [Guide d'intégration Clerk + Convex](https://docs.convex.dev/auth/clerk)

---

**Une fois ces étapes complétées, votre application aura un système d'authentification complet et fonctionnel !** 🎉