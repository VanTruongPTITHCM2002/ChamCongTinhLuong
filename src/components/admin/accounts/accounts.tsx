'use client'
import { useEffect, useState } from 'react'
import classes from './accounts.module.css'
import axios from 'axios';
import { error } from 'console';

interface Account{
    username:string,
    role:string,
    status:string
}

export default function AdminAccountsPage(){
    const [isUpdate,setIsUpdate] = useState(false);
    const [accountData,setAccountData] = useState<Account[]>([]);
    const getAccounts = async ()=>{
        axios.get('http://localhost:8082/api/v1/account')
        .then(response=>{
            setAccountData(response.data.data);
        }).catch(error=>{
            console.error("Xảy ra lỗi khi lấy dữ liệu từ API");
        });
    }

    useEffect(()=>{
        getAccounts();
    },[]);

    const handleUpdateAccountStatus = ()=>{
        setIsUpdate(true);
    }

    const handleUpdateAccountStatusSave = async (account:Account)=>{
        try {
            const response = await axios.put(`http://localhost:8082/api/v1/account/${account.username}`,account);
            if (response.status === 200) {
              alert('Thay đổi trạng thái thành công');
            }
          } catch (error) {
            console.error("Xảy ra lỗi", error);
          }
        setIsUpdate(false);
    }
    const handleStatusChange = (index:number, newStatus:string) => {
        const updatedAccounts = [...accountData];
        updatedAccounts[index].status = newStatus;
        setAccountData(updatedAccounts);
      };

    const handleResetPasswod = async (username: string)=>{
        if (window.confirm("Bạn có chắc chắn muốn reset mật khẩu cho tài khoản này?")) {
            try {
              const response = await axios.put(`http://localhost:8082/api/v1/account/${username}/reset_password`);
              if (response.status === 200) {
                alert("Reset mật khẩu thành công");
              }
            } catch (error) {
              console.error("Xảy ra lỗi", error);
            }
          } 
    }

    return (
        <div className={classes.article}>
        <table>
            <thead>
                <tr>
                <th>Tên tài khoản</th>
                <th>Quyền hạn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                        {accountData.map((account,index) => (
                        <tr key = {index}>
                            <td>{account.username}</td>
                            <td>{account.role}</td>
                            <td>{isUpdate ? 
                                (
                                    <select aria-label='text' id = "status" name = "status" defaultValue={account.status} onChange={(e) => handleStatusChange(index, e.target.value)}>
                                        <option value= "Ngưng hoạt động">Ngưng hoạt động</option>
                                        <option value = "Đang hoạt động">Đang hoạt động</option>
                                    </select>
                                ) : (account.status)}
                                
                                </td> 
                            <td>
                                {isUpdate? (<div className={classes.btn}>
                                            <button className={classes.btn_update} onClick={() => handleUpdateAccountStatusSave(account)}>Lưu</button>
                                            </div>):(
                                        <div className={classes.btn}>
                                            <button className={classes.btn_update} onClick={() => handleUpdateAccountStatus()}>Cập nhật</button>
                                            <button className={classes.btn_update} onClick={() => handleResetPasswod(account.username)}>Reset mật khẩu</button>
                                        </div>
                                )}
                               
                                
                            </td>
                        </tr>
                        ))}
                </tbody>
        </table>
            </div>
    )
}