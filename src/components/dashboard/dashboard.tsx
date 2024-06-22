'use client'
import { useRouter} from "next/navigation"
import { CSSProperties, useEffect, useState} from "react"
import styled from 'styled-components';
import classes from './dashboard.module.css'


export default function DashboardPage(){
    // const router = useRouter();
    // useEffect(()=>{
    //     const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    //     if(!isLoggedIn){
    //         router.push('/login');
    //     }
    // },[router]);

    return (
        <div className={classes.container}>
            <div style={NavbarContainer}>
                <a className={classes.hyperlink} href="/dashboard">Trang chủ</a>
                <a  className={classes.hyperlink} href="/managestaff">Quản lý nhân viên</a>
                <a  className={classes.hyperlink} href="#">Quản lý chấm công</a>
                <a className={classes.hyperlink} href="#">Quản lý tính lương</a>
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

