import { ShieldCheck } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6">
                {/* Brand */}
                <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={14} strokeWidth={2} />
                    <span className="text-xs font-medium tracking-tight">
                        CryptoToolkit
                    </span>
                </div>

                {/* Center info */}
                <p className="text-xs text-slate-400">
                    Cryptography Toolkit — Group Project &copy; 2026
                </p>

                {/* Right badge */}
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
                    HCMUS — Security Lab
                </span>
            </div>
        </footer>
    );
};

export default Footer;
