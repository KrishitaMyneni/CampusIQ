import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Toaster } from "react-hot-toast";
import LogoutButton from "@/components/LogoutButton";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <nav className="mx-auto flex w-full items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:px-5">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 hover:text-slate-900">
                🎓 CampusIQ
              </Link>

              <div className="flex items-center gap-2 text-sm sm:gap-3">
                <Link href="/recommend" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                  Recommendations
                </Link>
                <Link href="/discussions" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                  Discussions
                </Link>

                {session ? (
                  <>
                    <Link href="/saved" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                      Saved
                    </Link>
                    <Link href="/profile" className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900">
                      Profile
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <Link href="/login" className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-900">
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </header>

          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}