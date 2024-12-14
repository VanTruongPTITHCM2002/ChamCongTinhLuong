'use client'
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'
export default function Navbar({ currentPath } : any){
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAttendance,setIsOpenAttendance] = useState(false);
    useEffect(() => {
        const savedState = Cookies.get("menuState");
        const savedStateAttendance = Cookies.get('OpenAttendance')
        if (savedState) {
            setIsOpen(savedState === "true"); // Cookies lưu trạng thái dạng string
        }
        if(savedStateAttendance){
            setIsOpenAttendance(savedStateAttendance === "true");
        }
    }, []);
    
    const toggleMenu = () => {
        const newState = !isOpen;
        setIsOpen(newState); // Toggle trạng thái
        Cookies.set("menuState", newState.toString());
    };

    const toggleMenuAttendance = ()=>{
        const newState = !isOpenAttendance;
        setIsOpenAttendance(newState); // Toggle trạng thái
        Cookies.set("OpenAttendance", newState.toString());
    }
    const handleSubItemClick = (e : any) => {
        e.stopPropagation(); 
        
    };
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example" width="50" height="50" />
            </div>
            <ul>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/dashboard" ? classes.active : ""}`}>
                    <Link href="/admin/dashboard">Trang chủ</Link>
                </li>
                <li className={`${classes.subMenu} ${classes.listOptionMenu}`} onClick={toggleMenu}>
                    <a className={classes.subDrop}>
                        <span>Quản lý tài khoản</span>
                        <span className={classes.arrowList}>
                            {isOpen ? <FontAwesomeIcon icon={faCircleChevronDown} /> : <FontAwesomeIcon icon={faCircleChevronRight} />}
                        </span>
                    </a>
                    <ul className={`${classes.subMenuItem} ${isOpen ? classes.open : ''}`}>
                        <li className={`${currentPath === "/admin/accounts" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/accounts">Tài khoản</Link>
                        </li>
                        <li className={`${currentPath === "/admin/roles" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/roles">Vai trò</Link>
                        </li>
                    </ul>
                </li>
                {/* <li className={`${classes.listOptionMenu} ${currentPath === "/admin/employees" ? classes.active : ""}`}>
                    <Link href="/admin/employees">Quản lý nhân viên</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/workschedule" ? classes.active : ""}`}>
                    <Link href="/admin/workschedule">Quản lý lịch làm việc</Link>
                </li>
                <li className={`${classes.subMenu} ${classes.listOptionMenu}`} onClick={toggleMenuAttendance}>
                    <a className={classes.subDrop}>
                        <span>Quản lý chấm công</span>
                        <span className={classes.arrowList}>
                            {isOpenAttendance ? <FontAwesomeIcon icon={faCircleChevronDown} /> : <FontAwesomeIcon icon={faCircleChevronRight} />}
                        </span>
                    </a>
                    <ul className={`${classes.subMenuItem} ${isOpenAttendance ? classes.open : ''}`}>
                        <li className={`${currentPath === "/admin/attendance" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/attendance">Danh sách chấm công</Link>
                        </li>
                        <li className={`${currentPath === "/admin/workrecord" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/workrecord">Danh sách công tháng</Link>
                        </li>
                        <li className={`${currentPath === "/admin/attendance-explain" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/attendance-explain">Danh sách giải trình chấm công</Link>
                        </li>
                    </ul>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/payroll" ? classes.active : ""}`}>
                    <Link href="/admin/payroll">Quản lý tính lương</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/rewardpunish" ? classes.active : ""}`}>
                    <Link href="/admin/rewardpunish">Quản lý thưởng phạt</Link>
                </li>
                 <li className={`${classes.listOptionMenu} ${currentPath === "/admin/leaverequest" ? classes.active : ""}`}>
                    <Link href="/admin/leaverequest">Quản lý nghỉ phép</Link>
                </li> 
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/contract" ? classes.active : ""}`}>
                    <Link href="/admin/contract">Quản lý hợp đồng lao động</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/notification" ? classes.active : ""}`}>
                    <Link href="/admin/notification">Quản lý thông báo</Link>
                </li> */}
                {/* <li className={`${classes.subMenu} ${classes.listOptionMenu}`} onClick={toggleMenuAttendance}>
                    <a className={classes.subDrop}>
                        <span>Báo cáo thống kê</span>
                        <span className={classes.arrowList}>
                            {isOpenAttendance ? <FontAwesomeIcon icon={faCircleChevronDown} /> : <FontAwesomeIcon icon={faCircleChevronRight} />}
                        </span>
                    </a>
                    <ul className={`${classes.subMenuItem} ${isOpenAttendance ? classes.open : ''}`}>
                        <li className={`${currentPath === "/admin/attendance" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/attendance">Báo cáo tổng quan tài khoản</Link>
                        </li>
                        <li className={`${currentPath === "/admin/workrecord" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/workrecord">Báo cáo tổng quan nhân sự</Link>
                        </li>
                        <li className={`${currentPath === "/admin/attendance-explain" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/attendance-explain">Danh sách giải trình chấm công</Link>
                        </li>
                    </ul>
                </li> */}
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/audit-log" ? classes.active : ""}`}>
                <Link href="/admin/audit-log">Nhật ký hoạt động hệ thống</Link>
                </li>
            </ul>
        </div>
    )
}