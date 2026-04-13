import { ShieldCheck } from "lucide-react";
import CardItem from "./CardItem";
import { FEATURES } from "./data";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                {/* Hero */}
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                        <ShieldCheck size={22} strokeWidth={1.8} />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Cryptography Toolkit
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                        Bộ công cụ mật mã học tích hợp — mã hóa đối xứng, bất
                        đối xứng và hàm băm trong một giao diện duy nhất.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feat) => (
                        <CardItem key={feat.to} {...feat} />
                    ))}
                </div>

                {/* Bottom note */}
                <p className="mt-10 text-center text-xs text-slate-400">
                    Chọn một tính năng để bắt đầu thao tác mật mã học.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
