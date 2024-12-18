- passkey / webauthn https://github.com/nextauthjs/next-auth-webauthn/blob/main/components/login.tsx
- refresh token https://github.com/nextauthjs/next-auth-refresh-token-example
- 


## Produit
- [ ] https://legal.beta.gouv.fr/startup/carte-verte/politique-confidentialite
- [ ] https://legal.beta.gouv.fr/startup/carte-verte/politique-confidentialite.(txt|md|html)
- [ ] github en backend pour profiter du versionning
### Login
- [ ] checker les comptes inactifs

## Think tank
- github sha as id pour les templates (/template/mentions-legales/[groupId]/[id]/edit ; ex: "/template/mentions-legales/default/a34bcde/edit" ou "/template/mentions-legales/ademe/ef828ab9/create (ou generate)" pour créer un fichier à partir d'un template)
- tout le monde peut créer ou dupliquer un template, mais une fois créé le groupe appartient au créateur et les personnes accordées (droit par personne, par se, ou par incubateur, avec TTL)
- par défaut, uniquement les admins peuvent editer le groupe "default"
- liste des versions = histo git d'un fichier
- stockage des mappings de variables sur git aussi avec un chemin "/var/[se]/[produit?]/mention-legales/[groupId]-[id].json", contenant
```typescript
type VarFile = Array<{
  date: Date,
  by: string, // person who has edited
  mapping: Record<string, string>,
}>;
```
- anticiper le fait d'avoir plusieurs mentions legales si plusieurs produit (d'ou le "[produit?]"), sinon root par défaut 
