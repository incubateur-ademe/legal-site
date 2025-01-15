import { redirect, RedirectType } from "next/navigation";
import { type PropsWithChildren } from "react";

import { auth } from "@/lib/next-auth/auth";

const LoginLayout = async ({ children }: PropsWithChildren) => {
  const session = await auth();

  if (session?.user) {
    redirect("/", RedirectType.replace);
  }

  return <>{children}</>;
};

export default LoginLayout;
