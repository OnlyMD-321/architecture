# ==============================================================
# DOCKERFILE — Frontend React (Construction multi-étapes)
# ==============================================================
# Étape 1 : Construction — Compilation de l'application React
# Étape 2 : Production — Serveur Nginx pour fichiers statiques
# ==============================================================

# --- Étape 1 : Construction de l'application React ---
FROM node:20-alpine AS construction

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances (optimisation du cache)
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Variable d'environnement pour l'URL de l'API backend
# En production, les requêtes passent par le proxy Nginx
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Construction de l'application React optimisée pour la production
RUN npm run build

# --- Étape 2 : Serveur Nginx pour les fichiers statiques ---
FROM nginx:1.27-alpine AS production

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers construits depuis l'étape précédente
COPY --from=construction /app/build /usr/share/nginx/html

# Port exposé par Nginx
EXPOSE 80

# Vérification de santé — vérifie que Nginx sert les fichiers
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Commande de démarrage de Nginx au premier plan
CMD ["nginx", "-g", "daemon off;"]
