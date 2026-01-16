"use client";

import { useSidebar } from "./ui/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";

export default function CustomerTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar} className="lg:hidden">
      <GiHamburgerMenu size={30} color="#4f915f" />
    </button>
  );
}
