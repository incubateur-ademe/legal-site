import { mdxFetcher } from "@/lib/mdx/fetcher";

const templateVarMap = {
  nom_produit: "Legal.Beta",
  nom_editeur: "DINUM Beta Gouv",
  adresse_editeur: "20 avenue de Ségur, 75007 Paris",
  telephone_editeur: "01 42 75 80 00",
  email_editeur: "dinum@beta.gouv.fr",
  directeur_publication: "M. le directeur de la DINUM",
  nom_hebergeur: "Scalingo",
  adresse_herbergeur: "18 rue de la Ville l'Évêque, 75008 Paris",
};

const Template = async () => {
  const [metadata, templateContent] = await mdxFetcher(
    "https://raw.githubusercontent.com/incubateur-ademe/legal-site-templates-test/refs/heads/main/mentions-legales.md",
    templateVarMap,
  );
  return (
    <>
      <code>{JSON.stringify({ metadata })}</code>
      {templateContent}
    </>
  );
};

export default Template;
