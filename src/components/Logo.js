import Link from "next/link";
import { GiWallet } from "react-icons/gi";

function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center">
        <GiWallet size={48} color="#4f915f" />
        <h1 className="ml-4 mt-2 text-2xl font-semibold">MoneySmart</h1>
      </div>
    </Link>
  );
}

export default Logo;
