
import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getServerSideWorkRecord, WorkRecordResponse } from '@/pages/api/admin/apiWorkRecord'
import AdminWorkRecord from '@/components/admin/workrecord'
import { Employee, getServerSideEmployeesActive } from '@/pages/api/admin/apiEmployee'
export default async function WorkRecord(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const wrk: WorkRecordResponse[] = await getServerSideWorkRecord(token!);
    const res: Employee[] = await getServerSideEmployeesActive(token!);  
    return (
        <div>
            <Navbar currentPath="/admin/workrecord"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
               <AdminWorkRecord wrk={wrk} employee= {res}/>
            </Suspense>
            
            </div>
        </div>
    )
}