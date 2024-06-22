import Image from "next/image";
import styles from "./page.module.css";
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    useEffect(()=>{
      router.push('/login');
    },[router])
  );
  return null;
}
