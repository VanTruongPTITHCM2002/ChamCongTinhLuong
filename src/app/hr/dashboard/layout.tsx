import Navbar from "@/components/admin/navbar";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Trang chủ",
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
  