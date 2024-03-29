
import "@/styles/globals.css"
import type { Metadata } from "next";

import { ThemeProvider } from "@/lib/theme-provider";

import { GeistSans } from "geist/font";
import { Toaster } from "@/components/ui/toaster";

const title = "LuciaAuth - Next.js Authentication Example";
const description =
  "A Next.js authentication example with email and password, Google, and GitHub providers. "

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@asmraihan",
  },
  // metadataBase: new URL("https://code-blocks.vercel.app/"),
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      {/* <AuthProvider> */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
          {/* div wrapping the footer so that its at bottom of page */}
         
          <Toaster   />
        </ThemeProvider>
      </body>
      {/* </AuthProvider> */}
    </html>
  );
}