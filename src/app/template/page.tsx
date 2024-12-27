import { mdxFetcher } from "@/lib/mdx/fetcher";
import { TemplateTypeEnum } from "@/lib/repo/IGitRepo";

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
  const { content, frontmatter } = await mdxFetcher(
    "nosgestesclimat",
    "ademe",
    TemplateTypeEnum.MentionsLegales,
    "72c7813",
  );
  return (
    <>
      <code>{JSON.stringify({ frontmatter })}</code>
      {content}
    </>
  );
};

export default Template;
