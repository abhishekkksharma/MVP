import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithPassword, signUpWithPassword, signInWithProvider } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const title = useMemo(() => (mode === "login" ? "Login" : "Create account"), [mode]);
  const cta = useMemo(() => (mode === "login" ? "Login" : "Sign up"), [mode]);
  const switchText = useMemo(
    () => (mode === "login" ? "New here?" : "Already have an account?"),
    [mode]
  );
  const switchCta = useMemo(() => (mode === "login" ? "Create one" : "Login"), [mode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email || !password) {
      setError("Please fill in email and password.");
      return;
    }
    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      if (mode === "login") {
        const { error: signInError } = await signInWithPassword({ email, password });
        if (signInError) throw signInError;
        navigate("/profile");
      } else {
        const { data, error: signUpError } = await signUpWithPassword({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw signUpError;
        if (data?.user?.identities?.length === 0) {
          // user exists case
          setError("An account with this email already exists. Try logging in.");
        } else {
          setInfo("Check your email to confirm your account. Then login.");
          setMode("login");
        }
      }
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setLoading(true);
      await signInWithProvider("google");
      // Supabase will redirect; after redirect, session listener kicks in
    } catch (err) {
      setError(err?.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-50 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              mode === "login"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-700"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              mode === "signup"
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-700"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-purple-900 mb-4">{title}</h2>

        <button
          onClick={onGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-purple-200 rounded-full py-3 hover:bg-purple-100 transition mb-4 disabled:opacity-60"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-purple-800 font-medium">
            {mode === "login" ? "Login" : "Sign up"} with Google
          </span>
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-purple-200" />
          <span className="px-2 text-purple-500 text-sm">or with email</span>
          <hr className="flex-1 border-purple-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded-lg text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-400 outline-none"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-full font-medium hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : cta}
          </button>
        </form>

        {error && <p className="text-center text-sm mt-3 text-red-600">{error}</p>}
        {info && <p className="text-center text-sm mt-3 text-green-600">{info}</p>}

        <p className="text-sm text-purple-700 mt-6 text-center">
          {switchText}
          <button
            type="button"
            className="ml-1 text-purple-600 hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {switchCta}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
