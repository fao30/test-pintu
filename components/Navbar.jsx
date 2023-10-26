"use client";
// Miscellaneous
import logoPintu from "../app/pintu.png";
import Image from "next/legacy/image";

export default function Navbar() {
  return (
    <nav className="py-1 bg-white px-[5vw] flex justify-between items-center">
      <div>
        <Image src={logoPintu} width={70} height={70} />
      </div>
    </nav>
  );
}
