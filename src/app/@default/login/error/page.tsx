import { type ErrorPageParam } from "@auth/core/types";
import { redirect, RedirectType } from "next/navigation";

interface ErrorLoginPageProps {
  searchParams: Promise<{
    error: ErrorPageParam;
  }>;
}

const ErrorLoginPage = async ({ searchParams }: ErrorLoginPageProps) => {
  const { error } = await searchParams;
  redirect(`/error?source=login-${error}`, RedirectType.replace);
};

export default ErrorLoginPage;
