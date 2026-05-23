const fs = require('fs');

let navbarCode = fs.readFileSync('C:\\Users\\ELSAFA\\Downloads\\OSA-CLO-complete-implementation\\OSA-CLO-files\\src\\components\\Navbar.tsx', 'utf8');

navbarCode = navbarCode.replace(
`interface Props {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Navbar({ cartCount = 0, onCartClick }: Props) {`,
`import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import FuzzySearch from "./FuzzySearch"; // I'll make sure FuzzySearch is imported if they want it

export default function Header() {
  const { count: cartCount, setIsOpen } = useCart();
  const onCartClick = () => setIsOpen(true);
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
`
);

fs.writeFileSync('C:\\Users\\ELSAFA\\.gemini\\antigravity\\scratch\\osha-store\\src\\components\\Header.tsx', navbarCode);
