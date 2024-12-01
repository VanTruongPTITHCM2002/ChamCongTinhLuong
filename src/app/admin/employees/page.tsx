import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminEmployeesPage from "@/components/admin/employees/employees";
import { cookies } from "next/headers";

import { Suspense } from "react";
import { DepartmentsDTO, getServerSideDepartments } from "@/pages/api/admin/apiDepartments";
import { Employee, getServerSideEmployees } from "@/pages/api/admin/apiEmployee";
export default async function Page(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const response: DepartmentsDTO[] = await getServerSideDepartments(token!);
    const res: Employee[] = await getServerSideEmployees(token!);  
    return(
        <div>
            <Navbar currentPath="/admin/employees"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                 <AdminEmployeesPage departments = {response} employees={res}/>
            </Suspense>
           
            </div>
        </div>
    )
}