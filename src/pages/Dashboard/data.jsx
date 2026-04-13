import { Hash, KeyRound, Lock } from "lucide-react";

export const FEATURES = [
    {
        to: "/symmetric",
        icon: Lock,
        label: "Symmetric",
        title: "Symmetric Encryption",
        description:
            "Mã hóa và giải mã dữ liệu bằng cùng một khóa bí mật. Hỗ trợ AES-128, AES-256 và các chế độ CBC, ECB, GCM.",
        accent: "bg-violet-50 text-violet-600",
        border: "hover:border-violet-200",
        btnAccent: "text-violet-700 hover:bg-violet-50",
    },
    {
        to: "/asymmetric",
        icon: KeyRound,
        label: "Asymmetric",
        title: "Asymmetric Encryption",
        description:
            "Sử dụng cặp khóa công khai / bí mật để mã hóa an toàn. Hỗ trợ RSA-2048, RSA-4096 và ký số.",
        accent: "bg-sky-50 text-sky-600",
        border: "hover:border-sky-200",
        btnAccent: "text-sky-700 hover:bg-sky-50",
    },
    {
        to: "/hashing",
        icon: Hash,
        label: "Hashing",
        title: "Cryptographic Hashing",
        description:
            "Tạo giá trị băm một chiều từ dữ liệu đầu vào. Hỗ trợ MD5, SHA-1, SHA-256, SHA-512 và HMAC.",
        accent: "bg-emerald-50 text-emerald-600",
        border: "hover:border-emerald-200",
        btnAccent: "text-emerald-700 hover:bg-emerald-50",
    },
];
