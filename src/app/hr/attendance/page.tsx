import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import AdminAttendancePage from '@/components/admin/attendance/attendance'
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getServerSideAttendance } from '@/pages/api/admin/apiAttendance';
import HR_Navbar from '@/components/hr/navbar';
import HR_Header from '@/components/hr/header';
import HR_AttendancePage from '@/components/hr/attendance';
export default async function Account(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const attendanceResponse:Attendance[] = await getServerSideAttendance(token!);
    return (
        <div>
            <HR_Navbar currentPath="/hr/attendance"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
                 <HR_AttendancePage attendance = {attendanceResponse.reverse()}/>
            </Suspense>
           
            </div>
        </div>
    )
}