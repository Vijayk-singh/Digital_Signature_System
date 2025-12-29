import { useState } from "react";
import { signFile } from "../api";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSign = async () => {
    if (!file) return setMessage("Please select a file first!");

    try {
      const token = localStorage.getItem("token");
      const res = await signFile(file, token, privatekey);
      setMessage(res.message || "File signed successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error signing file.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign a File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-4"
      />

      <button
        onClick={handleSign}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Sign File
      </button>

      <p className="text-center mt-3 text-gray-600">{message}</p>
    </div>
  );
}
