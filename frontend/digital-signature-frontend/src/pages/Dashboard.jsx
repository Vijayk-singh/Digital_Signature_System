import Navbar from "../components/Navbar";
import SignDocument from "../components/SignDocument";
import VerifyFile from "../components/VerifyFile";
import PublicKeysTable from "../components/PublicKeysTable";
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("sign");

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("sign")}
            className={`px-4 py-2 rounded ${
              activeTab === "sign" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Sign File
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            className={`px-4 py-2 rounded ${
              activeTab === "verify" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Verify File
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`px-4 py-2 rounded ${
              activeTab === "keys" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Public Keys
          </button>
        </div>

        {activeTab === "sign" && <SignDocument />}
        {activeTab === "verify" && <VerifyFile />}
        {activeTab === "keys" && <PublicKeysTable />}
      </div>
    </div>
  );
}
