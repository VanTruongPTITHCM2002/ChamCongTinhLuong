import UserContainer from "@/components/user/container/container";

import UserHeader from "@/components/user/header/header";
import UserSalary from "@/components/user/listsalary/listsalary";
import UserNavbar from "@/components/user/navbar/navbar";


export default function Page(){
    
    return(
        <div>
         <UserNavbar currentPath = "listsalary"/>
         <UserContainer>
            <UserSalary/>
          </UserContainer>
         
        </div>
    )
}