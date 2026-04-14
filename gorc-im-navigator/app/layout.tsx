import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppContext } from "@/components/AppContext";
import { LocalStorageSettings } from "@/components/LocalStorageSettings";
import { JSONConfigProvider } from "@/components/JSONConfigProvider";


export const metadata: Metadata = {
  title: "GORC IM Viewer",
  description: "GORC International Model Viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_API_URL || "";
  return (
    <html lang="en">
      <body>
        <LocalStorageSettings id="gorc-im-navigator">
          <JSONConfigProvider src={`${basePath}/config.json`}>
            <AppContext>{children}</AppContext>
          </JSONConfigProvider>
        </LocalStorageSettings>
      </body>
    </html>
  );
}
