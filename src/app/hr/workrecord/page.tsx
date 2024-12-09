
import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getServerSideWorkRecord, WorkRecordResponse } from '@/pages/api/admin/apiWorkRecord'
import AdminWorkRecord from '@/components/admin/workrecord'
import { Employee, getServerSideEmployeesActive } from '@/pages/api/admin/apiEmployee'
import HR_Navbar from '@/components/hr/navbar'
import HR_Header from '@/components/hr/header'
import HR_WorkRecord from '@/components/hr/workrecord'
export default async function WorkRecord(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const wrk: WorkRecordResponse[] = await getServerSideWorkRecord(token!);
    const res: Employee[] = await getServerSideEmployeesActive(token!);  
    return (
        <div>
            <HR_Navbar currentPath="/hr/workrecord"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
               <HR_WorkRecord wrk={wrk} employee= {res}/>
            </Suspense>
            
            </div>
        </div>
    )
}