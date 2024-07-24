
import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminContract from "@/components/admin/contract/contract";

export default function Page(){
    
    return(
        <div>
            <Navbar  currentPath="/admin/contract"/>
            <div className={classes.maincontainer}>
            <Header/>
            <AdminContract/>
            </div>
        </div>
    )
}