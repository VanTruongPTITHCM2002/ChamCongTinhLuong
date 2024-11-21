
import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import AdminRolesPage from '@/components/admin/roles'
import { getServerSideRole, RoleResponse } from '@/pages/api/admin/apiRole'
import { cookies } from 'next/headers'
export default async function Roles(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const response: RoleResponse[] = await getServerSideRole(token!);  

    return (
        <div>
            <Navbar currentPath="/admin/roles"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <AdminRolesPage role = {response}/>
            </Suspense>
            
            </div>
        </div>
    )
}