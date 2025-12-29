import { useEffect, useState } from "react";

export default function PublicKeysTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = "http://127.0.0.1:8000"; // ✅ Change if needed

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await fetch(`${API_URL}/public-keys`);
        if (!res.ok) throw new Error("Failed to fetch keys");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Error fetching public keys.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10">Loading public keys...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">{error}</p>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Public Keys Directory
      </h2>

      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Public Key</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.email} className="hover:bg-gray-50">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border text-xs break-all font-mono text-gray-700">
                  {u.public_key}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="text-center p-3 text-gray-500 italic"
              >
                No public keys found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
