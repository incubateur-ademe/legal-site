#!/bin/bash

# Vérifie et rafraîchit le cache GPG
if [ -n "$TEMPLATES_GIT_GPG_PASSPHRASE" ]; then
  echo "$TEMPLATES_GIT_GPG_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --sign <<< "refresh-cache" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "$(date): GPG cache refreshed successfully for 32 hours."
  else
    echo "$(date): Failed to refresh GPG cache." >&2
    exit 1
  fi
else
  echo "$(date): No TEMPLATES_GIT_GPG_PASSPHRASE provided. Skipping refresh." >&2
  exit 1
fi
