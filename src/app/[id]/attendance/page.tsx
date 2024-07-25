import UserAttendance from "@/components/user/attedance/attendance";
import UserContainer from "@/components/user/container/container";

import UserNavbar from "@/components/user/navbar/navbar";

export default function Page(){
    
    return(
        <div>
         <UserNavbar currentPath = "attendance"/>
         <UserContainer>
          <UserAttendance/>
          </UserContainer>
         
        </div>
    )
}