"use client";

import { usePathname } from "next/navigation";

import { TemplateTypeEnum } from "@/lib/model/Template";

export interface PublicSlotFilterProps {
  defaultChildren: React.ReactNode;
  publicChildren: React.ReactNode;
}

const templateTypeList = Object.values(TemplateTypeEnum).join("|");

const PUBLIC_VALIDATION = [
  new RegExp(`^/startup/[\\w-]*/(${templateTypeList})$`),
  new RegExp(`^/startup/[\\w-]*/[\\w-]*/(${templateTypeList})$`),
];

export const PublicSlotFilter = ({ defaultChildren, publicChildren }: PublicSlotFilterProps) => {
  const pathname = usePathname();
  return PUBLIC_VALIDATION.some(regex => regex.test(pathname)) ? publicChildren : defaultChildren;
};
