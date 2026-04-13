import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const NAV_LINKS = [
    { to: "/", label: "Dashboard" },
    { to: "/symmetric", label: "Symmetric" },
    { to: "/asymmetric", label: "Asymmetric" },
    { to: "/hashing", label: "Hashing" },
];

const Header = () => {
    const { pathname } = useLocation();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link to="/" className="group flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white transition-colors group-hover:bg-slate-700">
                        <ShieldCheck size={15} strokeWidth={2} />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-slate-900">
                        CryptoToolkit
                    </span>
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-1">
                    {NAV_LINKS.map(({ to, label }) => {
                        const isActive =
                            to === "/"
                                ? pathname === "/"
                                : pathname.startsWith(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    isActive
                                        ? "bg-slate-100 font-medium text-slate-900"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Header;
