import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminEmployeesPage from "@/components/admin/employees/employees";
export default function Page(){
    
    return(
        <div>
            <Navbar/>
            <div className={classes.maincontainer}>
            <Header/>
            <AdminEmployeesPage/>
            </div>
        </div>
    )
}