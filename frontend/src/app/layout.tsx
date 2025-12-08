import "./globals.css";

import { Providers } from "./providers";

export const metadata = {
  title: "DASHBOARD 📊",
  description: "Dashboard for Metrics Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className="bg-background text-foreground h-full"
        suppressHydrationWarning
      >
        <main className="container mx-auto min-h-screen lg:h-screen flex flex-col py-6">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
