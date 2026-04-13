import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function CardItem({ to, icon, title, description, accent, border, btnAccent }) {
    const Icon = icon;

    return (
        <Link
            to={to}
            className={`group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:shadow-sm ${border}`}
        >
            {/* Icon */}
            <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
            >
                <Icon size={20} strokeWidth={1.8} />
            </div>

            {/* Text */}
            <h2 className="mb-2 text-base font-semibold text-slate-900">
                {title}
            </h2>
            <p className="flex-1 text-sm leading-relaxed text-slate-500">
                {description}
            </p>

            {/* CTA */}
            <div
                className={`mt-5 inline-flex items-center gap-1.5 self-start rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${btnAccent}`}
            >
                Bắt đầu
                <ArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                />
            </div>
        </Link>
    );
}

export default CardItem;
