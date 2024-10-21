'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import classes from './login.module.css'
import Image from 'next/image'
import  { FetchAccount } from "@/pages/api/login/apiLogin"
import { errorAlert, errorSwal } from "@/custom/sweetalert"


interface ErrorForm{
  username:string;
  password:string;
}

export default function LoginPage(){
  const [error, setError] = useState<ErrorForm>();
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
    
  const validateForm = () => {

    let errors: ErrorForm = {
      username: '',
      password: ''
    }

    if (!username) {
      errors.username = 'Tài khoản không được để trống';
    }

    if (!password) {
      errors.password = 'Mật khẩu không được để trống';
    }
    setError(errors);
  }
 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if(username === ' ' || password === ''){
    validateForm();
    return;
  }


  const data:AccountRequest = {
    username:username,
    password:password
    }

   try{
      const response =  await FetchAccount(data,router);
      if(response.status === 200){
  
        if (response.data.data.status === 0) {
          errorAlert('Bạn không thể đăng nhập');
          router.push('/login');
          return;
        }
          if(response.data.data.role === process.env.NEXT_PUBLIC_ROLE_A){
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('username', response.data.data.username);
            router.push('/admin/dashboard');
          }else{
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('username', response.data.data.username);
            router.push(`/${response.data.data.username}/dashboard`);
          }
      }
   }catch(error:any){
       if(error.response === undefined){
              errorAlert("Không thể kết nối đến server....") 
              return;
          }
          errorSwal("Thất bại",`${error.response.data.message}`)
   }

   
    };

    return(
        <div className={classes.container}>
        <Image src={"/images/background.jpg"} alt='Hình nền'  layout='fill' quality={100} />
        <form onSubmit={handleSubmit} className={classes.form}>
        <h1 className={classes.subject}>Ứng dụng chấm công và tính lương</h1>
          <h4 className={classes.title}>Đăng nhập</h4>

          <input
            className={classes.inputStyle}
            type="text"
            name="username"
            value={username}
            placeholder="Nhập tài khoản"
            onChange={(e) => {
              setusername(e.target.value)
              setError({
                username: '',
                password: error?.password || ""
              })
            }}
            />
            {error?.username  && (
              <p className={classes.errorInput}>{error.username}</p>
            )}
         
          <input
            className={classes.inputStyle}
            type="password"
            name="password"
            value={password}
            placeholder="Nhập mật khẩu"
            onChange={(e) => {
              setPassword(e.target.value);
              setError({
                username: error?.username || "",
                password: ''
              });
            }}
            />
            {error?.password && (
              <p  className={classes.errorInput}>{error.password}</p>
            )}

            <div className={classes.forgotPassword}>Quên mật khẩu</div>

          <button type="submit" 
          className={classes.buttonStyle}>Đăng nhập</button>
        </form>
      </div>
    )
}


