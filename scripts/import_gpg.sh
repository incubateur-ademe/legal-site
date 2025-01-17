#!/bin/bash

# Vérifier si les clés publiques et privées sont définies
if [ -z "$TEMPLATES_GIT_GPG_PRIVATE_KEY_BASE64" ] || [ -z "$TEMPLATES_GIT_GPG_PUBLIC_KEY_BASE64" ]; then
  echo "Clés GPG non définies. Signature des commits désactivée."
  exit 0
fi

echo "Les clés GPG sont présentes dans les variables d'environnement. Importation en cours..."

# Importer la clé privée
echo "$TEMPLATES_GIT_GPG_PRIVATE_KEY_BASE64" | base64 --decode | gpg --batch --import
if [ $? -ne 0 ]; then
  echo "Erreur : Échec de l'importation de la clé privée."
  exit 1
fi

# Importer la clé publique
echo "$TEMPLATES_GIT_GPG_PUBLIC_KEY_BASE64" | base64 --decode | gpg --batch --import
if [ $? -ne 0 ]; then
  echo "Erreur : Échec de l'importation de la clé publique."
  exit 1
fi

echo "Clés GPG importées avec succès."

# Configurer gpg-agent pour le mode non interactif
echo "allow-loopback-pinentry" >> ~/.gnupg/gpg-agent.conf
echo "default-cache-ttl 115200 " >> ~/.gnupg/gpg-agent.conf # 32 heures (en secondes)
echo "max-cache-ttl 115200" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent

# Injecter la passphrase dans le cache si nécessaire
if [ -n "$TEMPLATES_GIT_GPG_PASSPHRASE" ]; then
  echo "$TEMPLATES_GIT_GPG_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --sign <<< "refresh-cache"
  if [ $? -eq 0 ]; then
    echo "Passphrase injectée avec succès dans le cache."
  else
    echo "Erreur : Échec de l'injection de la passphrase dans le cache."
    exit 1
  fi
fi

# Configurer Git pour utiliser la clé GPG
git config --global user.signingkey "$(gpg --list-secret-keys --keyid-format LONG | grep sec | awk '{print $2}' | cut -d'/' -f2)"
git config --global commit.gpgSign true
git config --global gpg.program gpg

echo "Configuration GPG terminée."
