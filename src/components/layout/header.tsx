import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-navy-900">
          Chitti
        </Link>
        <Button className="bg-accent-500 hover:bg-accent-600 text-white">
          Start Free Trial
        </Button>
      </div>
    </header>
  );
}
