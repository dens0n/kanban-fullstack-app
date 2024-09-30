import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [authState, setAuthState] = useState<"Log in" | "Sign up">("Log in");
  const [name, setName] = useState<string>("");
  const endpoint = isLogin ? "login" : "signup";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      console.log(name, email, password);
      const response = await axios.post(
        `${import.meta.env.VITE_DATABASE_URL}/api/${endpoint}`,
        isLogin ? { email, password } : { name, email, password },
        isLogin ? { withCredentials: true } : {},
      );

      console.log(response.data);

      if (isLogin) {
        sessionStorage.setItem("isLoggedIn", "true");
        navigate("/kanban");
      } else {
        setAuthState("Log in");
        setIsLogin(true);
        setName("");
      }
    } catch (error) {
      console.log(error);
      sessionStorage.removeItem("isLoggedIn");
      setError(
        `${authState} failed. Please check your credentials and try again.`,
      );
    }
  };

  const toggleAuthState = () => {
    if (authState === "Log in") {
      setIsLogin(false);
      setAuthState("Sign up");
    } else {
      setIsLogin(true);
      setAuthState("Log in");
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="relative flex h-[600px] w-[800px] flex-col items-center justify-start gap-20 rounded-2xl bg-columnBackgroundColor p-16">
        <button
          onClick={toggleAuthState}
          className="absolute right-0 top-0 m-10 rounded-lg border-2 border-gray-300 px-3 py-1 text-gray-300 hover:border-gray-50 hover:text-gray-50"
        >
          {authState === "Log in" ? "Sign up" : "Log in"}
        </button>
        <h2 className="text-3xl">{authState}</h2>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <input
                className="min-w[350px] flex h-[60px] w-[350px] rounded-lg border-2 bg-black px-2 outline-none focus:border-rose-500"
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name..."
              />
            </div>
          )}
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
            {authState}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
