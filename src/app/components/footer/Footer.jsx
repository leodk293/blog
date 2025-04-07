import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className=" py-10 text-white border-t border-t-gray-100 bg-black mt-[100px] flex flex-wrap justify-center gap-10 md:justify-evenly md:gap-0">
      <Link href="/" className="">
        <h1 className=" self-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          NeonThoughts
        </h1>
      </Link>

      <p className=" font-bold self-center">All rights reserved. Copyright NeonThoughts</p>

      <div className=" self-center flex flex-row gap-4">
        <Link href={""}>X/Twitter</Link>
        <Link href={""}>Linkedin</Link>
        <Link href={""}>Facebook</Link>
        <Link href={""}>Github</Link>
        <Link href={""}>Youtube</Link>
      </div>
    </footer>
  );
};

export default Footer;
