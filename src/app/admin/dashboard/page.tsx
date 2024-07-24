import AdminDashboard from "@/components/admin/dashboard";
import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
export default function Page(){
    
    return(
        <div>
            <Navbar currentPath="/admin/dashboard"/>
            <div className={classes.maincontainer}>
            <Header/>
            <AdminDashboard/>
            </div>
        </div>
    )
}