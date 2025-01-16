import { config } from "@/config";

export const Brand = () => (
  <>{config.brand.ministry.split("\n").map((item, index) => (index === 0 ? item : [<br key={index} />, item]))}</>
);
