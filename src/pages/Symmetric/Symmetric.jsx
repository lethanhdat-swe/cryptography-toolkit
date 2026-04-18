import { useState } from "react";
import CryptoJS from "crypto-js";

function Symmetric() {
    // Code thuật toán: DES, 3DES, AES
    //Buu: AES
    const [text, setText] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");

    const encrypt = () => {
        if(!text || !key) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        const encrypted = CryptoJS.AES.encrypt(text, key).toString();
        setResult(encrypted);
    };

    const decrypt = () => {
        if(!result || !key) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try{
            const bytes = CryptoJS.AES.decrypt(text, key);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            setResult(decrypted || "Sai khóa");
        }catch{
            setResult("Lỗi giải mã");
        }
    };

    const generateKey = () => {
        const randomKey = CryptoJS.lib.WordArray.random(16).toString();
        setKey(randomKey);
    };

    return (
    <div className="max-w-xl mx-auto mt-10 p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">AES Encryption</h2>

        <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />

        <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Enter key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
        />

        <button className="bg-gray-500 text-white px-3 py-1 rounded mb-2"
        onClick={generateKey}>
            Generate Key
        </button>

        <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={encrypt}>
            Encrypt
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={decrypt}>
            Decrypt
            </button>
        </div>

        <textarea
            className="w-full border p-2 rounded mt-3"
            placeholder="Result"
            value={result}
            readOnly
        />
    </div>
    );
}

export default Symmetric;
