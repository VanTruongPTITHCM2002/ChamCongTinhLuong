import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import WorkSchedule from "@/components/admin/workschedule/workschedule";
import { cookies } from "next/headers";
import { Employee, getServerSideEmployeesActive } from "@/pages/api/admin/apiEmployee";
import { Suspense } from "react";
import { getServerSideWorkSchedule } from "@/pages/api/admin/apiWorkSchedule";
export default async function Page(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const res: Employee[] = await getServerSideEmployeesActive(token!);  
    const workscheduleResponse: WorkSchedule[] = await getServerSideWorkSchedule(token!);
    return(
        <div>
            <Navbar currentPath="/admin/workschedule"/>
            <div className={classes.maincontainer}>
            <Header/>
                <Suspense fallback={<div>Loading...</div>}>
                    <WorkSchedule employee = {res} workschedule={workscheduleResponse}/>
                </Suspense>
            
            </div>
        </div>
    )
}