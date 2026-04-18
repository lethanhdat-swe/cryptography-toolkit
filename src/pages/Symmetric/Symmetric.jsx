import { useState } from "react";
import CryptoJS from "crypto-js";

function Symmetric() {
    // Code thuật toán: DES, 3DES, AES
    // Quản lý cấu hình thuật toán và mode
    const [algorithm, setAlgorithm] = useState("AES");
    const [mode, setMode] = useState("CBC");
    //Buu: AES
    const [text, setText] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");

    // Hàm set cấu hình mode cho thư viện CryptoJS
    const getCryptoConfig = () => {
        return {
            mode: mode === "ECB" ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        };
    };
    
    const encrypt = () => {
        if (!text || !key) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            let encrypted;
            const config = getCryptoConfig();

            // Chạy thuật toán tương ứng
            if (algorithm === "AES") {
                encrypted = CryptoJS.AES.encrypt(text, key, config);
            } else if (algorithm === "DES") {
                encrypted = CryptoJS.DES.encrypt(text, key, config);
            } else if (algorithm === "3DES") {
                encrypted = CryptoJS.TripleDES.encrypt(text, key, config);
            }

            setResult(encrypted.toString());
        } catch (error) {
            setResult("Lỗi mã hóa");
        }
    };

    const decrypt = () => {
        if (!text || !key) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            let decryptedBytes;
            const config = getCryptoConfig();

            // Chạy thuật toán tương ứng
            if (algorithm === "AES") {
                decryptedBytes = CryptoJS.AES.decrypt(text, key, config);
            } else if (algorithm === "DES") {
                decryptedBytes = CryptoJS.DES.decrypt(text, key, config);
            } else if (algorithm === "3DES") {
                decryptedBytes = CryptoJS.TripleDES.decrypt(text, key, config);
            }

            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

            // Xử lý trường hợp nhập sai key hoặc text rác
            if (!decryptedText) {
                setResult("Sai khóa, sai mode hoặc sai thuật toán");
                return;
            }

            setResult(decryptedText);
        } catch (error) {
            setResult("Lỗi giải mã: Ciphertext không hợp lệ");
        }
    };

    const generateKey = () => {
        const randomKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        setKey(randomKey);
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Symmetric Encryption</h2>

            {/* Chọn Thuật toán & Mode */}
            <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">Algorithm</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                    >
                        <option value="AES">AES</option>
                        <option value="DES">DES</option>
                        <option value="3DES">3DES</option>
                    </select>
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">Mode</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="CBC">CBC</option>
                        <option value="ECB">ECB</option>
                    </select>
                </div>
            </div>

            {/* Khung Text */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Plaintext / Ciphertext</label>
                <input
                    className="w-full border p-2 rounded"
                    placeholder="Enter text to encrypt/decrypt"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            {/* Khung Key */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">Secret Key</label>
                <div className="flex gap-2">
                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Enter key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded whitespace-nowrap"
                        onClick={generateKey}
                    >
                        Generate Key
                    </button>
                </div>
            </div>

            {/* Nút Execute */}
            <div className="flex gap-4 mb-4">
                <button
                    className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded font-bold"
                    onClick={encrypt}
                >
                    Encrypt
                </button>
                <button
                    className="w-1/2 bg-red-500 text-white px-4 py-2 rounded font-bold"
                    onClick={decrypt}
                >
                    Decrypt
                </button>
            </div>

            {/* Khung Result */}
            <div>
                <label className="block text-sm font-semibold mb-1">Result</label>
                <textarea
                    className="w-full border p-2 rounded bg-gray-50 min-h-[100px]"
                    placeholder="Result will appear here"
                    value={result}
                    readOnly
                />
            </div>
        </div>
    );
}

export default Symmetric;
