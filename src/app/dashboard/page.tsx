'use client'

import { useRouter} from "next/navigation"
import { CSSProperties, useEffect} from "react"
import styled from 'styled-components';
export default function DashboardPage(){
    const router = useRouter();
    useEffect(()=>{
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if(!isLoggedIn){
            router.push('/login');
        }
    },[router]);

    return (
        <div style={Container}>
            <div style={NavbarContainer}>
                <a style= {HyperLink} href="/dashboard">Trang chủ</a>
                <a  style= {HyperLink} href="/managestaff">Quản lý nhân viên</a>
                <a  style= {HyperLink} href="#">Quản lý chấm công</a>
                <a style= {HyperLink} href="#">Quản lý tính lương</a>
            </div>
        </div>
    )
}
const Container:CSSProperties={
    height:'100%',
    backgroundColor:'#DCDCDC',
}


const NavbarContainer:CSSProperties={
    width: '250px',
    height: '100vh',
    backgroundColor: '#66FF99',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
}

const HyperLink:CSSProperties={
    marginBottom:'10px',
}

