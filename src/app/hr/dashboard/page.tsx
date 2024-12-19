import AdminDashboard from "@/components/admin/dashboard";
import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_Dashboard from "@/components/hr/dashboard";
import Script from "next/script";
import React from "react";
export default function Page(){
    
    return(
        <div>
            <HR_Navbar currentPath="/hr/dashboard" />
            <div className={classes.maincontainer}>
                <HR_Header />
                <HR_Dashboard />
                <div>
      <Script
        src="https://cdn.chatsimple.ai/ai-loader.js"
        strategy="lazyOnload"
      />

      {React.createElement('co-pilot', {
        'platform-id': 'afdfe2e5-b223-4fe5-a259-1f6dcf4e4098',
        'user-id': '2419129618417949',
        'chatbot-id': '0627f562-a386-479a-b22d-3a38748c44fb',
        'is-local': 'false',
      })}

      </div>
            </div>
        </div>
    )
}