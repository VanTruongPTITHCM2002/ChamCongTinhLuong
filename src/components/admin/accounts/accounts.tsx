'use client'
import { useEffect, useState } from 'react'
import classes from './accounts.module.css'
import axios from 'axios';
import { error } from 'console';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faPen, faRotateLeft, faSave, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AdminPageRoleProps } from '@/pages/api/admin/apiRole';
interface Account{
    username:string,
    role:string,
    status:string
}


const AdminAccountsPage:React.FC<AdminPageRoleProps> =({role}) =>{
    const router = useRouter();
    const [isUpdate,setIsUpdate] = useState(false);
    const [accountData,setAccountData] = useState<Account[]>([]);
    const [accounts,setAccounts] = useState<Account[]>([]);
    const [isNumber,setIsNumber] = useState<number>(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [tempStatus,setTempStatus] = useState('');
    const [originStatus,setOriginStatus] = useState('');
    const [tempRole,setTempRole] = useState('');
    const [originRole,setOriginRole] = useState('');
    const token = Cookies.get('token');

    


    const getAccounts = async ()=>{
        axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account`,{
            headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
        )
         // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/amount`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`
        //     }
        //   });
        .then(response=>{
            setAccountData(response.data.data);
            setAccounts(response.data.data);
        }).catch(error=>{
            console.error("Xảy ra lỗi khi lấy dữ liệu từ API");
        });
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        getAccounts();
    },[]);


  
    const totalPages = Math.ceil(accountData.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    
    const handleUpdateAccountStatus = (index:number)=>{
        console.log(index);
        setIsNumber(index);
        setIsUpdate(true);
    }

    const handleUpdateAccountStatusSave = async (account:Account,num?:number)=>{
        if(num === -1){
          
                const updatedData = currentData.map((acc, idx) => {
                    if (acc.username === account.username) {
                        return {
                            ...acc,
                            status: tempStatus !== originStatus ? originStatus: account.status,
                            role: tempRole !== originRole ? originRole: account.role
                        };
                    }
                    return acc;
                });
                setAccountData(updatedData);
            
            
            setIsUpdate(false);
            setIsNumber(-1);
            
            return;
        }
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account/${account.username}`,account,{
                 headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
            );
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
        setOriginStatus(updatedAccounts[index].status);
        updatedAccounts[index].status = newStatus;
        setTempStatus(newStatus);
        setAccountData(updatedAccounts);
      };

    const handleRoleChange = (index:number,newRole:string)=>{
        const updatedAccounts = [...accountData];
        setOriginRole(updatedAccounts[index].role);
        updatedAccounts[index].role = newRole;
        setTempRole(newRole);
        setAccountData(updatedAccounts);
    }

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
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account/${username}/reset_password`,{},{
                        headers: {
                            Authorization: `Bearer ${token}`
                          }
                    });
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
    const currentData = accountData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      const searchButton = ()=>{
        if(searchTerm === ''){
            setAccountData(accounts);
           
         }else{
            const filterdata = accounts.filter(
                (item) =>
                  item.username.includes(searchTerm) ||
                  item.status.includes(searchTerm)
                  || item.role.includes(searchTerm)
              );
          setAccountData(filterdata);
        }
      }
      const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };

      const btnShowListRolePermissons = ()=>{
        router.push("/admin/roles");
        return;
      }
    return (
        <div className={classes.article}>
        <h2>Bảng danh sách tài khoản của nhân viên</h2>
        <div className={classes.article_button}>
            {!isUpdate &&
            (
                <>
                        <input type="text" placeholder='Tìm kiếm...' 
                              value={searchTerm}
                              onChange={handleSearch}
                        />
                        <button onClick={searchButton}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>  
                </>
            )
            }
             
        </div>
       
        <table>
            <thead>
                <tr>
                <th>Tên tài khoản</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                {/* <th>Phân quyền</th> */}
                </tr>
            </thead>

            <tbody>
          
            {isNumber !== -1 ? (
    <tr key={isNumber}>
        <td>{accountData[isNumber].username}</td>
        <td>
         
            
            {isUpdate? (
                    <select name="" id=""
                    defaultValue={accountData[isNumber].role}
                    onChange={(e) => handleRoleChange(isNumber, e.target.value)}
                    >
                        {role.map((r, idx) => (
                            <option key={idx} value={r.roleDescription}>
                                {r.roleDescription}
                            </option>
                        ))}
                    </select>
                ):(
                    accountData[isNumber].role
                )}

        </td>
        <td>
            {isUpdate ? 
                (
                    <select 
                        aria-label='text' 
                        style={{ backgroundColor: "#fff", color: "#000" }} 

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
                        <FontAwesomeIcon icon={faPen} style={{ marginLeft: "5px" }} />
                    </button>
                    <button className={classes.btn_reset} onClick={() => handleResetPasswod(accountData[isNumber].username)}>
                        <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: "5px" }} />
                    </button>
                </div>
            )}
        </td>
    </tr>
) : (
    currentData.map((account, index) => (
        <tr key={index}>
            <td>{account.username}</td>
            <td>
                {isUpdate? (
                    <select name="" id=""
                    defaultValue={account.role}
                    >
                        {role.map((r, idx) => (
                            <option key={idx} value={r.rolename}>
                                {r.roleDescription}
                            </option>
                        ))}
                    </select>
                ):(
                        account.role
                )}
            </td>
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
                        <div className={account.status === 'Đang hoạt động' ? classes.statusActive : classes.statusInactive}>
                             {account.status}      
                        </div>
                       
                    )}
            </td> 
            <td>
                {isUpdate ? (
                    <div className={classes.btn}>
                        <button className={classes.btn_check} title='Đồng ý' onClick={() => handleUpdateAccountStatusSave(account)}>
                            <FontAwesomeIcon icon={faCheck} style={{ color: '#28a745' }} />
                        </button>
                        <button className={classes.btn_time} title='Hủy' onClick={() => handleUpdateAccountStatusSave(account, -1)}>
                            <FontAwesomeIcon icon={faTimes} style={{ color: '#dc3545' }} />
                        </button>
                    </div>
                ) : (
                    <div className={classes.btn}>
                        <button className={classes.btn_update} title='Sửa trạng thái' onClick={() => handleUpdateAccountStatus((currentPage - 1) * itemsPerPage + index)}>
                            <FontAwesomeIcon icon={faPen} style={{ marginRight: "5px" }} />
                        </button>
                        <button className={classes.btn_reset} title='Reset mật khẩu' onClick={() => handleResetPasswod(account.username)}>
                            <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: "5px" }} />
                        </button>
                    </div>
                )}
            </td>
            {/* <td><button className={classes.btnDetailPermissons}>
                <FontAwesomeIcon icon={faInfoCircle}/>
               </button></td> */}
        </tr>
    ))
)}
                </tbody>
        </table>

        <div className={classes.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? classes.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
            </div>
    )
}

export default AdminAccountsPage;