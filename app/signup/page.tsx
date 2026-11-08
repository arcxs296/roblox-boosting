"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
export default function Signup() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    const {error}=await createClient().auth.signUp({email,password,options:{data:{display_name:name}}});
    if(error){setError(error.message);setBusy(false);return;}
    setMessage("Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản nếu được yêu cầu.");
    setBusy(false);
  }
  return <main className="auth-wrap"><section className="auth-card">
    <div className="brand" style={{margin:"0 0 28px"}}><span className="logo">R</span> ROBLOX BOOSTING</div>
    <div className="eyebrow">CREATE ACCOUNT</div><h1 style={{fontSize:28,marginBottom:8}}>Tạo tài khoản</h1>
    <form className="form" onSubmit={submit}>
      <label className="field">Tên hiển thị<input required value={name} onChange={e=>setName(e.target.value)} /></label>
      <label className="field">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="field">Mật khẩu (ít nhất 8 ký tự)<input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} /></label>
      {error&&<p className="error">{error}</p>}{message&&<div className="notice">{message}</div>}
      <button className="btn" disabled={busy}>{busy?"Đang tạo...":"Đăng ký"}</button>
    </form>
    <p className="muted" style={{fontSize:13,marginTop:20}}>Đã có tài khoản? <Link href="/login" style={{color:"#c084fc"}}>Đăng nhập</Link></p>
  </section></main>;
}
