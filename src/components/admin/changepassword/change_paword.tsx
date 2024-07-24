'use client'
import { useState } from 'react';
import classes from './change_password.module.css';
import jwt from 'jsonwebtoken'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
export default function AdminChangePassword(){
    const decoded:any = jwt.verify(String(localStorage.getItem('token')), String(process.env.NEXT_PUBLIC_SECRET_KEY));
    const router = useRouter();
   
    const [password,setPassword]= useState('');
    const [newpassword,setNewPassoword] = useState('');
    const [renewpassword,setReNewPassword] = useState('');
    // Lấy email từ payload
    const username = decoded.email;
 

    const handleChangePassword = async()=>{
        const data = {
            username: username,
            oldpassword:password,
            newpassword:newpassword

        }
        if(newpassword !== renewpassword){
          Swal.fire({
            title:"Thất bại",
            text:"Không trùng khớp",
            icon:'error'
        })
        return;
        }
        try{
            const response = await axios.put("http://localhost:8082/api/v1/account/change_password",data);
           
            Swal.fire({
              title:"Thành công",
              text:`${response.data.message}`,
              icon:'success'
            })
              localStorage.removeItem('token');
              router.push('/login');
      
        }catch(error:any){
            Swal.fire({
                title:"Thất bại",
                text:`${error.response.message}`,
                icon:'error'
            })
        }
    }
    return (
        <div className={classes.article}>

<form  className={classes.form}>
          <h4 className={classes.title}>Thay đổi mật khẩu</h4>
          
            <input
            className={classes.inputStyle}
              type="password"
           
     
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
             
              required
            />
         
         
            <input
            className={classes.inputStyle}
              type="password"
            
        
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setNewPassoword(e.target.value)}
            
              required
            />

<input
            className={classes.inputStyle}
              type="password"
             
           
              placeholder="Nhập lại mật khẩu mới"
              onChange={(e) => setReNewPassword(e.target.value)}
              defaultValue={''}
              required
            />
          
          <a
    href="#"
    className={classes.buttonStyle}
    onClick={(e) => {
        e.preventDefault();
        handleChangePassword();
    }}
>
    Thay đổi
</a>
        </form>

        </div>
    )
}