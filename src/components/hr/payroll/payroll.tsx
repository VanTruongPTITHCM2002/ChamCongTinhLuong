'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './payroll.module.css'
import { faCalculator, faDeleteLeft, faEye, faFileExcel, faMagnifyingGlass, faMoneyBill, faPen } from '@fortawesome/free-solid-svg-icons'
import { FormEvent, useEffect, useState } from 'react'
import Modal from '@/components/modal'
import axios, { AxiosResponse } from 'axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
import { errorSwal, successSwal } from '@/custom/sweetalert'
import Cookies from 'js-cookie'

const payrollCustom = {
    width: '50%', // Tùy chỉnh độ rộng của modal
    height: '50%', // Tùy chỉnh chiều cao của modal
};
interface IFEmployee{
    idemployee:string;
}


interface SalaryRequest{
   idEmployee?:string;
   listEmployee?:string[],
    month: number;
    year:number;
    datecreated:string;
    status:string;
}

export interface Payroll{
    idEmployee:string;
    month:number;
    year:number;
    basicSalary:number;
    day_work:Float32Array;
    reward:number;
    punish:number;
    createDate:string;
    totalPayment:Float32Array;
    status:string;
}

interface AdminPayrollPageProps {
    showPay: Payroll[];
}

export const formattedAmount = (num:Float32Array | number | undefined)=>{
   return  num!.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}

function formatDate(dateString:string) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

