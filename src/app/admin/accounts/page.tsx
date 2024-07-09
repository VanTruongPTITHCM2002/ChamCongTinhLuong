import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import AdminAccountsPage from '@/components/admin/accounts/accounts'
export default function Account(){
    return (
        <div>
            <Navbar/>
            <div className={classes.maincontainer}>
            <Header/>
            <AdminAccountsPage/>
            </div>
        </div>
    )
}