'use client'

import React, { CSSProperties, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import jwt from 'jsonwebtoken'
import classes from './login.module.css'
import axios from "axios"
export default function LoginPage(){
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
    const loginMessage = localStorage.getItem('loginMessage');
    if(loginMessage){
      alert(loginMessage)
     const storage = localStorage.removeItem('loginMessage');
    }
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const router = useRouter();
    
    
    const options = {
      expiresIn: '1h' // Token hết hạn sau 1 giờ
    };
    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        const data = {
      username:email,
      password:password
    }

        axios.post('http://localhost:8082/api/v1/auth/login',data)
            .then(response => {
               console.log('Dữ liệu:',response.data)
               if(response.status === 200){
                if(response.data.data.role === 'ADMIN'){
                  const payload = {
                    email: email,
                    role: response.data.data.role
                  };
                   const token = jwt.sign(payload, "asdadsadasdasdasddas")
                localStorage.setItem('token', token);
                router.push('/admin/dashboard');
                }
                  else{
                    alert('Bạn không có quyền đăng nhập');
                  }
               }
               
            })
            .then(data => {
                console.log("API Data:", data);
             
            })
            .catch(error => {
              
                if (error.response.status === 404) {
                  alert('Không tìm thấy tài khoản');
                } else if (error.response.status === 400) {
                  alert('Tài khoản hoặc mật khẩu không đúng');
                }
                
            });
      
    };

   
    return(
        <div className={classes.container}>
        <form onSubmit={handleSubmit} className={classes.form}>
        <h1 className={classes.subject}>Phần mềm quản lý chấm công và tính lương</h1>
          <h4 className={classes.title}>Đăng nhập</h4>
          
            <input
            className={classes.inputStyle}
              type="text"
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