const HR_PayrollPage = () =>{
    const token = Cookies.get('token');
    const [modal,setModal] = useState(false);
    const [showDetail,setShowDetail] = useState(false);
    const [num,setNum] = useState<number>(-1);
    const [selectedIdEmployee, setSelectedIdEmployee] = useState<string>('');
    const [searchId, setSearchId] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [showPayroll,setShowPayroll] = useState<Payroll[]>([]);
    const [showPay,setShowPay] = useState<Payroll[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const today = new Date();

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll`,{
                    headers: {
                        Authorization: `Bearer ${token}`  
                      }
                });
                setShowPayroll(response.data.data);
                setShowPay(response.data.data);
            } catch (error) {
                console.error('Error fetching payroll data:', error);
            }
        };
        
        fetchPayroll();
      
    }, []);
   // setShowPayroll(showPay);
    // Định dạng ngày thành YYYY-MM-DD

    
    const formattedDate = today.toISOString().split('T')[0];
    const showModalAddSalary = ()=>{
        getIDemployee();
        setModal(true);
    }

    const closeModal = ()=>{
        setModal(false);
    }


    const getIDemployee = async ()=>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/getidemployee`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            console.log(response.data);
            setIdEmployee(response.data);
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
    
    }

    const calculateSalary = async(event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('form_add_salary') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
    
        const form = new FormData(formElement);
        const payrollRes:SalaryRequest ={
            listEmployee:idEmployee.map(employee => employee.idemployee),
            month: Number(form.get('month') as string),
            year: Number(form.get('year') as string),
            datecreated: form.get('date') as string,
            status: form.get('status') as string
        }
      if((form.get('month') as string).trim() === '' || (form.get('year') as string).trim() === ''){
            errorSwal('Thất bại','Không được bỏ trống');
            return;
      }
        const date = new Date();
        if(payrollRes.year > date.getFullYear()){
            Swal.fire({
                title: "Thất bại",
                text: "Vui lòng chọn năm hiện tại",
                icon: "error"
              });
            return;
        }
      
        if(payrollRes.month !== (date.getMonth()+1)){
            Swal.fire({
                title: "Thất bại",
                text: "Vui lòng chọn tháng hiện tại",
                icon: "error"
              });
            return;
        }
        console.log(idEmployee.map(employee => employee.idemployee))
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/many`,
             payrollRes
                ,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
          
  
     
            Swal.fire(
                {
                    title:"Thành công",
                    text:`${response.data.message}`,
                    icon:"success"
                }
            )


          //  setShowPayroll([response.data.data,...showPayroll]);
           window.location.reload();

      
        
        
        } catch (error:any) {
            if (error.response) {
                // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
                Swal.fire(
                    {
                        title:"Thất bại",
                        text:`${error.response.data.message}`,
                        icon:"error"
                    }
                )
               
            }
            
        }
        setModal(false);
    }

    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    
        const selectedId = event.target.value;
        setSelectedIdEmployee(selectedId);
    };

    const showDetailSalary = (index:number)=>{
        setNum(index);
        setShowDetail(true);
        localStorage.setItem('index',String(index));
    }

    const closeDetail = ()=>{
        setNum(-1);
        localStorage.removeItem('index');
    }
  
    const updateStatus = async (index:number)=>{
        if(showPayroll[index].status === 'Đã thanh toán'){
            errorSwal('Thất bại','Lương nhân viên đã được thanh toán');
            return;
        }
        const paymentResponse = await fetch('/api/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: showPayroll[index].totalPayment, orderId: 'mmkk'}),
          });

          if (paymentResponse.ok) {
            const paymentUrl = await paymentResponse.json();
            window.location.href = paymentUrl;// Chuyển hướng đến URL thanh toán của VNPAY
            
           
            
            if(showPayroll[index].status === 'Chưa thanh toán'){
                showPayroll[index].status = 'Đã thanh toán';
                const salary:SalaryRequest ={
                    idEmployee: showPayroll[index].idEmployee,
                    month: Number(showPayroll[index].month),
                    year: Number(showPayroll[index].year),
                    datecreated: showPayroll[index].createDate,
                    status:showPayroll[index].status
                }
                
                try {
                    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll`,salary,{
                        headers: {
                            Authorization: `Bearer ${token}`  
                          }
                    });
                    if(response.status === 200){
                    // Swal.fire(
                    //     {
                    //         title:"Thành công",
                    //         text:`${response.data.message}`,
                    //         icon:"success"
                    //     }
                    // )
                
                    setShowDetail(false);
                }
                
                } catch (error) {
                    console.error('Error fetching id employee:', error);
                }
            }
          } else {
            alert('Có lỗi xảy ra khi tạo đơn hàng!');
          }
       
    }
    const searchPayrollByid = async ()=>{
     
        try {
            let response:AxiosResponse<any, any>
            if(searchId.trim() === ''){
              response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll`,
                {
                                headers: {
                                    Authorization: `Bearer ${token}`  
                                  }
                            });
            }else{
             response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/${searchId}`,
                {
                                headers: {
                                    Authorization: `Bearer ${token}`  
                                  }
                            });
            }
            if(response.status === 200){
            
                setShowPayroll(response.data.data);
             }
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
       
    }

    const handleInputChange = (event:any) => {
        setSearchId(event.target.value);
    };

    const totalPages = Math.ceil(showPayroll.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    const currentData = showPayroll.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      const searchButton = ()=>{
        if(searchTerm === ''){
            setShowPayroll(showPay);
           
         }else{
            const filterdata = showPay.filter(
                (item) =>
                  item.idEmployee.includes(searchTerm) ||
                  item.month === Number(searchTerm)
                  || item.year === Number(searchTerm) 
                 
                
                
              );
          setShowPayroll(filterdata);
        }
      }
      const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };

      const downloadExcel = ()=>{
        const processedData = showPayroll.map(item => ({
            'Mã nhân viên': item.idEmployee,
            'Tháng': item.month,
            'Năm': item.year,
            'Lương cơ bản': formattedAmount(item.basicSalary),
            'Số công thực tế': item.day_work.toString(), // Chuyển đổi Float32Array thành chuỗi
            'Thưởng':formattedAmount(item.reward),
            'Phạt': formattedAmount(item.punish),
            'Ngày tính lương': formatDate(item.createDate),
            'Tổng lương': formattedAmount(item.totalPayment), // Chuyển đổi Float32Array thành chuỗi
            'Trạng thái': item.status
          }));
      
          // Chuyển đổi dữ liệu thành worksheet
          const worksheet = XLSX.utils.json_to_sheet(processedData);
      
          // Tạo workbook chứa worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
          // Xuất file Excel
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
          // Tạo liên kết tải xuống
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'payroll_report.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      };

  
    return (
        <div className={classes.article}>
             <h2 style={{textAlign:"center"}}>Quản lý tính lương</h2>
            <div className={classes.article_option}>
            {num !== -1 ? (
                <>
                   <div className={classes.article_option_search}>
                   <button className={classes.btnCalculateSalary}
                   onClick={()=>updateStatus(num)}
                   >
                    <FontAwesomeIcon icon={faMoneyBill} />
                    Thanh toán</button>
                
                </div> 
               <div className={classes.article_option_button}>
                   <button className={classes.article_option_button_back}
                       onClick={closeDetail}
                   ><FontAwesomeIcon icon={faDeleteLeft} 
                    style={{width:"12px",
                               height:"12px",
                            marginRight:"10px"}}
                   />Quay lại</button>
               </div>
        
                </>
                 
            )
            :(
                <>
                    <div className={classes.article_option_search}>
                        <input type="text" 
                         value={searchTerm}
                         onChange={handleSearch} 
                         placeholder='Tìm kiếm....'
                        style={{paddingLeft:"5px"}}
                        />
                        <button className={classes.article_option_search_button}  onClick={searchButton}>   <FontAwesomeIcon icon={faMagnifyingGlass} 
                       
                        style={{width:"10px",
                                height:"10px"
                        }}/></button>
                </div>

                <div className={classes.article_option_button}>

                        <button className={classes.downLoadExcel} onClick={downloadExcel} title='Xuát file excel'><FontAwesomeIcon icon={faFileExcel}
                          style={{width:"20px",
                            height:"15px",
                         
                            }}
                        /></button>

                    <button className={classes.article_option_button_calsalary}
                        onClick={showModalAddSalary} title="Tính lương"
                    ><FontAwesomeIcon icon={faCalculator} 
                     style={{width:"10px",
                                height:"10px"}}
                    /></button>
                </div>
                </>
            )}
                
                    
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Mã nhân viên</th>
                        <th>Tháng</th>
                        <th>Năm</th>
                        {num !== -1 ? (
                <>
                    <th>Thưởng</th>
                    <th>Phạt</th>
                    <th>Lương cơ bản</th>
                    <th>Số ngày công</th>
                    <th>Ngày tạo</th>
                    <th>Tổng lương</th>
                    <th>Trạng thái</th>
                </>
            ) : (
                <>
                <th>Tổng lương</th>
                <th>Thao tác</th>
                </>
                
            )}
                        
                    </tr>
                </thead>

                <tbody>

                {num !== -1 && showPayroll[num] ? (
            <tr key={showPayroll[num].idEmployee}>
                <td>{showPayroll[num].idEmployee}</td>
                <td>{showPayroll[num].month}</td>
                <td>{showPayroll[num].year}</td>
               <td>{formattedAmount (showPayroll[num].reward)}</td>
               <td>{formattedAmount(showPayroll[num].punish)}</td>
               <td>{formattedAmount(showPayroll[num].basicSalary)}</td>
               <td>{showPayroll[num].day_work}</td>
               <td>{formatDate(showPayroll[num].createDate)}</td>
               
                <td>{formattedAmount(showPayroll[num].totalPayment)}</td>
                {/* <td style={{cursor:"pointer"}}>{showPayroll[num].status}</td> */}
                <td className={showPayroll[num].status === "Đã thanh toán"?classes.statusActive:classes.statusInactive} >
             {showPayroll[num].status}
            </td>
                {/* <td>
                    <button 
                        className={classes.article_button_detail}
                        onClick={() => showDetailSalary(num)}
                    >
                        <FontAwesomeIcon 
                            icon={faEye}  
                            style={{width: "15px", height: "15px"}}
                        />
                    </button>
                </td> */}
            </tr>
        ):(
            currentData.map((p,index)=>(
                <tr key={index}>
                    <td>{p.idEmployee}</td>
                    <td>{p.month}</td>
                    <td>{p.year}</td>
                    <td>{ formattedAmount(typeof p.totalPayment === 'undefined' ? 0.00 : p.totalPayment)}</td>
                    <td>
                        
                        <button className={classes.article_button_detail} title='Xem chi tiết'
                    onClick={()=>showDetailSalary(index)}
                    ><FontAwesomeIcon icon={faEye}  style={{width:"15px",
                        height:"15px"
                }}/></button></td> 
                </tr>
            ))
           
        )
    
    }

                  
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

            <div id="modal-root"> {modal && (
                <Modal onClose={closeModal}  payrollCustom={payrollCustom}>
                    <form id='form_add_salary' className={classes.form_add_salary}>
                        <div className={classes.form_title}>
                        <h2>Tính lương nhân viên</h2>
                        </div>
                      
                        {/* <div>
                            <label htmlFor="manv">Mã nhân viên:</label>
                        <select id='manv' name='manv'  value={selectedIdEmployee}
                onChange={handleSelectChange} required>
                                            {idEmployee.map((employee) => (
                                                <option key={employee.idemployee} value={employee.idemployee}>
                                                    {employee.idemployee}
                                                </option>
                                            ))}
                                    </select>
                        </div> */}

                        <div>
                            <label htmlFor='month'>Tháng:</label>
                            <input id='month'  name='month' type='number' max={12} min={1} maxLength={2}/>
                        </div>

                        <div>
                            <label htmlFor='year'>Năm:</label>
                            <input id='year' name='year' type='number' max={2030} min={2024} maxLength={4}/>
                        </div>
                            <div>
                            <label htmlFor='date'>Ngày thực hiện:</label>
                                <input type='date' id='date' name='date' value={formattedDate}/>
                            </div>
                            <div>
                            <label htmlFor='status'>Trạng thái:</label>
                                <input type='text' id='status' name='status' value="Chưa thanh toán"/>
                            </div>
                        <div className={classes.form_add_salary_button}>
                            <button className={classes.btnCal}  onClick={calculateSalary}>Tính</button>
                            <button className={classes.btnCancel} onClick={closeModal}>Hủy</button>
                        </div>
                    </form>
                </Modal>
)}
        </div>
        
        </div>

    )
}

export default HR_PayrollPage;