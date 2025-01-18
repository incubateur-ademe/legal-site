#!/bin/bash

TEMPLATE_GIT_GPG_SIGNINKEY="$(gpg --list-secret-keys --keyid-format LONG | grep sec | awk '{print $2}' | cut -d'/' -f2)"
# Vérifie et rafraîchit le cache GPG
if [ -n "$TEMPLATES_GIT_GPG_PASSPHRASE" ]; then
  gpg --batch --yes --pinentry-mode loopback --default-key "$TEMPLATE_GIT_GPG_SIGNINKEY" --passphrase "$TEMPLATES_GIT_GPG_PASSPHRASE" --sign <<< "refresh-cache" > /dev/null 2>&1
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
