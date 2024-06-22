'use client'

import React, { CSSProperties, useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        if(email === 'truong@gmail.com' && password === '1'){
            router.push('dashboard');
        }else{
            alert('Tài khoản hoặc mật khẩu không đúng');
        }
    };
    return(
        <div style={containerStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2>Đăng nhập</h2>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
            style={inputStyle}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Mật khẩu</label>
            <input
            style={inputStyle}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={buttonStyle}>Đăng nhập</button>
        </form>
      </div>
    )
}


const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  };
  
  const formStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };
  
  const inputGroupStyle: CSSProperties = {
    marginBottom: '15px',
  };

  const inputStyle:CSSProperties={
    background:'unset',
    marginLeft:'10px'
  }
  
  const buttonStyle: CSSProperties = {
    padding: '10px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const labelStyle: CSSProperties = {
    marginBottom: '5px',
    color: '#333', // Màu sắc rõ ràng cho label
  };