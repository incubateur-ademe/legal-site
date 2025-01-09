"use client";

import Button from "@codegouvfr/react-dsfr/Button";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { type PropsWithChildren, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { type Any } from "@/utils/types";

import { ClientOnly } from "./ClientOnly";

declare global {
  export interface Window {
    _disableLegalAppDebug(reload?: boolean): void;
    _enableLegalAppDebug(reload?: boolean): void;
  }
}

const DEBUG_KEY = "__legalApp_debug";
if (typeof window !== "undefined" && !window._enableLegalAppDebug) {
  window._disableLegalAppDebug = (reload = true) => {
    localStorage.removeItem(DEBUG_KEY);
    reload && location.reload();
  };
  window._enableLegalAppDebug = (reload = true) => {
    localStorage.setItem(DEBUG_KEY, DEBUG_KEY);
    reload && location.reload();
  };
}

export interface DebugButtonProps {
  alwaysOn?: boolean;
  infoText?: string;
  obj: Any;
}
export const DebugButton = ({ obj, infoText, alwaysOn, children }: PropsWithChildren<DebugButtonProps>) => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);

  useEffect(() => {
    setIsDebugEnabled(alwaysOn ?? localStorage.getItem(DEBUG_KEY) === DEBUG_KEY);
  }, [alwaysOn]);

  return (
    <>
      {isDebugEnabled && (
        <Button
          type="button"
          size="small"
          iconId="ri-bug-2-line"
          onClick={() => {
            console.debug(`[DEBUG]${infoText ? `[${infoText}]` : ""}`, obj);
          }}
          priority="tertiary no outline"
          title={`Debug${infoText ? ` ${infoText}` : ""}`}
          // eslint-disable-next-line react/no-children-prop
          children={children}
        />
      )}
    </>
  );
};

export const DebugToggleSwitch = () => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem(DEBUG_KEY) === DEBUG_KEY,
  );

  const toggleDebug = (checked: boolean) => {
    setIsDebugEnabled(checked);
    checked ? window._enableLegalAppDebug(false) : window._disableLegalAppDebug(false);
    if (localStorage.getItem(DEBUG_KEY) === DEBUG_KEY) {
      console.info("Debug mode enabled");
    } else {
      console.info("Debug mode disabled");
    }
  };
  return (
    <ClientOnly fallback={<Skeleton height="3.5em" width="10em" />}>
      <ToggleSwitch label="LegalApp debug mode" checked={isDebugEnabled} onChange={toggleDebug} />
    </ClientOnly>
  );
};
