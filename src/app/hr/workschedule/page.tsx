import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import WorkSchedule from "@/components/admin/workschedule/workschedule";
import { cookies } from "next/headers";
import { Employee, getServerSideEmployeesActive } from "@/pages/api/admin/apiEmployee";
import { Suspense } from "react";
import { getServerSideWorkSchedule } from "@/pages/api/admin/apiWorkSchedule";
import HR_WorkSchedule from "@/components/hr/workschedule";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
export default async function Page(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const res: Employee[] = await getServerSideEmployeesActive(token!);  
    const workscheduleResponse: WorkSchedule[] = await getServerSideWorkSchedule(token!);
    return(
        <div>
            <HR_Navbar currentPath="/hr/workschedule"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
                <Suspense fallback={<div>Loading...</div>}>
                    <HR_WorkSchedule employee = {res} workschedule={workscheduleResponse}/>
                </Suspense>
            
            </div>
        </div>
    )
}