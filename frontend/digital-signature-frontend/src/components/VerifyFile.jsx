import { useState } from "react";

export default function VerifyFile() {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState("");
  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [result, setResult] = useState("");
  const API_URL = "http://127.0.0.1:8000";

  const handleVerify = async () => {
    if (!file || !signature || !email) {
      setResult("Please select a file, enter signature and email.");
      return;
    }

    try {
      // ✅ Step 1: Fetch the user's public key
      const keyRes = await fetch(`${API_URL}/auth/public-key/${email}`);
      if (!keyRes.ok) {
        setResult("❌ Failed to fetch public key for this email.");
        return;
      }
      const keyData = await keyRes.json();
      const userPublicKey = keyData.public_key;
      setPublicKey(userPublicKey);

      // ✅ Step 2: Send file + signature + email for verification
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("email", email);

      const res = await fetch(`${API_URL}/dss/verify`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        setResult(`❌ Verification failed: ${err.detail || "Server error."}`);
        return;
      }

      const data = await res.json();
      setResult(
        data.valid
          ? `✅ Verified! Signed by: ${data.signee}`
          : "❌ Invalid signature or tampered file!"
      );
    } catch (error) {
      console.error(error);
      setResult("❌ Verification failed. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Verify Signed File
      </h2>

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-4"
      />

      {/* Signature Input */}
      <textarea
        placeholder="Paste signature here"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        className="w-full mb-4 border rounded p-2"
        rows={3}
      />

      {/* Email Input */}
      <input
        type="email"
        placeholder="Enter signee's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 border rounded p-2"
      />

      <button
        onClick={handleVerify}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Verify File
      </button>

      {publicKey && (
        <p className="text-xs text-gray-500 mt-3 break-words">
          <strong>Public Key:</strong> {publicKey.slice(0, 80)}...
        </p>
      )}

      <p className="text-center mt-3 text-gray-700">{result}</p>
    </div>
  );
}
