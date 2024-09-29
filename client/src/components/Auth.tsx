import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // This ensures cookies are included in the request
        },
      );

      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      navigate("/kanban");
    } catch (error) {
      console.log(error);

      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex h-[600px] w-[800px] flex-col items-center justify-start gap-20 bg-columnBackgroundColor p-16">
        <h2 className="text-3xl">Login</h2>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div>
            <input
              className="min-w[350px] flex h-[60px] w-[350px] rounded-lg border-2 bg-black px-2 outline-none focus:border-rose-500"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email..."
            />
          </div>
          <div>
            <input
              className="min-w[350px] flex h-[60px] w-[350px] rounded-lg border-2 bg-black px-2 outline-none focus:border-rose-500"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password..."
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            className="min-w[350px] flex h-[60px] w-[350px] cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-white bg-mainBackgroundColor p-4 ring-rose-500 hover:ring-2"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
