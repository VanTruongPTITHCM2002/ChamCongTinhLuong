import Navbar from "@/components/admin/navbar";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Quản lý nhân viên",
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
  