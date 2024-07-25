import UserDashboard from '../dashboard/dashboard'
import UserHeader from '../header/header'
import classes from './container.module.css'
interface UserContainerProps {
  children: React.ReactNode;
}
const UserContainer: React.FC<UserContainerProps> = ({ children }) =>{
    return (
        <div className={classes.maincontainer}>
           <UserHeader/>
            {children}
            </div>
    )
}
export default UserContainer;