'use client'

import React, { CSSProperties, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import jwt from 'jsonwebtoken'
import classes from './login.module.css'
import axios from "axios"
import Swal from "sweetalert2"
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
                localStorage.setItem('username',email);
                Swal.fire({
                  title: "Loading.....",
                  html: "Chương trình đang tải",
                  timer: 1000,
                  timerProgressBar: true,
                  didOpen: () => {
                    Swal.showLoading();
                  
                  },
                  willClose: () => {
                    router.push('/admin/dashboard');
                  }
                }).then((result) => {
                  /* Read more about handling dismissals below */
                  if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                  }
                });
                
                
                }
                  else{
                    // Swal.fire({
                    //   title: "Thất bại",
                    //   text: "Bạn không có quyền truy cập",
                    //   icon: "error"
                    // });
                    const payload = {
                      email: email,
                      role: response.data.data.role
                    };
                     const token = jwt.sign(payload, `${process.env.SECRET_KEY}`)
                  localStorage.setItem('token', token);
                  localStorage.setItem('username',email);
                  Swal.fire({
                    title: "Loading.....",
                    html: "Chương trình đang tải",
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                      Swal.showLoading();
                    
                    },
                    willClose: () => {
                      router.push(`/${email}/dashboard`);
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
                console.log("API Data:", data);
             
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
              id="email"
              value={email}
              placeholder="Nhập tài khoản"
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={''}
              required
            />
         
         
            <input
            className={classes.inputStyle}
              type="password"
              id="password"
              value={password}
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              defaultValue={''}
              required
            />
          
          <button type="submit" 
          className={classes.buttonStyle}>Đăng nhập</button>
        </form>
      </div>
    )
}


