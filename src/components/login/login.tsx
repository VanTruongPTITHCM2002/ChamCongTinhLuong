'use client'
import { cookies } from 'next/headers'
import React, { CSSProperties, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import jwt from 'jsonwebtoken'
import classes from './login.module.css'
import axios from "axios"
import Swal from "sweetalert2"
import { errorSwal } from "../user/custom/sweetalert"
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});



export default function LoginPage(){
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
    
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const router = useRouter();
    
    
 
    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        const data = {
      username:email,
      password:password
    }

        axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/auth/login`,data)
            .then(response => {
               
               if(response.status === 200){
                if(response.data.data.role === 'ADMIN'){
                 
               
                Swal.fire({
                  title: "Loading.....",
                  html: "Chương trình đang tải",
                  timer: 1000,
                  timerProgressBar: true,
                  didOpen: () => {
                    Swal.showLoading();
                  
                  },
                  willClose: () => {
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('username',response.data.data.username);
                 
                    router.push('/admin/dashboard');
                  }
                }).then((result) => {
                  /* Read more about handling dismissals below */
                  if (result.dismiss === Swal.DismissReason.timer) {
                   
                  }
                });
                
                
                }
                  else{
                    if (response.data.data.status === 0) {
                      errorSwal('Thất bại', "Bạn không thể đăng nhập");
                      router.push('/login');
                      return;
                  }
  
                    
                  localStorage.setItem('token', response.data.data.token);
                  localStorage.setItem('username',response.data.data.username);
                  Swal.fire({
                    title: "Loading.....",
                    html: "Chương trình đang tải",
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                      Swal.showLoading();
                    
                    },
                    willClose: () => {
                      router.push(`/${response.data.data.username}/dashboard`);
                    }
                  }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                      console.log("I was closed by the timer");
                    }
                  });
                  
                  }
               }
               
            })
            .then(data => {
               
             
            })
            .catch(error => {
              
                if (error.response.status === 404) {
                  Swal.fire({
                    title: "Thất bại",
                    text: `${error.response.data.message}`,
                    icon: "error"
                  });
                } else if (error.response.status === 400) {
                  Swal.fire({
                    title: "Thất bại",
                    text: `${error.response.data.message}`,
                    icon: "error"
                  });
                }
                
            });
      
    };

   
    return(
        <div className={classes.container}>
        <form onSubmit={handleSubmit} className={classes.form}>
        <h1 className={classes.subject}>Ứng dụng chấm công và tính lương</h1>
          <h4 className={classes.title}>Đăng nhập</h4>
          
            <input
            className={classes.inputStyle}
              type="text"
             
              name="username"
              value={email}
              placeholder="Nhập tài khoản"
              onChange={(e) => setEmail(e.target.value)}
             
              required
            />
         
         
            <input
            className={classes.inputStyle}
              type="password"
            
              name="password"
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


