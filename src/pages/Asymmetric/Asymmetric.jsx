import React, { useState } from "react";

async function generateKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );
    const publicKeyJwk = await crypto.subtle.exportKey(
        "jwk",
        keyPair.publicKey,
    );
    const privateKeyJwk = await crypto.subtle.exportKey(
        "jwk",
        keyPair.privateKey,
    );
    return { publicKey: publicKeyJwk, privateKey: privateKeyJwk };
}

function normalizePublicKey(k) {
    return { ...k, ext: k.ext ?? true, key_ops: k.key_ops || ["encrypt"] };
}
function normalizePrivateKey(k) {
    return { ...k, ext: k.ext ?? true, key_ops: k.key_ops || ["decrypt"] };
}

async function encryptRSA(plaintext, publicKeyJwk) {
    const publicKey = await crypto.subtle.importKey(
        "jwk",
        normalizePublicKey(publicKeyJwk),
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"],
    );
    const data = new TextEncoder().encode(plaintext);
    const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        data,
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function decryptRSA(ciphertextBase64, privateKeyJwk) {
    const privateKey = await crypto.subtle.importKey(
        "jwk",
        normalizePrivateKey(privateKeyJwk),
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"],
    );
    const encrypted = Uint8Array.from(atob(ciphertextBase64), (c) =>
        c.charCodeAt(0),
    );
    const decrypted = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encrypted,
    );
    return new TextDecoder().decode(decrypted);
}

async function testEncryption() {
    try {
        const keyPair = await generateKeyPair();
        const msg = "Hello, RSA!";
        const encrypted = await encryptRSA(msg, keyPair.publicKey);
        const decrypted = await decryptRSA(encrypted, keyPair.privateKey);
        return decrypted === msg;
    } catch {
        return false;
    }
}

// ── Primitives ──────────────────────────────────────────

function Label({ children }) {
    return (
        <label className="mb-1.5 block text-sm font-medium text-zinc-900">
            {children}
        </label>
    );
}

function Hint({ children }) {
    return (
        <span className="ml-1 text-xs font-normal text-zinc-400">
            {children}
        </span>
    );
}

function Field({ label, hint, children }) {
    return (
        <div>
            <Label>
                {label}
                {hint && <Hint>{hint}</Hint>}
            </Label>
            {children}
        </div>
    );
}

function Textarea({ value, onChange, rows, placeholder, readOnly }) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            readOnly={readOnly}
            className={[
                "w-full rounded-lg border border-zinc-200 px-3 py-2.5",
                "resize-y font-mono text-sm leading-relaxed text-zinc-900 outline-none",
                "transition-colors duration-100 placeholder:text-zinc-400",
                "focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5",
                readOnly
                    ? "cursor-default bg-zinc-50 text-zinc-500"
                    : "bg-white",
            ].join(" ")}
        />
    );
}

function Btn({ children, onClick, variant = "default", size = "md" }) {
    const base =
        "inline-flex items-center gap-1.5 font-medium rounded-lg border cursor-pointer transition-colors duration-100 whitespace-nowrap";
    const sz = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-3.5 py-2",
        lg: "text-sm px-5 py-2",
    };
    const v = {
        default:
            "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-700 hover:border-zinc-700",
        outline:
            "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300",
        ghost: "bg-transparent text-zinc-400 border-transparent hover:bg-zinc-100 hover:text-zinc-700",
    };
    return (
        <button
            onClick={onClick}
            className={`${base} ${sz[size]} ${v[variant]}`}
        >
            {children}
        </button>
    );
}

function Note({ children }) {
    return (
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{children}</p>
    );
}

function Sep() {
    return <hr className="my-6 border-zinc-100" />;
}

