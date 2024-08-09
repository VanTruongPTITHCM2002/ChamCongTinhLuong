
'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './contract.module.css'
import { faMagnifyingGlass, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FormEvent, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Modal from '@/components/modal';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { errorSwal } from '@/components/user/custom/sweetalert';
interface Contract{
    idemployee:string;
    basicsalary:number;
    workingdays:number;
    startdate:string;
    endate:string;
    status?:string;
}
interface IFEmployee{
    idemployee:string;
}

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
export default function AdminContract(){

    const [showContract,setShowContract] = useState<Contract[]>([]);
    const [contracts,setContracts] = useState<Contract[]>([]);
    const [modal,setModal] = useState(false);
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [selectedIdEmployee, setSelectedIdEmployee] = useState<string>('');
    const [searchId, setSearchId] = useState<string>('');
    const [formData, setFormData] = useState({
        idemployee: '',
        basicsalary: 0,
        workingdays: 0,
        startdate: '',
        endate: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUpdate,setIsUpdate] = useState(false);
    const getAll = async ()=>{
        try{
            const response =  await axios.get("http://localhost:8087/api/v1/contract");
            if(response.status === 200){
                setShowContract([...response.data.data].reverse());
                setContracts([...response.data.data].reverse());
            }
        }catch(error){
            console.error('Xảy ra lỗi trong quá trình tải dữ liệu')
        }
    }
    const getIDemployee = async ()=>{
        try {
            const response = await axios.get('http://localhost:8085/api/v1/payroll/getidemployee');
            console.log(response.data);
            setIdEmployee(response.data);
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
    
    }
   
    useEffect(()=>{
        getAll();
    },[])
    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    
        const selectedId = event.target.value;
        setSelectedIdEmployee(selectedId);
    };

    const closeModal = ()=>{
       
        setFormData({
            idemployee: '',
            basicsalary: 0,
            workingdays: 0,
            startdate: '',
            endate: '',
        });
        setModal(false);
    }
    const showFormAdd = ()=>{
        getIDemployee();
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
            const response =  await axios.post("http://localhost:8087/api/v1/contract",contract);
            if(response.status === 201){
               Swal.fire({
                    title:"Thành công",
                    text:`${response.data.message}`,
                    icon:"success"
               })
               setShowContract(prevContract => [...prevContract, contract]);
               setModal(false);
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
                const response = await axios.put("http://localhost:8087/api/v1/contract", data);
                if (response.status === 200) {
                    Swal.fire({
                        title: "Thành công",
                        text: "Sửa hợp đồng thành công",
                        icon: "success",
                    });
                    setShowContract(prevContract => {
                        const updateContract = prevContract.map(contract => {
                            if ((contract.idemployee === data.newContractRequest.idemployee)
                            && (contract.startdate === data.newContractRequest.startdate)
                        && (contract.endate === data.newContractRequest.endate)) {
                                return { ...contract, ...data.newContractRequest };
                            }
                            return contract;
                        });
                        return updateContract;
                    });
                    // Reset form hoặc thực hiện các thao tác khác
                }
                setModal(false);
                setIsUpdate(false);
            } catch (error) {
                console.error('Xảy ra lỗi trong quá trình sửa hợp đồng');
            }
      
    }
    const searchContractByid = async ()=>{
        try {
            let response:AxiosResponse<any, any>
            if(searchId.trim() === ''){
              response = await axios.get("http://localhost:8087/api/v1/contract");
            }else{
             response = await axios.get(`http://localhost:8087/api/v1/contract/${searchId}`);
            }
            if(response.status === 200){
            
                setShowContract(response.data.data);
             }
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
           
        }
       
    }
    const totalPages = Math.ceil(showContract.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    const currentData = showContract.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      const searchButton = ()=>{
        if(searchTerm === ''){
            setShowContract(contracts);
           
         }else{
            const filterdata = contracts.filter(
                (item) =>
                  item.idemployee.includes(searchTerm) ||
                    item.workingdays === Number(searchTerm)
                    || item.startdate.includes(searchTerm)
                    || item.endate.includes(searchTerm)
                    || item.status?.toString().includes(searchTerm)
                
              );
          setShowContract(filterdata);
        }
      }
      const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };
    return(
        <div className={classes.article}>
             <h2 style={{textAlign:"center"}}>Quản lý hợp đồng lao động</h2>
               <div className={classes.article_button}>
                <div className={classes.article_button_search}>
                    <input type="text" 
                    value={searchTerm}
                    onChange={handleSearch} 
                     placeholder='Tìm kiếm...'
                    />
                    <button 
                    onClick={searchButton}
                    ><FontAwesomeIcon icon={faMagnifyingGlass} 
                       
                       style={{width:"10px",
                               height:"10px"
                       }}/></button>
                </div>

                <div className={classes.article_button_add}>
                    <button   
                    onClick={showFormAdd}
                    ><FontAwesomeIcon icon={faPlus}  style={{width:"10px",
                               height:"10px"
                       }}
                     
                       /></button>    
                </div>                  
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Lương cơ bản</th>
                        <th>Số ngày công</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {currentData.map((contract,index)=>(
                             <tr key={index}>
                             <td>{contract.idemployee}</td>
                             <td>{ formattedAmount (contract.basicsalary)}</td>
                             <td>{contract.workingdays}</td>
                             <td>{formatDateString(contract.startdate)}</td>
                             <td>{ formatDateString(contract.endate)}</td>
                             <td  className={contract.status === "Còn hợp đồng" ? classes.statusActive : classes.statusInactive}
                             >{contract.status}</td>
                             <td>
                                 <div className={classes.button_update_delete}>
                                         
                                         <button  disabled={contract.status === 'Hết hợp đồng'} className={classes.button_update}
                                             onClick={()=>updateContract(contract)}
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
                                            {idEmployee.map((employee) => (
                                                <option key={employee.idemployee} value={employee.idemployee}>
                                                    {employee.idemployee}
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
                            <input id='work' name='work' type='number'  min={0} required/>
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