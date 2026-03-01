import { useState } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";

type Role = "provider" | "staff";


export default function Login() {
const navigate = useNavigate();
  const [sub, setSub] = useState("demo-user");
  const [role, setRole] = useState<Role>("provider");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/dev-token", {
        sub,
        roles: [role],
      });
      localStorage.setItem("token", data.token);
      navigate("/tasks", { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Login (Dev)</h2>

      <div style={{ marginTop: 12 }}>
        <label>User</label>
        <input
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          style={{ display: "block", width: 260 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={{ display: "block", width: 260 }}
        >
          <option value="provider">provider</option>
          <option value="staff">staff</option>
        </select>
      </div>

      <button onClick={login} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
