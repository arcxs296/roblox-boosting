"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
type Profile={id:string;display_name:string|null;role:"admin"|"staff"|"customer"};
type Order={id:string;order_code:string;roblox_username:string;current_level:number;target_level:number;status:string;created_at:string;customer_id:string};
const labels:Record<string,string>={created:"CREATED",logged_in:"LOGGED IN",ready_to_level:"READY TO LEVEL",leveling:"LEVELING",level_completed:"LEVEL COMPLETED",ready_for_sale:"READY FOR SALE",cancelled:"CANCELLED"};
function statusClass(s:string){return s==="level_completed"||s==="ready_for_sale"?"done":s==="leveling"?"progress":s==="created"?"wait":""}
export default function Dashboard(){
 const supabase=createClient(); const [profile,setProfile]=useState<Profile|null>(null); const [orders,setOrders]=useState<Order[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 const [username,setUsername]=useState(""); const [target,setTarget]=useState("500"); const [current,setCurrent]=useState("0"); const [saving,setSaving]=useState(false);
 async function load(){
  const {data:{user}}=await supabase.auth.getUser(); if(!user){window.location.href="/login";return;}
  const {data:p}=await supabase.from("profiles").select("id,display_name,role").eq("id",user.id).single();
  if(p)setProfile(p as Profile);
  const q=supabase.from("orders").select("*").order("created_at",{ascending:false});
  const {data,error}=await q; if(error)setError(error.message); else setOrders((data||[]) as Order[]);
  setLoading(false);
 }
 useEffect(()=>{load();},[]);
 async function addOrder(e:React.FormEvent){
  e.preventDefault();setSaving(true);setError("");
  const {data:{user}}=await supabase.auth.getUser(); if(!user){setError("Phiên đăng nhập hết hạn.");setSaving(false);return;}
  const {error}=await supabase.from("orders").insert({customer_id:user.id,roblox_username:username.trim(),current_level:Number(current),target_level:Number(target),status:"created"});
  if(error)setError(error.message);else{setUsername("");await load();}
  setSaving(false);
 }
 async function updateStatus(id:string,status:string){
  const {error}=await supabase.from("orders").update({status}).eq("id",id);
  if(error)setError(error.message);else await load();
 }
 async function signout(){await supabase.auth.signOut();window.location.href="/login";}
 const admin=profile?.role==="admin"||profile?.role==="staff";
 const visible=orders;
 if(loading)return <main className="auth-wrap"><p className="muted">Đang tải bảng điều khiển...</p></main>;
 return <div className="shell">
  <aside className="sidebar">
   <div className="brand"><span className="logo">R</span><span>ROBLOX<br/>BOOSTING</span></div>
   <nav className="nav"><a className="active" href="/dashboard">▦　Tổng quan</a><a href="#orders">▤　Đơn hàng</a><a href="#new-order">＋　Tạo đơn</a></nav>
   <p className="side-note">PURPLE CONTROL PANEL<br/>Quản lý dịch vụ Roblox<br/><br/>Tài khoản: {profile?.display_name||"Thành viên"}<br/>Vai trò: {profile?.role||"customer"}</p>
  </aside>
  <main className="main">
   <header className="top"><div><div className="eyebrow">SHOP MANAGEMENT</div><h1>Tổng quan</h1><p className="muted" style={{fontSize:13}}>Chào mừng đến với bảng điều khiển Roblox Boosting.</p></div><button className="btn secondary" onClick={signout}>Đăng xuất</button></header>
   <section className="grid">
    {[["Tổng đơn",visible.length],["Đang cày",visible.filter(o=>o.status==="leveling").length],["Chờ xử lý",visible.filter(o=>["created","logged_in","ready_to_level"].includes(o.status)).length],["Hoàn thành",visible.filter(o=>["level_completed","ready_for_sale"].includes(o.status)).length]].map(([label,value])=><div className="stat" key={label}><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot">Dữ liệu đồng bộ online</div></div>)}
   </section>
   <section className="panel" id="new-order">
    <div className="panel-head"><h2>Tạo đơn cày level</h2><span className="pill">CUSTOMER PORTAL</span></div>
    <form className="form" onSubmit={addOrder}>
     <label className="field">Tên tài khoản Roblox<input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="Roblox username (không phải mật khẩu)"/></label>
     <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <label className="field">Level hiện tại<input type="number" min="0" value={current} onChange={e=>setCurrent(e.target.value)} required/></label>
      <label className="field">Level mục tiêu<input type="number" min="1" value={target} onChange={e=>setTarget(e.target.value)} required/></label>
     </div>
     <div className="notice">Khách hàng tự đăng nhập và xác minh CAPTCHA trên trang Roblox chính thức. Không nhập mật khẩu hoặc cookie Roblox vào website này.</div>
     <button className="btn" disabled={saving}>{saving?"Đang tạo đơn...":"＋ Tạo đơn hàng"}</button>
    </form>
   </section>
   <section className="panel" id="orders">
    <div className="panel-head"><h2>Đơn hàng gần đây</h2><span className="pill">{visible.length} ĐƠN</span></div>
    {error&&<p className="error">{error}</p>}
    <div className="table-wrap"><table><thead><tr><th>Mã đơn</th><th>Roblox username</th><th>Tiến độ</th><th>Trạng thái</th>{admin&&<th>Cập nhật</th>}</tr></thead>
    <tbody>{visible.map(o=><tr key={o.id}><td>{o.order_code}</td><td>{o.roblox_username}</td><td>{o.current_level} / {o.target_level}</td><td><span className={"status "+statusClass(o.status)}>{labels[o.status]||o.status}</span></td>{admin&&<td><select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)} style={{background:"#171222",color:"white",border:"1px solid #49336c",padding:7,borderRadius:8}}>{Object.entries(labels).filter(([k])=>k!=="cancelled").map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></td>}</tr>)}
    {visible.length===0&&<tr><td colSpan={admin?5:4} className="muted">Chưa có đơn hàng. Tạo đơn đầu tiên ở phía trên.</td></tr>}</tbody></table></div>
   </section>
  </main>
 </div>;
}
