import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyEmail } from "../api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    async function verify() {
      const res = await verifyEmail(token);
      setMessage(res.message || "Verification complete.");
    }
    verify();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
