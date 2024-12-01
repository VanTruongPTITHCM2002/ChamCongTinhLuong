import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Quản lý công tháng",
    description: "Generated by create next app",
  };
  
  export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
          {children}
          </div>
    );
  }