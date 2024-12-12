import { Children, isValidElement, type PropsWithChildren, type ReactNode, useEffect, useRef } from "react";

/**
 * Retrieves the label from the children of a React component.
 */
export const getLabelFromChildren = (children: ReactNode) => {
  let label = "";

  Children.map(children, child => {
    if (typeof child === "string") {
      label += child;
    } else if (isValidElement<PropsWithChildren>(child) && child.props.children) {
      label += getLabelFromChildren(child.props.children);
    }
  });

  return label;
};

/**
 * Custom version of useEffect that only runs once in development mode with React strict mode.
 */
export const useEffectOnce: typeof useEffect =
  process.env.NODE_ENV === "development"
    ? (effect, deps?) => {
        // create a useeffect that only runs once event in dev with react strict mode
        const hasRunRef = useRef(false);
        useEffect(() => {
          let cleanup: (() => void) | void;
          if (!hasRunRef.current) {
            cleanup = effect();
            hasRunRef.current = true;
          }

          return () => {
            if (cleanup) {
              cleanup();
            }
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [effect, ...(deps ?? [])]);
      }
    : useEffect;
