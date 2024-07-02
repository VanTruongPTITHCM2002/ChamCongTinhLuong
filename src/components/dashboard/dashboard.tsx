'use client'
import { useRouter} from "next/navigation"
import { CSSProperties, useEffect, useState} from "react"
import styled from 'styled-components';
import classes from './dashboard.module.css'
import jwt,{ JwtPayload } from 'jsonwebtoken'

interface DecodedToken extends JwtPayload {
    email: string;
    role: string;
  }

export default function DashboardPage(){
    const router = useRouter();
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token){
            router.push('/login');
        }
        else{
            try{
                const decoded = jwt.verify(token,"asdadsadasdasdasddas") as DecodedToken;
                if(decoded.role === 'user'){
                    setIsAuthenticated(true);
                }else{
                    localStorage.setItem('loginMessage', 'Bạn không có quyền truy cập');
                    router.push('/login');
                }
            }catch(err){
                router.push('/login');
            }
            
        }
        
    },[router]);
    
        if(!isAuthenticated){
            return null;
        }
    return (
        <div className={classes.container}>
        <div className={classes.header}>
            <h1>My Application</h1>
        </div>
            <div className={classes.navbar}>
               <ul>
                <li><a href="/dashboard">Trang chủ</a></li>
                <li><a href="#">Quản lý tài khoản</a></li>
                <li><a href="#">Quản lý nhân viên</a></li>
                <li><a href="#">Quản lý lịch làm việc</a></li>
                <li><a href="#">Quản lý chấm công</a></li>
                <li><a href="#">Quản lý tính lương</a></li>
               </ul>
            </div>

            <div className={classes.article}>
               <table>
                    <thead>
                        <th>Mã nhân viên</th>
                        <th>Họ nhân viên</th>
                        <th>Tên nhân viên</th>
                        <th>Địa chỉ</th>
                        <th>Số điện thoại</th>
                        <th>CMND</th>
                        <th>Email</th>
                    </thead>

                    <tbody>
                        <td>NV001</td>
                        <td>Nguyễn Văn</td>
                        <td>Trường</td>
                        <td>60/1/2</td>
                        <td>08900809890</td>
                        <td>012313123123</td>
                        <td>trerq@gmail.com</td>
                    </tbody>
               </table>
            </div>
        </div>
    )
}



