import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminPayrollPage from "@/components/admin/payroll/payroll";
export default function AdminPayrollpage(){
    
    return(
        <div>
            <Navbar/>
            <div className={classes.maincontainer}>
            <Header/>
        <AdminPayrollPage/>
            </div>
        </div>
    )
}