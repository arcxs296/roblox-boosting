
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      window.location.assign("/dashboard");
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <div
          className="brand"
          style={{ margin: "0 0 28px" }}
        >
          <span className="logo">R</span>
          ROBLOX BOOSTING
        </div>

        <div className="eyebrow">WELCOME BACK</div>

        <h1 style={{ fontSize: 28, marginBottom: 8 }}>
          Đăng nhập
        </h1>

        <p
          className="muted"
          style={{ fontSize: 13, marginBottom: 24 }}
        >
          Truy cập bảng điều khiển shop của bạn.
        </p>

        <form className="form" onSubmit={submit}>
          <label className="field">
            Email

            <input
              type="email"
              placeholder="Nhập email của bạn"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            Mật khẩu

            <input
              type="password"
              placeholder="Nhập mật khẩu"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={busy}
          >
            {busy ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p
          className="muted"
          style={{ fontSize: 13, marginTop: 20 }}
        >
          Chưa có tài khoản?{" "}
          <Link
            href="/signup"
            style={{ color: "#c084fc" }}
          >
            Đăng ký
          </Link>
        </p>
      </section>
    </main>
  );
}
