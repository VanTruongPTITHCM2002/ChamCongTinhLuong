import UserChangePassword from "@/components/user/changepassword/change_paword";
import UserContainer from "@/components/user/container/container";

import UserHeader from "@/components/user/header/header";
import UserNavbar from "@/components/user/navbar/navbar";

export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // Thay thế danh sách này bằng dữ liệu thực tế
  return ids.map((id) => ({ id }));
}

export default function Page({ params }: { params: { id: string } }) {
  return (
      <div>
          <UserNavbar currentPath="contract" />
          <UserContainer>
              <UserChangePassword />
          </UserContainer>
      </div>
  );
}