'use client'
import classes from './roles.module.css'

interface RoleResponse{
        
}

export default function AdminRolesPage(){


    return (
        <div className={classes.article}>
            <table>
                <thead>
                    <th>Tên vai trò</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Phạm vi</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </thead>

                <tbody>
                   <td></td>
                   <td></td>
                   <td></td>
                   <td></td>
                   <td></td>
                   <td></td>
                </tbody>
            </table>
        </div>
    )
}