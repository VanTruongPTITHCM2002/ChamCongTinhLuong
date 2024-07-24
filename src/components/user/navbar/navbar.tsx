'use client'
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
export default function UserNavbar({ currentPath } : any){
    const username = localStorage.getItem('username');
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>  
                {/* <img src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/> */}
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/>
            </div>
            <ul>
                <li className={currentPath === `/${username}/dashboard` ? classes.active : ""}>
                <Link href={`/${username}/dashboard`}>Trang chủ</Link>
                </li>
                <li className={currentPath === `/${username}/employees` ? classes.active : ""}>
                    <Link href={`/${username}/employees`}>Thông tin cá nhân</Link>
                </li>
                <li className={currentPath === `/${username}/workschedule` ? classes.active : ""}>
                    <Link href={`/${username}/workschedule`}>Lịch làm việc</Link>
                </li>
                <li className={currentPath === `/${username}/attendance` ? classes.active : ""}>
                    <Link href={`/${username}/attendance`}>Chấm công</Link>
                </li>
                <li className={currentPath === `/${username}/payroll` ? classes.active : ""}>
                    <Link href={`/${username}/payroll`}>Bảng lương</Link>
                </li>
                <li className={currentPath === `/${username}/rewardpunish` ? classes.active : ""}>
                    <Link href={`/${username}/rewardpunish`}>Bảng thưởng phạt</Link>
                </li>
                <li className={currentPath === `/${username}/contract` ? classes.active : ""}>
                    <Link href={`/${username}/contract`}>Hợp đồng lao động</Link>
                </li>
            </ul>
    </div>
    )
}