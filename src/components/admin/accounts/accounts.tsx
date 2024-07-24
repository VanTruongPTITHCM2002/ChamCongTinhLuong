'use client'
import { useEffect, useState } from 'react'
import classes from './accounts.module.css'
import axios from 'axios';
import { error } from 'console';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPen, faRotateLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Account{
    username:string,
    role:string,
    status:string
}


export default function AdminAccountsPage(){
    const [isUpdate,setIsUpdate] = useState(false);
    const [accountData,setAccountData] = useState<Account[]>([]);
    const [isNumber,setIsNumber] = useState<number>(-1);
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

    const handleUpdateAccountStatus = (index:number)=>{
        setIsNumber(index);
        setIsUpdate(true);
    }

    const handleUpdateAccountStatusSave = async (account:Account,num?:number)=>{
        if(num === -1){
            setIsUpdate(false);
            setIsNumber(-1);
            return;
        }
        try {
            const response = await axios.put(`http://localhost:8082/api/v1/account/${account.username}`,account);
            if (response.status === 200) {
                Swal.fire({
                    title: "Thành công",
                    text: `${response.data.message}`,
                    icon: "success"
                  });
            }
          } catch (error) {
            console.error("Xảy ra lỗi", error);
          }
        setIsUpdate(false);
        setIsNumber(-1);
    }
    const handleStatusChange = (index:number, newStatus:string) => {
        const updatedAccounts = [...accountData];
        updatedAccounts[index].status = newStatus;
        setAccountData(updatedAccounts);
      };

    const handleResetPasswod = async (username: string)=>{
       Swal.fire({
            title: "Bạn có chắc chắn muốn reset mật khẩu cho tài khoản này?",
            text: "Bạn sẽ không thể khôi phục mật khẩu trước đó",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có",
            cancelButtonText:"Hủy",
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`http://localhost:8082/api/v1/account/${username}/reset_password`);
                    if (response.status === 200) {
                      Swal.fire({
                          title: "Thành công",
                          text: `${response.data.message}`,
                          icon: "success"
                        });
                    }
                  } catch (error) {
                    Swal.fire({
                      title:"Thất bại",
                      text: "Đã có lỗi xảy ra",
                      icon:"error"
                    })
                  }
            
            }
          });
       
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
          
            {isNumber !== -1 ? (
    <tr key={isNumber}>
        <td>{accountData[isNumber].username}</td>
        <td>{accountData[isNumber].role}</td>
        <td>
            {isUpdate ? 
                (
                    <select 
                        aria-label='text' 
                        style={{ backgroundColor: "#fff", color: "#000" }} 
                        id="status" 
                        name="status" 
                        defaultValue={accountData[isNumber].status} 
                        onChange={(e) => handleStatusChange(isNumber, e.target.value)}
                    >
                        <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                        <option value="Đang hoạt động">Đang hoạt động</option>
                    </select>
                ) : (
                    accountData[isNumber].status
                )}
        </td> 
        <td>
            {isUpdate ? (
                <div className={classes.btn}>
                    <button className={classes.btn_check} onClick={() => handleUpdateAccountStatusSave(accountData[isNumber])}>
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#28a745' }} />
                    </button>
                    <button className={classes.btn_time} onClick={() => handleUpdateAccountStatusSave(accountData[isNumber], -1)}>
                        <FontAwesomeIcon icon={faTimes} style={{ color: '#dc3545' }} />
                    </button>
                </div>
            ) : (
                <div className={classes.btn}>
                    <button className={classes.btn_update} onClick={() => handleUpdateAccountStatus(isNumber)}>
                        <FontAwesomeIcon icon={faPen} style={{ marginRight: "5px" }} />
                    </button>
                    <button className={classes.btn_reset} onClick={() => handleResetPasswod(accountData[isNumber].username)}>
                        <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: "5px" }} />
                    </button>
                </div>
            )}
        </td>
    </tr>
) : (
    accountData.map((account, index) => (
        <tr key={index}>
            <td>{account.username}</td>
            <td>{account.role}</td>
            <td>
                {isUpdate ? 
                    (
                        <select 
                            aria-label='text' 
                            style={{ backgroundColor: "#fff", color: "#000" }} 
                            id="status" 
                            name="status" 
                            defaultValue={account.status} 
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                        >
                            <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                            <option value="Đang hoạt động">Đang hoạt động</option>
                        </select>
                    ) : (
                        account.status
                    )}
            </td> 
            <td>
                {isUpdate ? (
                    <div className={classes.btn}>
                        <button className={classes.btn_check} onClick={() => handleUpdateAccountStatusSave(account)}>
                            <FontAwesomeIcon icon={faCheck} style={{ color: '#28a745' }} />
                        </button>
                        <button className={classes.btn_time} onClick={() => handleUpdateAccountStatusSave(account, -1)}>
                            <FontAwesomeIcon icon={faTimes} style={{ color: '#dc3545' }} />
                        </button>
                    </div>
                ) : (
                    <div className={classes.btn}>
                        <button className={classes.btn_update} onClick={() => handleUpdateAccountStatus(index)}>
                            <FontAwesomeIcon icon={faPen} style={{ marginRight: "5px" }} />
                        </button>
                        <button className={classes.btn_reset} onClick={() => handleResetPasswod(account.username)}>
                            <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: "5px" }} />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    ))
)}
                </tbody>
        </table>
            </div>
    )
}