import React, { useState } from "react";

export default function SignDocument() {
  const [email, setEmail] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState("");
  

  const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  const importPrivateKey = async (pem) => {
    const binaryDer = str2ab(
      atob(
        pem
          .replace("-----BEGIN PRIVATE KEY-----", "")
          .replace("-----END PRIVATE KEY-----", "")
          .replace(/\n/g, "")
      )
    );
    return await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      true,
      ["sign"]
    );
  };

  const signFile = async () => {
    if (!file || !privateKey) return alert("Select a file and provide your private key.");

    const privateKeyObj = await importPrivateKey(privateKey);
    const fileArrayBuffer = await file.arrayBuffer();

    const signatureBuffer = await window.crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKeyObj,
      fileArrayBuffer
    );

    const signatureBase64 = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    );
    setSignature(signatureBase64);
    alert("File signed successfully!");
  };

 

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Digital Signature</h2>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <textarea
        placeholder="Paste your PRIVATE KEY here"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        rows="5"
        className="border p-2 w-full mb-3 rounded font-mono text-sm"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 w-full mb-3 rounded"
      />

      <div className="flex gap-3">
        <button
          onClick={signFile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign File
        </button>

        
      </div>

      {signature && (
        <div className="mt-4 text-xs break-all bg-gray-50 p-2 rounded">
          <strong>Signature:</strong>
          <p>{signature}</p>
        </div>
      )}

     
    </div>
  );
}
