import type { Metadata } from "next";
import { SceneTransitionProvider } from "./components/scene-transition";
import SiteAmbience from "./components/site-ambience";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alces Casino"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <SceneTransitionProvider>
          {children}
          <SiteAmbience />
        </SceneTransitionProvider>
      </body>
    </html>
  );
}
