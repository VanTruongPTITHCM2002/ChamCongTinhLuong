
import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import AdminRolesPage from '@/components/admin/roles'
import { getServerSideRole, RoleResponse } from '@/pages/api/admin/apiRole'
import { cookies } from 'next/headers'
import HR_Navbar from '@/components/hr/navbar'
import HR_Header from '@/components/hr/header'
import DepartmentPage from '@/components/hr/department'
import { Department, getServerSideDepartment } from '@/pages/api/hr/apiDepartment'
export default async function Roles(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const response: Department[] = await getServerSideDepartment(token!);  

    return (
        <div>
            <HR_Navbar currentPath="/hr/department"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
                {/* <AdminRolesPage role = {response}/> */}
                <DepartmentPage department={response}/>
            </Suspense>
            
            </div>
        </div>
    )
}