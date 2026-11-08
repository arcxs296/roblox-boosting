"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const {error}=await createClient().auth.signInWithPassword({email,password});
    if(error){setError(error.message);setBusy(false);return;}
    window.location.href="/dashboard";
  }
  return <main className="auth-wrap"><section className="auth-card">
    <div className="brand" style={{margin:"0 0 28px"}}><span className="logo">R</span> ROBLOX BOOSTING</div>
    <div className="eyebrow">WELCOME BACK</div><h1 style={{fontSize:28,marginBottom:8}}>Đăng nhập</h1>
    <p className="muted" style={{fontSize:13,marginBottom:24}}>Truy cập bảng điều khiển shop của bạn.</p>
    <form className="form" onSubmit={submit}>
      <label className="field">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="field">Mật khẩu<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error&&<p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy?"Đang đăng nhập...":"Đăng nhập"}</button>
    </form>
    <p className="muted" style={{fontSize:13,marginTop:20}}>Chưa có tài khoản? <Link href="/signup" style={{color:"#c084fc"}}>Đăng ký</Link></p>
  </section></main>;
}
