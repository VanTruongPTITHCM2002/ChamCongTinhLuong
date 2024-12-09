import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminPayrollPage from "@/components/admin/payroll/payroll";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_PayrollPage from "@/components/hr/payroll";
import { Suspense } from "react";


export default async  function AdminPayrollpage(){

    return(
        <div>
            <HR_Navbar currentPath="/hr/payroll"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
                <Suspense fallback={<div>Loading...</div>}>
                    <HR_PayrollPage />
                </Suspense>
      
            
            </div>
        </div>
    )
}

