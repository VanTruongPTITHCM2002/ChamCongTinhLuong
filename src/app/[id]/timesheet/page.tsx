
import UserContainer from "@/components/user/container/container";

import UserNavbar from "@/components/user/navbar/navbar";
import UserTimeSheet from "@/components/user/timesheet/timesheet";

import { useRouter } from "next/navigation";


export default function Page(){

    return(
        <div>
         <UserNavbar currentPath = "timesheet"/>
         <UserContainer>
           <UserTimeSheet/>
          </UserContainer>
         
        </div>
    )
}