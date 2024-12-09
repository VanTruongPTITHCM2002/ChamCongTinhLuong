import UserContainer from "@/components/user/container/container";

import UserHeader from "@/components/user/header/header";
import UserSalary from "@/components/user/listsalary/listsalary";
import UserNavbar from "@/components/user/navbar/navbar";

export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // Thay thế danh sách này bằng dữ liệu thực tế
  return ids.map((id) => ({ id }));
}
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