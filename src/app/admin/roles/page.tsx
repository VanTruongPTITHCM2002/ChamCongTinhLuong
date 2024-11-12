import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import AdminRolesPage from '@/components/admin/roles'
export default function Roles(){
    return (
        <div>
            <Navbar currentPath="/admin/roles"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <AdminRolesPage/>
            </Suspense>
            
            </div>
        </div>
    )
}