
import HR_Navbar from "@/components/hr/navbar";
import UserContainer from "@/components/user/container/container";
import classes from './style.module.css';
import UserNavbar from "@/components/user/navbar/navbar";
import UserProfile from "@/components/user/profile/profile";
import { useRouter } from "next/navigation";
import HR_Header from "@/components/hr/header";
import { Suspense } from "react";
import HR_Profile from "@/components/hr/profile";



export default function Page(){

    return(
        <div>
         <HR_Navbar currentPath = "/hr/profile"/>
         <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
              <HR_Profile/>
            </Suspense>
            
            </div>
         
        </div>
    )
}