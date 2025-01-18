#!/bin/bash

if [ -n "$TEMPLATES_GIT_GPG_PASSPHRASE" ]; then
    # URL de l'API et clé API
    API_URL="$NEXT_PUBLIC_SITE_URL/api/webhook/gpg/refresh"
    API_KEY="$SECURITY_WEBHOOK_SECRET"

    # Exécuter la requête avec curl
    response=$(curl -s -X GET "$API_URL" -H "x-api-key: $API_KEY")

    # Vérifier si la requête a réussi
    if echo "$response" | grep -q '"ok":true'; then
    echo "Succès : $(echo "$response" | jq -r '.message')"
    else
    echo "Erreur : $(echo "$response" | jq -r '.error')"
    fi
else
  echo "$(date): No TEMPLATES_GIT_GPG_PASSPHRASE provided. Skipping refresh." >&2
  exit 1
fi
