import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { ESPACE_MEMBRE_PROVIDER_ID } from "@incubateur-ademe/next-auth-espace-membre-provider";
import { EspaceMembreClientMemberNotFoundError } from "@incubateur-ademe/next-auth-espace-membre-provider/EspaceMembreClient";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { FormFieldset } from "@/dsfr";
import { signIn } from "@/lib/next-auth/auth";

export const LoginForm = () => {
  return (
    <form
      action={async data => {
        "use server";

        try {
          await signIn(ESPACE_MEMBRE_PROVIDER_ID, {
            email: data.get("username"),
            redirectTo: "/",
          });
        } catch (error) {
          if (error instanceof AuthError) {
            if (error.cause?.err instanceof EspaceMembreClientMemberNotFoundError)
              redirect("/login/error?error=AccessDenied");
            redirect(`/login/error?error=${error.type}`);
          }
          redirect("/error");
        }
      }}
    >
      <FormFieldset
        legend={<h2>Se connecter avec son nom d'utilisateur beta gouv</h2>}
        elements={[
          <Input
            key="username"
            label="Identifiant"
            nativeInputProps={{
              type: "text",
              required: true,
              name: "username",
            }}
          />,
          <FormFieldset
            key="submit"
            legend={null}
            elements={[
              <ButtonsGroup
                key="buttons-group"
                buttons={[
                  {
                    children: "Se connecter",
                    type: "submit",
                  },
                ]}
              />,
            ]}
          />,
        ]}
      />
    </form>
  );
};
