import React, { useState } from 'react';

// RSA utilities using Web Crypto API

async function generateKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  return { publicKey: publicKeyJwk, privateKey: privateKeyJwk };
}

function normalizePublicKey(publicKeyJwk) {
  return {
    ...publicKeyJwk,
    ext: publicKeyJwk.ext ?? true,
    key_ops: publicKeyJwk.key_ops || ["encrypt"],
  };
}

function normalizePrivateKey(privateKeyJwk) {
  return {
    ...privateKeyJwk,
    ext: privateKeyJwk.ext ?? true,
    key_ops: privateKeyJwk.key_ops || ["decrypt"],
  };
}

async function encryptRSA(plaintext, publicKeyJwk) {
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    normalizePublicKey(publicKeyJwk),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const data = new TextEncoder().encode(plaintext);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    data
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function decryptRSA(ciphertextBase64, privateKeyJwk) {
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    normalizePrivateKey(privateKeyJwk),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"]
  );

  const encrypted = Uint8Array.from(atob(ciphertextBase64), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

async function testEncryption() {
  try {
    const keyPair = await generateKeyPair();
    const testMessage = "Hello, RSA!";
    const encrypted = await encryptRSA(testMessage, keyPair.publicKey);
    const decrypted = await decryptRSA(encrypted, keyPair.privateKey);
    return decrypted === testMessage;
  } catch {
    return false;
  }
}

function Asymmetric() {
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [publicKeyJwk, setPublicKeyJwk] = useState('');
  const [privateKeyJwk, setPrivateKeyJwk] = useState('');
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState('');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerateKeys = async () => {
    try {
      const keyPair = await generateKeyPair();
      const filteredPublic = {
        kty: keyPair.publicKey.kty,
        n: keyPair.publicKey.n,
        e: keyPair.publicKey.e
      };
      const filteredPrivate = {
        kty: keyPair.privateKey.kty,
        n: keyPair.privateKey.n,
        e: keyPair.privateKey.e,
        d: keyPair.privateKey.d,
        p: keyPair.privateKey.p,
        q: keyPair.privateKey.q,
        dp: keyPair.privateKey.dp,
        dq: keyPair.privateKey.dq,
        qi: keyPair.privateKey.qi
      };
      setPublicKeyJwk(JSON.stringify(filteredPublic, null, 2));
      setGeneratedPrivateKey(JSON.stringify(filteredPrivate, null, 2));
      setError('');
    } catch {
      setError('Failed to generate keys');
    }
  };

  const handleEncrypt = async () => {
    try {
      let publicKey;
      try {
        publicKey = JSON.parse(publicKeyJwk);
      } catch {
        throw new Error('Invalid public key JSON');
      }
      const data = new TextEncoder().encode(plaintext);
      if (data.length > 190) {
        throw new Error('Plaintext too long for RSA-2048. Maximum 190 bytes (approximately 190 characters for ASCII text).');
      }
      const encrypted = await encryptRSA(plaintext, publicKey);
      setEncryptedResult(encrypted);
      setError('');
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
        throw new Error('Invalid private key JSON');
      }
      const decrypted = await decryptRSA(ciphertext, privateKey);
      setDecryptedResult(decrypted);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch {
      alert('Failed to copy');
    }
  };

  const handleTestEncryption = async () => {
    const success = await testEncryption();
    if (success) {
      alert('RSA encryption test passed!');
    } else {
      alert('RSA encryption test failed!');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>RSA Asymmetric Encryption</h1>
      <button className="test-button" onClick={handleTestEncryption} style={{ marginBottom: '1rem' }}>Test RSA Encryption</button>

      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setMode('encrypt')} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>Encrypt</button>
        <button onClick={() => setMode('decrypt')} style={{ padding: '0.5rem 1rem' }}>Decrypt</button>
      </div>

      {mode === 'encrypt' && (
        <div>
          <h2> RSA Encryption</h2>

          <div style={{ marginBottom: '1rem' }}>
            <label>Plaintext</label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={4}
              placeholder="Enter the message you want to encrypt..."
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Public Key (JWK)</label>
            <textarea
              value={publicKeyJwk}
              onChange={(e) => setPublicKeyJwk(e.target.value)}
              rows={8}
              placeholder="Paste a public key in JWK format, or generate a new one..."
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={handleGenerateKeys} style={{ marginRight: '0.5rem' }}>Generate New Key Pair</button>
              {(publicKeyJwk || generatedPrivateKey) && <button onClick={() => { setPublicKeyJwk(''); setGeneratedPrivateKey(''); }}>Clear Keys</button>}
            </div>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '0.5rem' }}>
              <strong>Note:</strong> Private keys are not auto-filled for security. Copy and store them securely.
            </p>
          </div>

          {generatedPrivateKey && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fffbf0', border: '1px solid #ccc' }}>
              <label> Generated Private Key (save this securely for decryption)</label>
              <textarea
                value={generatedPrivateKey}
                readOnly
                rows={8}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => copyToClipboard(generatedPrivateKey)} style={{ marginRight: '0.5rem' }}>Copy Private Key</button>
                <button onClick={() => setPrivateKeyJwk(generatedPrivateKey)}>Load for Decryption</button>
              </div>
            </div>
          )}

          <button onClick={handleEncrypt} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>Encrypt</button>

          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
            <strong>Note:</strong> Ciphertext is not auto-filled. Results are shown separately for manual control.
          </p>

          {encryptedResult && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #ccc' }}>
              <label> Encrypted Ciphertext</label>
              <textarea
                value={encryptedResult}
                readOnly
                rows={4}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => copyToClipboard(encryptedResult)} style={{ marginRight: '0.5rem' }}>Copy Ciphertext</button>
                <button onClick={() => setCiphertext(encryptedResult)} style={{ marginRight: '0.5rem' }}>Load for Decryption</button>
                <button onClick={() => setEncryptedResult('')}>Clear Result</button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'decrypt' && (
        <div>
          <h2> RSA Decryption</h2>

          <div style={{ marginBottom: '1rem' }}>
            <label>Ciphertext</label>
            <textarea
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              rows={6}
              placeholder="Paste the encrypted ciphertext..."
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Private Key (JWK)</label>
            <textarea
              value={privateKeyJwk}
              onChange={(e) => setPrivateKeyJwk(e.target.value)}
              rows={10}
              placeholder="Paste your private key in JWK format..."
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>

          <button onClick={handleDecrypt} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>Decrypt</button>

          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
            <strong>Note:</strong> Decrypted result is shown separately for manual control.
          </p>

          {decryptedResult && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #ccc' }}>
              <label> Decrypted Plaintext</label>
              <textarea
                value={decryptedResult}
                readOnly
                rows={4}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => copyToClipboard(decryptedResult)} style={{ marginRight: '0.5rem' }}>Copy Plaintext</button>
                <button onClick={() => setPlaintext(decryptedResult)} style={{ marginRight: '0.5rem' }}>Load to Input</button>
                <button onClick={() => setDecryptedResult('')}>Clear Result</button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red' }}> {error}</p>}
    </div>
  );
}

export default Asymmetric;