function ResultCard({ title, tag, value, rows = 4, actions }) {
    return (
        <div className="overflow-hidden rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
                <span className="text-xs font-medium text-zinc-600">
                    {title}
                </span>
                {tag && (
                    <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                        {tag}
                    </span>
                )}
            </div>
            <div className="bg-white">
                <textarea
                    value={value}
                    readOnly
                    rows={rows}
                    className="w-full resize-y bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-zinc-600 outline-none"
                />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-zinc-100 bg-zinc-50 px-3 py-2">
                {actions.map((a, i) => (
                    <Btn
                        key={i}
                        onClick={a.onClick}
                        variant={a.variant || "outline"}
                        size="sm"
                    >
                        {a.label}
                    </Btn>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ───────────────────────────────────────

export default function Asymmetric() {
    const [mode, setMode] = useState("encrypt");
    const [plaintext, setPlaintext] = useState("");
    const [ciphertext, setCiphertext] = useState("");
    const [publicKeyJwk, setPublicKeyJwk] = useState("");
    const [privateKeyJwk, setPrivateKeyJwk] = useState("");
    const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
    const [encryptedResult, setEncryptedResult] = useState("");
    const [decryptedResult, setDecryptedResult] = useState("");
    const [error, setError] = useState("");

    const handleGenerateKeys = async () => {
        try {
            const kp = await generateKeyPair();
            const pub = {
                kty: kp.publicKey.kty,
                n: kp.publicKey.n,
                e: kp.publicKey.e,
            };
            const priv = {
                kty: kp.privateKey.kty,
                n: kp.privateKey.n,
                e: kp.privateKey.e,
                d: kp.privateKey.d,
                p: kp.privateKey.p,
                q: kp.privateKey.q,
                dp: kp.privateKey.dp,
                dq: kp.privateKey.dq,
                qi: kp.privateKey.qi,
            };
            setPublicKeyJwk(JSON.stringify(pub, null, 2));
            setGeneratedPrivateKey(JSON.stringify(priv, null, 2));
            setError("");
        } catch {
            setError("Failed to generate keys");
        }
    };

    const handleEncrypt = async () => {
        try {
            let publicKey;
            try {
                publicKey = JSON.parse(publicKeyJwk);
            } catch {
                throw new Error("Invalid public key JSON");
            }
            const data = new TextEncoder().encode(plaintext);
            if (data.length > 190)
                throw new Error(
                    "Plaintext too long for RSA-2048. Maximum 190 bytes.",
                );
            const encrypted = await encryptRSA(plaintext, publicKey);
            setEncryptedResult(encrypted);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDecrypt = async () => {
        try {
            let privateKey;
            try {
                privateKey = JSON.parse(privateKeyJwk);
            } catch {
                throw new Error("Invalid private key JSON");
            }
            const decrypted = await decryptRSA(ciphertext, privateKey);
            setDecryptedResult(decrypted);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Copied!");
        } catch {
            alert("Failed to copy");
        }
    };

    const handleTestEncryption = async () => {
        const ok = await testEncryption();
        alert(ok ? "Test passed" : "Test failed");
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-2xl px-6 py-12">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                            RSA Asymmetric Encryption
                        </h1>
                        <p className="mt-0.5 text-sm text-zinc-500">
                            RSA-OAEP · SHA-256 · 2048-bit keys
                        </p>
                    </div>
                    <Btn
                        variant="outline"
                        size="sm"
                        onClick={handleTestEncryption}
                    >
                        Run test
                    </Btn>
                </div>

                <Sep />

                {/* Mode Tabs */}
                <div className="mb-8 inline-flex gap-1 rounded-lg bg-zinc-100 p-1">
                    {["encrypt", "decrypt"].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={[
                                "cursor-pointer rounded-md px-5 py-1.5 text-sm font-medium capitalize transition-all duration-100",
                                mode === m
                                    ? "border border-zinc-200 bg-white text-zinc-900 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-800",
                            ].join(" ")}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* ── Encrypt ── */}
                {mode === "encrypt" && (
                    <div className="space-y-5">
                        <Field label="Plaintext" hint="max 190 bytes">
                            <Textarea
                                value={plaintext}
                                onChange={(e) => setPlaintext(e.target.value)}
                                rows={4}
                                placeholder="Enter the message you want to encrypt..."
                            />
                        </Field>

                        <Field label="Public Key" hint="JWK format">
                            <Textarea
                                value={publicKeyJwk}
                                onChange={(e) =>
                                    setPublicKeyJwk(e.target.value)
                                }
                                rows={7}
                                placeholder={
                                    '{"kty": "RSA", "n": "...", "e": "AQAB"}'
                                }
                            />
                            <div className="mt-2 flex items-center gap-2">
                                <Btn
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateKeys}
                                >
                                    Generate key pair
                                </Btn>
                                {(publicKeyJwk || generatedPrivateKey) && (
                                    <Btn
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setPublicKeyJwk("");
                                            setGeneratedPrivateKey("");
                                        }}
                                    >
                                        Clear keys
                                    </Btn>
                                )}
                            </div>
                            <Note>
                                Private keys are not auto-filled for security.
                                Copy and store them securely.
                            </Note>
                        </Field>

                        {generatedPrivateKey && (
                            <ResultCard
                                title="Generated Private Key"
                                tag="save securely"
                                value={generatedPrivateKey}
                                rows={7}
                                actions={[
                                    {
                                        label: "Copy private key",
                                        onClick: () =>
                                            copy(generatedPrivateKey),
                                    },
                                    {
                                        label: "Load for decryption",
                                        onClick: () =>
                                            setPrivateKeyJwk(
                                                generatedPrivateKey,
                                            ),
                                    },
                                ]}
                            />
                        )}

                        <Sep />

                        <div>
                            <Btn onClick={handleEncrypt} size="lg">
                                Encrypt
                            </Btn>
                            <Note>
                                Ciphertext is not auto-filled. Results are shown
                                separately for manual control.
                            </Note>
                        </div>

                        {encryptedResult && (
                            <ResultCard
                                title="Encrypted Ciphertext"
                                tag="base64"
                                value={encryptedResult}
                                rows={4}
                                actions={[
                                    {
                                        label: "Copy ciphertext",
                                        onClick: () => copy(encryptedResult),
                                    },
                                    {
                                        label: "Load for decryption",
                                        onClick: () =>
                                            setCiphertext(encryptedResult),
                                    },
                                    {
                                        label: "Clear",
                                        onClick: () => setEncryptedResult(""),
                                        variant: "ghost",
                                    },
                                ]}
                            />
                        )}
                    </div>
                )}

                {/* ── Decrypt ── */}
                {mode === "decrypt" && (
                    <div className="space-y-5">
                        <Field label="Ciphertext" hint="base64 encoded">
                            <Textarea
                                value={ciphertext}
                                onChange={(e) => setCiphertext(e.target.value)}
                                rows={5}
                                placeholder="Paste the encrypted ciphertext..."
                            />
                        </Field>

                        <Field label="Private Key" hint="JWK format">
                            <Textarea
                                value={privateKeyJwk}
                                onChange={(e) =>
                                    setPrivateKeyJwk(e.target.value)
                                }
                                rows={9}
                                placeholder={
                                    '{"kty": "RSA", "n": "...", "d": "..."}'
                                }
                            />
                        </Field>

                        <Sep />

                        <div>
                            <Btn onClick={handleDecrypt} size="lg">
                                Decrypt
                            </Btn>
                            <Note>
                                Decrypted result is shown separately for manual
                                control.
                            </Note>
                        </div>

                        {decryptedResult && (
                            <ResultCard
                                title="Decrypted Plaintext"
                                tag="plaintext"
                                value={decryptedResult}
                                rows={4}
                                actions={[
                                    {
                                        label: "Copy plaintext",
                                        onClick: () => copy(decryptedResult),
                                    },
                                    {
                                        label: "Load to input",
                                        onClick: () =>
                                            setPlaintext(decryptedResult),
                                    },
                                    {
                                        label: "Clear",
                                        onClick: () => setDecryptedResult(""),
                                        variant: "ghost",
                                    },
                                ]}
                            />
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                        <span className="mt-px text-sm text-red-400 select-none">
                            ✕
                        </span>
                        <p className="text-sm leading-relaxed text-red-600">
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
