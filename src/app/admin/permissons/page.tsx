import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import AdminPermissonsPage from '@/components/admin/permissons'

export default function Roles(){
    return (
        <div>
            <Navbar currentPath="/admin/permissons"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <AdminPermissonsPage/>
            </Suspense>
            
            </div>
        </div>
    )
}