"use client";
import React from "react";
import googleLogo from "../../assets/google-logo.png";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Nav = () => {
  const { status, data: session } = useSession();
  return (
    <header className=" bg-gray-50 py-4 shadow flex flex-wrap w-full justify-center gap-10 md:justify-evenly md:gap-0">
      <h1 className=" text-3xl font-bold self-center">NeonThougths</h1>

      <button className=" border border-gray-500 cursor-pointer bg-white flex flex-row px-4 py-2 gap-2 rounded-[50px]">
        <Image
          className=" self-center"
          src={googleLogo}
          width={35}
          height={35}
          alt="Google Logo"
        />
        <span className=" self-center">Sign in with Google</span>
      </button>
    </header>
  );
};

export default Nav;
