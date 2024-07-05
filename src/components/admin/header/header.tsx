'use client'
import { useRouter } from "next/navigation";
import classes from "./header.module.css";
export default function Header(){
    const router = useRouter();
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        router.push('/login');
    }
    return (
        <div className={classes.header}>
        <button className={classes.btn_logout} onClick={handleLogout}>Đăng xuất</button>
    </div>
    )
}