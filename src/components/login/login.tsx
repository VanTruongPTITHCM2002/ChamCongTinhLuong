'use client'

import React, { CSSProperties, FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import jwt from 'jsonwebtoken'
import classes from './login.module.css'
export default function LoginPage(){
    const loginMessage = localStorage.getItem('loginMessage');
    if(loginMessage){
      alert(loginMessage)
      localStorage.removeItem('loginMessage');
    }
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const router = useRouter();
    const payload = {
      email: email,
      role: 'user'
    };
    
    const options = {
      expiresIn: '1h' // Token hết hạn sau 1 giờ
    };
    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        if(email === 'truong@gmail.com' && password === '1'){
            const token = jwt.sign(payload, "asdadsadasdasdasddas")
            localStorage.setItem('token', token);
            router.push('/dashboard');
        }else{
            alert('Tài khoản hoặc mật khẩu không đúng');
        }
    };

   
    return(
        <div className={classes.container}>
        <form onSubmit={handleSubmit} className={classes.form}>
        <h1 className={classes.subject}>Phần mềm quản lý chấm công và tính lương</h1>
          <h4 className={classes.title}>Đăng nhập</h4>
          
            <input
            className={classes.inputStyle}
              type="email"
              id="email"
              value={email}
              placeholder="Nhập tài khoản"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
         
         
            <input
            className={classes.inputStyle}
              type="password"
              id="password"
              value={password}
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          
          <button type="submit" 
          className={classes.buttonStyle}>Đăng nhập</button>
        </form>
      </div>
    )
}


