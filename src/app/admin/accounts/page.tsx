import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import AdminAccountsPage from '@/components/admin/accounts/accounts'
import { Suspense } from 'react'
export default function Account(){
    return (
        <div>
            <Navbar currentPath="/admin/accounts"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <AdminAccountsPage/>
            </Suspense>
            
            </div>
        </div>
    )
}