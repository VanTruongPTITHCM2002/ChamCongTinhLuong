'use client'

import classes from './permissons.module.css'
import { AdminPageProps, PermissonsResponse } from '@/pages/api/admin/apiPermissons';
const  AdminPermissonsPage:React.FC<{permissons:PermissonsResponse[]}> = ({permissons})=>{

 
    return (
        <div className={classes.article}>
            {/* <table>
                <thead>
                    <th>Tên quyền</th>
                    <th>Mô tả</th>
                </thead>
                <tbody>
                        {permissons.map((p,index)=>(
                            <tr key={index}>
                                <td>{p.namepermisson}</td>
                                <td>{p.description}</td>
                            </tr>
                        ))}
                </tbody>
            </table> */}
        </div>
    )
}

export default AdminPermissonsPage