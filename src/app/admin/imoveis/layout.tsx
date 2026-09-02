import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getCurrentUserEmail } from "@/lib/admin/queries";
import { emailToUsername } from "@/lib/admin/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminImoveisLayout({ children }: { children: ReactNode }) {
  const userEmail = await getCurrentUserEmail();
  const username = userEmail ? emailToUsername(userEmail) : null;

  return (
    <div className="flex-1 flex flex-col bg-bg-sunken">
      <AdminHeader username={username} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
