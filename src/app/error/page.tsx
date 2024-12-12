import { systemCodes, SystemMessageDisplay } from "../SystemMessageDisplay";

interface ErrorPageProps {
  searchParams: Promise<{
    source?: `login-${"AccessDenied" | "AuthorizedCallbackError"}`;
  }>;
}

const Error = async ({ searchParams }: ErrorPageProps) => {
  const { source } = await searchParams;
  return <SystemMessageDisplay code={source && source in systemCodes ? source : "500"} />;
};

export default Error;
