"use client";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { ESPACE_MEMBRE_PROVIDER_ID } from "@incubateur-ademe/next-auth-espace-membre-provider";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";

import { Loader } from "@/components/utils/Loader";
import { FormFieldset } from "@/dsfr";

export const LoginForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    await signIn(ESPACE_MEMBRE_PROVIDER_ID, {
      email: usernameRef.current?.value,
      redirectTo: "/",
    });
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setIsLoading(true);
        void onSubmit();
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
              ref: usernameRef,
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
                    children: <Loader loading={isLoading} text="Se connecter" />,
                    type: "submit",
                    disabled: isLoading,
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
