- passkey / webauthn https://github.com/nextauthjs/next-auth-webauthn/blob/main/components/login.tsx
- refresh token https://github.com/nextauthjs/next-auth-refresh-token-example
- route /api/stats
- page /stats (nombre de pages générées, nombre de templates, nombre de startups, nombre de variables, nombre de versions, nombre de startups "completes" => Northstar)
- page /budget (?)
- page /roadmap


## Produit
- [ ] https://legal.beta.gouv.fr/startup/carte-verte/politique-confidentialite
- [ ] https://legal.beta.gouv.fr/startup/carte-verte/politique-confidentialite.(txt|md|html)
- [ ] https://legal.beta.gouv.fr/startup/territoires-en-transitions/aldo/politique-confidentialite.(txt|md|html) (en cas de produit supplémentaire)
- [x] github en backend pour profiter du versionning
### Login
- [x] checker les comptes inactifs

### Editeur
- [ ] hover et auto completion sur les variables
- [x] preview
- [ ] lock avec TTL sur l'édition si une autre personne est en train d'éditer

## Think tank
- github sha as id pour les templates (/template/mentions-legales/[groupId]/[id]/edit ; ex: "/template/mentions-legales/default/a34bcde/edit" ou "/template/mentions-legales/ademe/ef828ab9/generate" pour créer un fichier à partir d'un template) - warning si la version (le sha) n'est pas la dernière
- tout le monde peut créer ou dupliquer un template, mais une fois créé le groupe appartient au créateur et les personnes accordées (droit par personne, par se, ou par incubateur, avec TTL)
- les variables d'un template sont enregistrées dans le frontmatter du fichier markdown
- par défaut, uniquement les admins peuvent editer le groupe "default"
- liste des versions = histo git d'un fichier
- stockage des mappings de variables sur git aussi avec un chemin "/var/[se]/[produit?]/mention-legales/[groupId]-[id].json", contenant
- possibilité de recover un fichier supprimé (si fonction de suppression)
- possibilité de rollback à une version précédente (ajout d'une version rollback comme nouvelle version)
- anticiper le fait d'avoir plusieurs mentions legales si plusieurs produit (d'ou le "[produit?]"), sinon root par défaut 

## Navigation
|- Accueil
|- Templates
|- Liste Startups (avec leurs pages)

### Accueil `/`
- [ ] Présentation
- [ ] Comment ça marche
- [ ] Contact
- Si connecté
  - [ ] Ajouter une nouvelle page légale

### Templates `/template`
- [ ] Liste des templates
- [ ] Bouton global pour créer un nouveau template
- [ ] Recherche par nom
- [ ] Filtre par type (mentions légales, politique de confidentialité, etc)
- [ ] Bouton pour dupliquer un template

#### Template
- [ ] Nom
- [ ] Description
- [ ] Type
- [ ] Variables
- [ ] Version
- [ ] Bouton pour dupliquer `/template/mentions-legales/[groupId]/[id]/duplicate`
**Lecture seule**  `/template/mentions-legales/[groupId]/[id]`
- [ ] Bouton pour éditer
- [ ] Bouton pour créer une page à partir de ce template (`/template/mentions-legales/[groupId]/[id]/generate`)
- [ ] Bouton pour voir les versions
**Versions** `/template/mentions-legales/[groupId]/[id]/versions`
- [ ] Liste des versions
- [ ] Sélectionner deux versions pour comparer
**Edition** `/template/mentions-legales/[groupId]/[id]/edit`
- [ ] Bouton pour sauvegarder
- [ ] Bouton pour annuler
- [ ] Editeur / preview

### Liste Startups `/startup`
- [ ] Liste des startups
- [ ] Recherche par nom
- [ ] Filtre par type (qui a mentions légales, politique de confidentialité, etc)
- [ ] Bouton pour ajouter une page légale à une startup `/startup/[id]/new`



