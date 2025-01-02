import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

import { auth } from "@/lib/next-auth/auth";

const AuthenticatedLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return children;
};

export default AuthenticatedLayout;
