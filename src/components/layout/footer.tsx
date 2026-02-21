import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold">Chitti</div>

          <nav className="flex gap-6">
            <Link
              href="/privacy"
              className="text-navy-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-navy-300 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="mailto:contact@chitti.ai"
              className="text-navy-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          <p className="text-navy-400 text-sm">
            &copy; 2026 Chitti AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
