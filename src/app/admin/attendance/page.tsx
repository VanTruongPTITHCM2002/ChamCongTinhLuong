import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import AdminAttendancePage from '@/components/admin/attendance/attendance'
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getServerSideAttendance } from '@/pages/api/admin/apiAttendance';
export default async function Account(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const attendanceResponse:Attendance[] = await getServerSideAttendance(token!);
    return (
        <div>
            <Navbar currentPath="/admin/attendance"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                 <AdminAttendancePage attendance = {attendanceResponse.reverse()}/>
            </Suspense>
           
            </div>
        </div>
    )
}