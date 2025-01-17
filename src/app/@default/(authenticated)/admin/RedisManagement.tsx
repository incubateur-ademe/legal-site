"use client";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";

import { FormFieldset } from "@/dsfr";

import { clearRedis, getRedisContent } from "./actions";

export const RedisManagement = () => {
  const [redisResult, setRedisResult] = useState<string>("");
  return (
    <FormFieldset
      legend="Redis management"
      elements={[
        <ButtonsGroup
          key={`redis-buttons`}
          inlineLayoutWhen="sm and up"
          buttonsEquisized
          buttons={[
            {
              children: "FLUSH ALL",
              onClick: () => {
                try {
                  void clearRedis().then(setRedisResult);
                } catch (error) {
                  setRedisResult((error as Error).message);
                }
              },
            },
            {
              children: "GETALL",
              onClick: () => {
                try {
                  void getRedisContent().then(setRedisResult);
                } catch (error) {
                  setRedisResult((error as Error).message);
                }
              },
            },
          ]}
        />,
        <Input
          label="Redis result"
          key={`redis-result`}
          textArea
          disabled
          nativeTextAreaProps={{
            value: redisResult,
          }}
        />,
      ]}
    />
  );
};
