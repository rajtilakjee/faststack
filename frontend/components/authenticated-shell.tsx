import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUserServer } from "@/lib/auth-server";

type AuthenticatedShellProps = {
  children: React.ReactNode;
};

export async function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  const user = await getCurrentUserServer();

  return (
    <AuthProvider initialUser={user}>
      <SiteHeader />
      {children}
    </AuthProvider>
  );
}
