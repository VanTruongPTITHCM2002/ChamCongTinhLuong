'use client'
import { text } from 'stream/consumers';
import classes from './rewardpenalty.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
interface RewardPenalty{
    idemployee:string;
    type:string;
    cash:number;
    reason:string;
    setupdate:string;
    status?:string;
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
export default function UserRewardPenalty(){
    const username = localStorage.getItem('username');
    const [rewardpenalty,setRewardPenalty] = useState<RewardPenalty[]>([]);
    const [rewpen,setRewpen] = useState<RewardPenalty[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const getRewardPenalty = async ()=>{
        try{
            const response = await axios.get(`http://localhost:8086/api/v1/rewardpunish/${username}`);
            if(response.status === 200){
                setRewardPenalty(response.data.data);
                setRewpen(response.data.data);
            }
        }catch(error){
            console.error('Lỗi ghi gọi dữ liệu xuống server');
        }
    }

    useEffect(()=>{
        getRewardPenalty();
    },[])
    const totalPages = Math.ceil(rewardpenalty.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
  
    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      setSearchTerm(term);
    };

    const searchParams = ()=>{
        if(searchTerm === ''){
            setRewardPenalty(rewpen);
           
         }else{
            const filterdata = rewpen.filter(
                (item) =>
                  item.idemployee.includes(searchTerm) ||
                  item.type.includes(searchTerm) ||
                  item.cash.toString().includes(searchTerm)
                  || item.reason.includes(searchTerm)
                  || item.setupdate.includes(searchTerm)
              );
          setRewardPenalty(filterdata);
        }
    }
  
    return (
        <div className={classes.main_container}>
            <h2>Bảng thưởng phạt của {username}</h2>
            <input type="text" name="" id="" placeholder='Tìm kiếm...'
             value={searchTerm}
             onChange={handleSearch}
            />
            <button onClick={searchParams} className={classes.btnSearch}>
                <FontAwesomeIcon icon={faSearch} />
               </button>

                    <table className = {classes.rewardpenaltyTable}>
                        <thead>
                            <tr>
                                <th>Mã nhân viên</th>
                                <th>Loại</th>
                                <th>Số tiền</th>
                                <th>Lý do</th>
                                <th>Ngày thiết lập</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rewardpenalty.map((r,index)=>(
                                <tr key={index}>
                                    <td>{r.idemployee}</td>
                                    <td>{r.type}</td>
                                    <td>{formattedAmount(r.cash)}</td>
                                    <td>{r.reason}</td>
                                    <td>{formatDate(r.setupdate)}</td>
                                </tr>
                            ))}
                           
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