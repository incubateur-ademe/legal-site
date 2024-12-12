import artworkMailSendSvgUrl from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/digital/mail-send.svg";
import { type StaticImageData } from "next/image";

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
        <p>Vérifiez également les spams dans votre Mailinblack ou équivalent.</p>
      </>
    }
    noRedirect
    pictogram={artworkMailSendSvgUrl as StaticImageData}
  />
);

export default VerifyRequestPage;
