import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import AdminAccountsPage from '@/components/admin/accounts/accounts'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getServerSideRole, RoleResponse } from '@/pages/api/admin/apiRole'
export default async function Account(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const response: RoleResponse[] = await getServerSideRole(token!);  
    return (
        <div>
            <Navbar currentPath="/admin/accounts"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <AdminAccountsPage role = {response}/>
            </Suspense>
            
            </div>
        </div>
    )
}