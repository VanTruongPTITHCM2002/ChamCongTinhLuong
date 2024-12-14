import UserContainer from "@/components/user/container/container";
import UserDashboard from "@/components/user/dashboard/dashboard";
import UserHeader from "@/components/user/header/header";
import UserNavbar from "@/components/user/navbar/navbar";


export default function Page(){
    
    return(
        <div>
         <UserNavbar currentPath = "dashboard"/>
         <UserContainer>
            <UserDashboard/>
          </UserContainer>
         
        </div>
    )
}