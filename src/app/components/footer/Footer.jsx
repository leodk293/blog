import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Github, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className=" py-10 text-white border-t border-t-gray-100 bg-gray-900 mt-[100px] flex flex-wrap justify-center gap-10 md:justify-evenly md:gap-0">
      <Link href="/" className="">
        <h1 className=" self-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          NeonThoughts
        </h1>
      </Link>

      <p className=" font-bold self-center">
        All rights reserved. Copyright NeonThoughts
      </p>

      <div className=" self-center flex flex-row gap-4">
        <Link
          target="_blank"
          className=" border border-transparent p-2 bg-[#0077B5] rounded-full"
          href={"https://www.linkedin.com/in/aboubacar-traore-495736252"}
        >
          <Linkedin size={26} color="#ffffff" strokeWidth={2} />
        </Link>
        <Link
          target="_blank"
          className=" border border-transparent p-2 bg-[#1877F2] rounded-full"
          href={"https://www.facebook.com/profile.php?id=100092315485742"}
        >
          <Facebook size={26} color="#ffffff" strokeWidth={2} />
        </Link>
        <Link
          target="_blank"
          className=" text-white text-2xl border border-transparent p-2 bg-[#1DA1F2] rounded-full"
          href={"https://x.com/Aboubac48530295"}
        >
          <Twitter size={26} color="#ffffff" strokeWidth={2} />
        </Link>
        <Link
          target="_blank"
          className=" border border-white p-2 bg-black rounded-full"
          href={"https://github.com/leodk293"}
        >
          <Github size={26} color="#ffffff" strokeWidth={2} />
        </Link>
        <Link
          target="_blank"
          className=" text-white text-2xl border border-transparent p-2 bg-red-700 rounded-full"
          href={"https://www.youtube.com/@aboubacartraore5831"}
        >
          <Youtube size={26} color="#ffffff" strokeWidth={2} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
