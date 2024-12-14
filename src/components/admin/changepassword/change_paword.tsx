'use client'
import { useState } from 'react';
import classes from './change_password.module.css';
import Cookies from 'js-cookie'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { errorSwal } from '@/custom/sweetalert';
export default function AdminChangePassword(){
    
    const router = useRouter();
   
    const [password,setPassword]= useState('');
    const [newpassword,setNewPassoword] = useState('');
    const [renewpassword,setReNewPassword] = useState('');
    // Lấy email từ payload

    const username = localStorage.getItem('username');
 
  
    const token = Cookies.get('token')

    const handleChangePassword = async()=>{
        const data = {
            username: username,
            oldpassword:password,
            newpassword:newpassword

        }

        if(data.username === '' || data.newpassword === '' || data.oldpassword === ''){
            errorSwal('Thất bại','Không được bỏ trống');
            return;
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
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/public/account/change_password`,data,
              {
                headers: {
                        Authorization: `Bearer ${token}`
                      }
              }
            );
           
            Swal.fire({
              title:"Thành công",
              text:`${response.data.message}`,
              icon:'success'
            })
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              router.push('/login');
      
        }catch(error:any){
            Swal.fire({
                title:"Thất bại",
                text:`${error.response.data.message}`,
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