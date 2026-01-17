import Link from "next/link";
import { GiWallet } from "react-icons/gi";

function Logo({ isAuth = false }) {
  return (
    <Link href="/">
      <div className="flex items-center">
        <GiWallet size={48} color="#4f915f" />
        <h1
          className={`ml-2 mt-2 text-2xl font-semibold ${
            isAuth ? "text-white" : "text-black"
          }`}
        >
          MoneySmart
        </h1>
      </div>
    </Link>
  );
}

export default Logo;
