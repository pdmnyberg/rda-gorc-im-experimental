import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppContext } from "@/components/AppContext";
import { JSONConfigProvider } from "@/components/JSONConfigProvider";
import { UrlSettings } from "@/components/UrlSettings";
import { Panels } from "@/components/Panels";


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
        <UrlSettings>
          <JSONConfigProvider src={`${basePath}/config.json`}>
            <AppContext>
              <main>
                <div className="tree-container d-flex flex-column align-self-stretch">
                  <Panels />
                  {children}
                </div>
              </main>
            </AppContext>
          </JSONConfigProvider>
        </UrlSettings>
      </body>
    </html>
  );
}
