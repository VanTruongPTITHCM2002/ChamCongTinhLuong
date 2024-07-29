import UserContainer from "@/components/user/container/container";
import UserContract from "@/components/user/contract/contract";
import UserHeader from "@/components/user/header/header";
import UserNavbar from "@/components/user/navbar/navbar";

export default function Page(){
    
    return(
        <div>
         <UserNavbar currentPath = "contract"/>
         <UserContainer>
           <UserContract/>
          </UserContainer>
         
        </div>
    )
}