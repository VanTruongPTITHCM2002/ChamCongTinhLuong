"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './contract.module.css'
import { faInfo, faMagnifyingGlass, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import React, { FormEvent, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Modal from '@/components/modal';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { errorSwal } from '@/custom/sweetalert';
import Cookies from 'js-cookie'
import { Contract } from '@/pages/api/admin/apiContract';
import { Employee } from '@/pages/api/admin/apiEmployee';
import { addAuditLogServer } from '@/pages/api/admin/apiAuditLog';
import { format } from 'date-fns';




const formattedAmount = (num:Float32Array | number)=>{
    return  num.toLocaleString('vi-VN', {
     style: 'currency',
     currency: 'VND',
   });
 }
 function formatDateString(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
const HR_Contract:React.FC<{contract:Contract[],employee: Employee[]}> =({contract,employee}) =>{
    const token = Cookies.get('token');
    const router = useRouter();
    const [modal,setModal] = useState(false);
    const [idEmployee,setIdEmployee] = useState<string[]>([]);
    const [selectedIdEmployee, setSelectedIdEmployee] = useState<string>('');
    const [searchId, setSearchId] = useState<string>('');
    let username = '';
    if(typeof window !=='undefined' ){
        username = localStorage.getItem('username')!;
    }
    const [formData, setFormData] = useState({
        idemployee: '',
        basicsalary: 0,
        workingdays: 0,
        leavedays: 0,
        startdate: '',
        endate: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUpdate,setIsUpdate] = useState(false);
 
    
   
    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    
        const selectedId = event.target.value;
        setSelectedIdEmployee(selectedId);
    };

    const closeModal = ()=>{
       
        setFormData({
            idemployee: '',
            basicsalary: 0,
            workingdays: 0,
            leavedays:0,
            startdate: '',
            endate: '',
        });
        setModal(false);
    }
    const showFormAdd = ()=>{

        setModal(true);
        setIsUpdate(false);
    }
    const addContract = async(event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('form_add_contract') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        

    
        const form = new FormData(formElement);
      
        const contract:Contract ={
            idemployee:form.get('manv') as string,
            basicsalary: Number(form.get('basic') as string),
            workingdays: Number(form.get('work') as string),
            leavedays: Number(form.get('leavedays') as string),
            startdate: form.get('startdate') as string,
            endate: form.get('endate') as string,
        } 
        if (contract.basicsalary=== null || contract.basicsalary.toString().trim() === "" || 
    contract.workingdays === null || contract.workingdays.toString().trim() === "" || 
    contract.startdate === null || contract.startdate.trim() === "" || 
    contract.endate === null || contract.endate.trim() === "") {
    errorSwal('Thất bại', 'Vui lòng không bỏ trống');
    return;
}
    const startdateDate = new Date(contract.startdate);
    const endateDate = new Date(contract.endate);

    // Kiểm tra nếu endate nhỏ hơn startdate
    if (endateDate < startdateDate) {
        // Hiển thị thông báo lỗi
        
        Swal.fire({
            title:"Thất bại",
            text:"Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.",
            icon:"error"
       })
        return;
    }
        try{
            const response =  await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/contract`,contract,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            if(response.status === 201){
               Swal.fire({
                    title:"Thành công",
                    text:`${response.data.message}`,
                    icon:"success"
               })
                   await addAuditLogServer({
                         username:username!,
                         action:"Tạo hợp đồng lao đồng",
                         description:"Nhân viên " + username + " đã thực hiện tạo hợp đồng lao động cho nhân viên " + contract.idemployee,
                         createtime:format(new Date(), 'dd/MM/yyyy HH:mm:ss')
                     })
            //    setShowContract(prevContract => [...prevContract, contract]);
               setModal(false);
               router.refresh();
            }
        }catch(error:any){
            Swal.fire({
                title:"Thất bại",
                text:`${error.response.data.message}`,
                icon:"error"
           })
           setModal(false);
        }
     
    }
    const updateContract =(contract:Contract)=>{
        setFormData({
            idemployee: contract.idemployee,
            basicsalary: contract.basicsalary,
            workingdays: contract.workingdays,
            leavedays: contract.leavedays,
            startdate: contract.startdate,
            endate: contract.endate,
        });
        setIsUpdate(true);
        setModal(true);
    }

    const handleInputChange = (event:any) => {
        setSearchId(event.target.value);
    };

    const SaveUpdateContract = async(event:FormEvent)=>{
        
            event.preventDefault();
            const formElement = document.getElementById('form_update_contract') as HTMLFormElement;
            if (!formElement) {
                console.error('Form element not found');
                return;
            }
        
            const form = new FormData(formElement);
            const contract:Contract ={
                idemployee:form.get('manv') as string,
                basicsalary: Number(form.get('basic') as string),
                workingdays: Number(form.get('work') as string),
                leavedays: Number(form.get('leavedays') as string),
                startdate: form.get('startdate') as string,
                endate: form.get('endate') as string,
            
            } 
            const data = {
                oldContractReqeust: {
                    idemployee: formData.idemployee,
                    basicsalary: formData.basicsalary,
                    workingdays: formData.workingdays,
                    startdate:formData.startdate,
                    endate: formData.endate
                },
                newContractRequest: {
                    idemployee: contract.idemployee,
                    basicsalary: contract.basicsalary,
                    workingdays: contract.workingdays,
                    startdate: contract.startdate,
                    endate: contract.endate
                }
            };
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/contract`, data,{
                    headers: {
                        Authorization: `Bearer ${token}`  
                      }
                });
                if (response.status === 200) {
                    Swal.fire({
                        title: "Thành công",
                        text: "Sửa hợp đồng thành công",
                        icon: "success",
                    });

                    await addAuditLogServer({
                        username:username!,
                        action:"Sửa hợp đồng lao đồng",
                        description:"Nhân viên " + username + " đã thực hiện sửa hợp đồng lao động của nhân viên " + contract.idemployee,
                        createtime:format(new Date(), 'dd/MM/yyyy HH:mm:ss')
                    })
             
                }
                setModal(false);
                setIsUpdate(false);
                
            } catch (error) {
                console.error('Xảy ra lỗi trong quá trình sửa hợp đồng');
            }
      
    }
    
    const totalPages = Math.ceil(contract.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    const currentData =searchTerm ? contract.filter(
        (item) =>
          item.idemployee.includes(searchTerm) ||
            item.workingdays === Number(searchTerm)
            || item.startdate.includes(searchTerm)
            || item.endate.includes(searchTerm)
            || item.status?.toString().includes(searchTerm)
        
      ): contract.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

const showInfo = ()=>{
    Swal.fire({
        title: "Thông báo quy tắc khi ký hợp đồng lao động",
        html: "- Không được ký hợp đồng khi nhân viên đó chưa hoạt động<br>" +
        "- Vui lòng chọn ngày bắt đầu ký là ngày đầu tiên của tháng, ngày kết thúc là ngày cuối trong tháng đó<br>" +
        "- Chỉ cho nghỉ phép tối đa 5 ngày với hợp đồng dưới 1 năm và tối đa là 12 ngày đối với hợp đồng trên 1 năm"
        ,
        icon: "info",
    });
}
        
      
   
    return(
        <div className={classes.article}>
             <h2 style={{textAlign:"center"}}>Quản lý hợp đồng lao động</h2>
               <div className={classes.article_button}>
                
                    <input type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                     placeholder='Tìm kiếm...'
                    />
                     <button onClick={showInfo} style={{backgroundColor:"orange"}}>
                            <FontAwesomeIcon icon={faInfo} style={{width:"10px",
                               height:"10px"}}/>
                     </button>
                     <button   
                    onClick={showFormAdd}
                    ><FontAwesomeIcon icon={faPlus}  style={{width:"10px",
                               height:"10px"
                       }}
                     
                       /></button>    
                   
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Lương cơ bản</th>
                        <th>Số ngày công</th>
                        <th>Số ngày phép</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {currentData.map((c,index)=>(
                             <tr key={index}>
                             <td>{c.idemployee}</td>
                             <td>{ formattedAmount (c.basicsalary)}</td>
                             <td>{c.workingdays}</td>
                             <td>{c.leavedays}</td>
                             <td>{formatDateString(c.startdate)}</td>
                             <td>{ formatDateString(c.endate)}</td>
                             <td  className={c.status === "Còn hợp đồng" ? classes.statusActive : classes.statusInactive}
                             >{c.status}</td>
                             <td>
                                 <div className={classes.button_update_delete}>
                                         
                                         <button  disabled={c.status === 'Hết hợp đồng'} className={classes.button_update}
                                             onClick={()=>updateContract(c)}
                                         ><FontAwesomeIcon icon={faPen} style={{width:"10px",
                                height:"10px"
                        }}/></button>
                                 </div>
 
                             </td>
                             </tr>
                    ))}
               
                </tbody>
            </table>
                
            <div id="modal-root"> {modal && (
                <Modal onClose={closeModal}>
                    {isUpdate ? (
                        <form id='form_update_contract' className={classes.form_add_salary}>
                    <div className={classes.form_title}>
                        <h2>Sửa hợp đồng lao động</h2>
                    </div>

                    <div>
                        <label htmlFor="manv">Mã nhân viên:</label>
                        <input
                            id='manv'
                            name='manv'
                            value={formData.idemployee}
        
                        >
                           
                        </input>
                    </div>

                    <div>
                        <label htmlFor='basic'>Lương cơ bản:</label>
                        <input
                            type="number"
                            name="basic"
                            id="basic"
                           
                            defaultValue={formData.basicsalary}
                          
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='work'>Số ngày công:</label>
                        <input
                            id='work'
                            name='work'
                            type='number'
                          
                            defaultValue={formData.workingdays}
                            
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor='work'>Số ngày phép:</label>
                        <input
                            id='leavedays'
                            name='leavedays'
                            type='number'
                          
                            defaultValue={formData.leavedays}
                            
                            required
                        />
                    </div>

                    <div className={classes.timecontract}>
                        <div>
                            <label htmlFor='startdate'>Ngày bắt đầu:</label>
                            <input
                                type='date'
                                id='startdate'
                                name='startdate'
                                defaultValue={formData.startdate}
                               readOnly
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='endate'>Ngày kết thúc:</label>
                            <input
                                type='date'
                                id='endate'
                                name='endate'
                                defaultValue={formData.endate}
                               readOnly
                                required
                            />
                        </div>
                    </div>

                    <div className={classes.form_add_salary_button}>
                        <button className={classes.btnSave} onClick={SaveUpdateContract}>Lưu</button>
                        <button className={classes.btnCancel} onClick={closeModal}>Hủy</button>
                    </div>
                </form>

                    )
                    : (
                        <form id='form_add_contract' className={classes.form_add_salary}>
                        <div className={classes.form_title}>
                        <h2>Thêm hợp đồng lao động</h2>
                        </div>
                      
                        <div>
                            <label htmlFor="manv">Mã nhân viên:</label>
                        <select id='manv' name='manv'  
                        value={selectedIdEmployee}
                onChange={handleSelectChange} 
                required>
                                            {employee.map((e,index) => (
                                                <option key={index} value={e.idEmployee}>
                                                    {e.idEmployee}
                                                </option>
                                            ))}
                                    </select>
                        </div>

                        <div>
                            <label htmlFor='basic'>Lương cơ bản:</label>
                            <input type="number" name="basic" id="basic" min={0} required/>
                        </div>

                        <div>
                            <label htmlFor='work'>Số ngày công:</label>
                            <input id='work' name='work' type='number'  min={0} max={26} required/>
                        </div>
                        
                        
                        <div>
                            <label htmlFor='work'>Số ngày phép:</label>
                            <input id='leavedays' name='leavedays' type='number'  min={0} max={15} required/>
                        </div>

                        <div className={classes.timecontract}>
                        <div>
                            <label htmlFor='reason'>Ngày bắt đầu:</label>
                                <input type='date' id='startdate' name='startdate' required/>
                            </div>

                            <div>
                            <label htmlFor='date'>Ngày kết thúc:</label>
                                <input type='date' id='endate' name='endate' required
                                // value={formattedDate}
                                />
                            </div>
                            </div>
                        <div className={classes.form_add_salary_button}>
                            <button  className={classes.btnSave}
                       onClick={addContract}
                            >Thêm</button>
                            <button className={classes.btnCancel}
                            onClick={closeModal}
                            >Hủy</button>
                        </div>
                    </form>

                    )}
                   
                </Modal>
)}
        </div>
     
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


export default HR_Contract;