import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Roblox Boosting", description: "Roblox service order management" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
