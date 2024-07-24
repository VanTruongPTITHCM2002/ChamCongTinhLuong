'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './rewardpunish.module.css'
import { faMagnifyingGlass, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FormEvent, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Modal from '@/components/modal/modal';
import Swal from 'sweetalert2';
interface RewardPunish{
    idemployee:string;
    type:string;
    cash:number;
    reason:string;
    setupdate:string;
    status?:string;
}
interface IFEmployee{
    idemployee:string;
}
export default function AdminRewardPunishPage(){
    const[showRewardPunish,setShowRewardPunish] = useState<RewardPunish[]>([]);
    const [modal,setModal] = useState(false);
    const[isAdd,setIsAdd] = useState(false);
    const [isUpdate,setIsUpdate] = useState(false);
    const [type,setType] = useState<String>('');
    const [searchId, setSearchId] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [selectedIdEmployee, setSelectedIdEmployee] = useState<string>('');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const getAll = async ()=>{
        try{
            const response =  await axios.get("http://localhost:8086/api/v1/rewardpunish");
            if(response.status === 200){
                setShowRewardPunish(response.data.data);
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

    const closeModal = ()=>{
        setModal(false);
    }
    const showFormAdd =()=>{
        getIDemployee();
        setModal(true);
    }
    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    
        const selectedId = event.target.value;
        setSelectedIdEmployee(selectedId);
    };

    const addRewardPunish =async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('form_add_reward_punish') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
    
        const form = new FormData(formElement);
        const rewardPunish:RewardPunish ={
            idemployee:form.get('manv') as string,
            type: form.get('type') as string,
            cash: Number(form.get('cash') as string),
            reason: form.get('reason') as string,
            setupdate: form.get('date') as string,
            status: "Tồn tại"
        }
        try{
            const response =  await axios.post("http://localhost:8086/api/v1/rewardpunish",rewardPunish);
            if(response.status === 201){
               Swal.fire({
                    title:"Thành công",
                    text:"Thêm thưởng phạt thành công",
                    icon:"success"
               })
               setShowRewardPunish(prevRewardPunish => [...prevRewardPunish, rewardPunish]);
               setModal(false);
            }
        }catch(error){
            console.error('Xảy ra lỗi trong quá trình tải dữ liệu')
        }
     
    }
    const deleteRewardPunish = async(rewardPunish:any)=>{
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Bạn sẽ không thể khôi phục lại",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có",
            cancelButtonText:"Hủy",
          }).then(async (result) => {
            if (result.isConfirmed) {
               
             
        try{
            rewardPunish.status = "Đã xóa";
            const response =  await axios.delete("http://localhost:8086/api/v1/rewardpunish",{
                data: rewardPunish,
            });
            if(response.status === 200){
               Swal.fire({
                    title:"Thành công",
                    text:"Xóa thành công",
                    icon:"success"
               })
               setShowRewardPunish(prevRewardPunish => 
                prevRewardPunish.filter(item => ((item.idemployee === rewardPunish.idemployee) && (item.reason ===
                    rewardPunish.reason) && (item.setupdate === rewardPunish.setupdate)
                ))
            );
              
            }
        }catch(error){
            console.error('Xảy ra lỗi trong quá trình tải dữ liệu')
        }
            }
          });
      
    }
    const handleInputChange = (event:any) => {
        setSearchId(event.target.value);
    };
    const searchPayrollByid = async ()=>{
     
        try {
            let response:AxiosResponse<any, any>
            if(searchId.trim() === ''){
              response = await axios.get("http://localhost:8086/api/v1/rewardpunish");
            }else{
             response = await axios.get(`http://localhost:8086/api/v1/rewardpunish/${searchId}`);
            }
            if(response.status === 200){
            
                setShowRewardPunish(response.data.data);
             }
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
       
    }
    return (
        <div className={classes.article}>
            <div className={classes.article_button}>
                <div className={classes.article_button_search}>
                    <input type="text" value={searchId}
                    onChange={handleInputChange}
                    />
                    <button onClick={searchPayrollByid}
                    ><FontAwesomeIcon icon={faMagnifyingGlass} 
                       
                       style={{width:"10px",
                               height:"10px"
                       }}/></button>
                </div>

                <div className={classes.article_button_add}>
                    <button   onClick={showFormAdd}><FontAwesomeIcon icon={faPlus}  style={{width:"10px",
                               height:"10px"
                       }}
                     
                       /></button>    
                </div>                  
            </div>

     
                <table>
                    <thead>
                        <tr>
                            <th>Mã nhân viên</th>
                            <th>Loại</th>
                            <th>Số tiền</th>
                            <th>Lý do</th>
                            <th>Ngày thiết lập</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {showRewardPunish.map((r,index)=>(
                            <tr key={index}>
                            <td>{r.idemployee}</td>
                            <td>{r.type}</td>
                            <td>{r.cash}</td>
                            <td>{r.reason}</td>
                            <td>{r.setupdate}</td>
                            <td>
                                <div className={classes.button_update_delete}>
                                        
                                        <button className={classes.button_delete}
                                            onClick={()=>deleteRewardPunish(r)}
                                        ><FontAwesomeIcon icon={faTrash} style={{width:"10px",
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
                    <form id='form_add_reward_punish' className={classes.form_add_salary}>
                        <div className={classes.form_title}>
                        <h2>Thêm thưởng phạt</h2>
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
                            <label htmlFor='type'>Loại:</label>
                           <select id ='type' name = 'type'>
                                       <option value="Thưởng">Thưởng</option>
                                       <option value="Phạt">Phạt</option>         
                           </select>
                        </div>

                        <div>
                            <label htmlFor='cash'>Số tiền:</label>
                            <input id='cash' name='cash' type='number' required/>
                        </div>
                        <div>
                            <label htmlFor='reason'>Lý do:</label>
                                <input type='text' id='reason' name='reason'/>
                            </div>

                            <div>
                            <label htmlFor='date'>Ngày thực hiện:</label>
                                <input type='date' id='date' name='date' 
                                value={formattedDate}
                                />
                            </div>
                          
                        <div className={classes.form_add_salary_button}>
                            <button  
                           onClick={addRewardPunish}
                            >Thêm</button>
                            <button 
                            onClick={closeModal}
                            >Hủy</button>
                        </div>
                    </form>
                </Modal>
)}
        </div>
        </div>
    )
}