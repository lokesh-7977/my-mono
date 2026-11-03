import type { Metadata } from "next";
import { Bricolage_Grotesque, Lato } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth/auth-context";
import { getServerSession } from "@/lib/auth/server-session";
import { LoginModal } from "@/components/auth/login-modal";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scoutripper",
  description: "Scoutripper",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
        >
          <AuthProvider
            initialUser={session?.user ?? null}
            initialAccessToken={session?.accessToken ?? null}
          >
            {children}
            <LoginModal />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
