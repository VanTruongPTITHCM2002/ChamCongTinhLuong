'use client'
import { useEffect, useState } from 'react';
import classes from './listsalary.module.css'
import axios from 'axios';
import { errorSwal } from '@/custom/sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
interface ListSalary{
    idemployee:string;
    name:string;
    month:number;
    year:number;
    reward:number;
    punish:number;
    basicsalary:number
    day_work:Float32Array;
    datecreated:string;
    totalpayment:Float32Array;
    status:string;
}
 function formatDate(dateString:string) {
     const date = new Date(dateString);
     const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
     const day = String(date.getDate()).padStart(2, '0');
     const year = date.getFullYear();
     return `${day}-${month}-${year}`;
   }
   const formattedAmount = (num:Float32Array | number)=>{
    return  num.toLocaleString('vi-VN', {
     style: 'currency',
     currency: 'VND',
   });
 }
export default function UserSalary (){
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const [listSalary, setListSalary] = useState<ListSalary[]>([]);
    const [filterSalary, setFilterSalary] = useState<ListSalary[]>([]);
    const [isShowDetail,setIsShowDetail] = useState(false);
    const [num,setNum] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    
      const getListSalary = async ()=>{
            try{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/${username}`,{
                  headers: {
                      Authorization: `Bearer ${token}`  
                    }
              });
                if(response.status === 200){
                    setListSalary(response.data.data);
                    setFilterSalary(response.data.data);
                }
            }catch(error:any){
                errorSwal('Thất bại',`${error.response.data.message}`);
            }
      }

    useEffect(() => {
        getListSalary();
    }, []);

      const totalPages = Math.ceil(listSalary.length / itemsPerPage);
    
      const handlePageChange = (pageNumber:number) => {
        setCurrentPage(pageNumber);
      };
    
      const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };
    
      const searchSalary = ()=>{
       
         if(searchTerm === ''){
            setListSalary(filterSalary);
           
         }else{
            const filterdata = filterSalary.filter(
                (item) =>
                  item.idemployee.includes(searchTerm) ||
                  item.name.includes(searchTerm)
                  || item.month.toString().includes(searchTerm) ||
                  item.year.toString().includes(searchTerm)
                  || item.totalpayment.toString().includes(searchTerm)
              );
          setListSalary(filterdata);
        }
      }

      const showDetails = (index:number)=>{
            setIsShowDetail(true);
            setNum(index);
      }
      
      const backListSalary = ()=>{
        setIsShowDetail(false);
        setNum(-1);
      }
    return (
        <div className={classes.main_container}>
            <h2>Bảng lương của nhân viên {username}</h2>
            {!isShowDetail ?
            (
                <>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ marginBottom: '10px' }}
                    />

                    <button className={classes.btnSearch} onClick={searchSalary}>
                        <FontAwesomeIcon icon={faSearch} style={
                            { marginRight: "5px" }
                        } />
                   </button>
                </>
            ):
            <button className={classes.btnBack} onClick={backListSalary}>
            <FontAwesomeIcon icon={faDeleteLeft} style={
                { marginRight: "5px" }
            } />
         Quay lại</button>
            }
      

      <table className={classes.attendance_table}>
        <thead>
          <tr>
            <th>Mã nhân viên</th>
            <th>Họ và tên</th>
            <th>Tháng</th>
            <th>Năm</th>
            {isShowDetail && 
            (
                <>
                                <th>Thưởng</th>
                                <th>Phạt</th>
                                <th>Lương cơ bản</th>
                                <th>Số ngày công</th>
                                <th>Ngày tạo</th>
                </>
            )}
            
            <th>Tổng lương</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
            {num !== -1 ? (
                <tr>
                    <td>{listSalary[num].idemployee}</td>
                    <td>{listSalary[num].name}</td>
                    <td>{listSalary[num].month}</td>
                    <td>{listSalary[num].year}</td>
                    <td>{formattedAmount(listSalary[num].reward)}</td>
                    <td>{formattedAmount(listSalary[num].punish)}</td>
                    <td>{formattedAmount(listSalary[num].basicsalary)}</td>
                    <td>{listSalary[num].day_work}</td>
                    <td>{formatDate(listSalary[num].datecreated)}</td>
                    <td>{formattedAmount(listSalary[num].totalpayment)}</td>
                    <td className={listSalary[num].status === 'Đã thanh toán' ? classes.statusActive : classes.statusInactive}>{listSalary[num].status}</td>
                </tr>
            ):(
                listSalary.map((item,index) => (
                    <tr key={index}>
                      <td>{item.idemployee}</td>
                      <td>{item.name}</td>
                      <td>{item.month}</td>
                      <td>{item.year}</td>
                      <td>{formattedAmount(item.totalpayment)}</td>
                      
                      <td>
                            <button className={classes.btnDetail} onClick={()=>showDetails(index)}><FontAwesomeIcon icon={faEye} /></button>
                      </td>
                    </tr>
                  ))
            )}
          
        </tbody>
      </table> 
      {!isShowDetail &&
        (
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
        )
      }
     
    </div>
       
    );
}