import { type AnyFunction } from "@/utils/types";

import { type Service } from "./types";

const instances: Record<string, Service> = {};

export const getInstanceFn =
  <R extends Record<string, { new (): Service }>>(classes: R, blocker?: AnyFunction) =>
  async <const T extends keyof R>(key: T): Promise<InstanceType<R[T]>> => {
    await blocker?.();
    if (!instances[key as string]) {
      const Class = classes[key];
      const instance = new Class();
      await instance.init();
      instances[key as string] = instance;
    }
    return instances[key as string] as InstanceType<R[T]>;
  };
