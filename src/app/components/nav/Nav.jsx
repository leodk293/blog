"use client";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import googleLogo from "../../assets/google-logo.png";
import Image from "next/image";
import { LogOut, PenSquare, Loader2 } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

const Nav = () => {
  const { status, data: session } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`py-5 sticky top-0 z-10 border-b border-b-transparent transition-all duration-500 ${
        isScrolled ? "bg-white shadow-sm border-b-gray-100" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="">
            <h1 className=" text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              NeonThoughts
            </h1>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {status === "loading" ? (
              <div className="flex items-center gap-2 py-2 px-4 rounded-full bg-gray-100 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Loading</span>
              </div>
            ) : status === "unauthenticated" ? (
              <button
                onClick={() => signIn("google")}
                className="flex items-center cursor-pointer gap-2 py-2 px-4 rounded-full border border-gray-200 hover:border-gray-300 bg-white shadow-sm transition-all duration-200 hover:shadow"
                aria-label="Sign in with Google"
              >
                <Image
                  src={googleLogo}
                  width={24}
                  height={24}
                  alt="Google Logo"
                  className="w-6 h-6"
                />
                <span className="font-medium text-gray-800">
                  Sign in with Google
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 py-1.5 pl-2 pr-4 rounded-full border border-gray-200 bg-gray-50">
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-white"
                  />
                  <span className="font-medium text-gray-800 hidden sm:inline">
                    {session?.user?.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center cursor-pointer gap-2 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium hidden sm:inline">Sign out</span>
                </button>
              </div>
            )}

            <Link href="/create-post">
              <button className="flex items-center cursor-pointer gap-2 py-2 px-4 md:px-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                <PenSquare className="h-5 w-5" />
                <span className="hidden sm:inline">Create post</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
