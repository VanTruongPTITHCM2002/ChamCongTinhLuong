
import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getServerSideAttedanceExplain } from '@/pages/api/admin/apiAttendance_Explain'
import AdminAttendanceExplainPage from '@/components/admin/attendance_explain'

export default async function WorkRecord(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
   const explain:AttendanceExplain[] = await getServerSideAttedanceExplain(token!);
    return (
        <div>
            <Navbar currentPath="/admin/attendance-explain"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <AdminAttendanceExplainPage attendanceExplain = {explain}/>
            </Suspense>
            
            </div>
        </div>
    )
}