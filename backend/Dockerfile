# ==============================================================
# DOCKERFILE — Backend Node.js/Express (Construction multi-étapes)
# ==============================================================
# Étape 1 : Construction — Installation des dépendances
# Étape 2 : Production — Image légère avec uniquement le nécessaire
# ==============================================================

# --- Étape 1 : Construction ---
FROM node:20-alpine AS construction

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier (optimisation du cache Docker)
COPY package*.json ./

# Installation de TOUTES les dépendances (y compris devDependencies pour la construction)
RUN npm install

# Copie du code source de l'application
COPY . .

# --- Étape 2 : Production ---
FROM node:20-alpine AS production

# Variable d'environnement pour le mode production
ENV NODE_ENV=production

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -S appgroupe && adduser -S apputil -G appgroupe

# Répertoire de travail
WORKDIR /app

# Copie uniquement des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm install --omit=dev && npm cache clean --force

# Copie du code source depuis l'étape de construction
COPY --from=construction /app/src ./src

# Changement vers l'utilisateur non-root
USER apputil

# Port exposé par le serveur Express
EXPOSE 3001

# Vérification de santé — vérifie que l'API répond
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/sante || exit 1

# Commande de démarrage du serveur
CMD ["node", "src/app.js"]
