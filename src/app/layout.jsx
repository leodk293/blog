import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import { NextAuthProvider } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <Nav />
          <div className=" mt-10 px-2 max-w-7xl mx-auto md:px-0">{children}</div>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
