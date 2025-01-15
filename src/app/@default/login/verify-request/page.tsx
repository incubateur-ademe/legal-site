import artworkMailSendSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/mail-send.svg";

import { SystemMessageDisplay } from "@/app/SystemMessageDisplay";
import { config } from "@/config";

const VerifyRequestPage = () => (
  <SystemMessageDisplay
    code="custom"
    title={`Connexion site ${config.name}`}
    headline="Email envoyé !"
    body={
      <>
        <p>
          Un email de vérification a été envoyé à l'adresse principale rattachée à votre compte Espace Membre. Veuillez
          vérifier votre boîte mail et cliquer sur le lien pour valider votre adresse email.
        </p>
        <p>Vérifiez également les spams dans votre antispam Mailinblack ou équivalent.</p>
      </>
    }
    noRedirect
    pictogram={artworkMailSendSvgUrl}
  />
);

export default VerifyRequestPage;
