import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import AdminPermissonsPage from '@/components/admin/permissons'
import { getServerSidePermissons, PermissonsResponse } from '@/pages/api/admin/apiPermissons'



export default async function Roles(){
    // const response:PermissonsResponse[] = await getServerSidePermissons();
    return (
        <div>
            <Navbar currentPath="/admin/permissons"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                {/* <AdminPermissonsPage permissons={response!}/> */}
            </Suspense>
            
            </div>
        </div>
    )
}