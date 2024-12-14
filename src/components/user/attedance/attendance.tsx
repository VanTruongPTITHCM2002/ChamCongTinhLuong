'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './attendance.module.css'
import { faCheck, faDeleteLeft, faPlus, faRightFromBracket, faRightToBracket, faSquareArrowUpRight, faTable, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { errorAlert, errorSwal, successSwal } from '@/custom/sweetalert';
import Swal from 'sweetalert2';
import CameraCapture from '@/components/cameraCapture/CameraCapture';
import Cookies from 'js-cookie';
import FaceDetection from '@/components/cameraCapture/FaceRegister';
import FaceRegister from '@/components/cameraCapture/FaceRegister';
import FaceRecognition from '@/components/cameraCapture/FaceRecognition';
import * as faceapi from "face-api.js";

 function convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export function calculateWorkHours(startTime: string, endTime: string): number {
    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);
   
    const gracePeriodStartMinutes = convertToMinutes('08:15');

    const gracePeriodEndMorningMinutes = convertToMinutes('11:45');

    const gracePeriodStartAfternoonMinutes = convertToMinutes('13:15');
   
    const gracePeriodEndMinutes = convertToMinutes('16:45');

    // Tính toán thời gian trễ và về sớm
    let lateMinutes = 0;
    let earlyLeaveMinutes = 0;

    if (startMinutes > gracePeriodStartMinutes) {
        lateMinutes = startMinutes - gracePeriodStartMinutes;
    }

    if (endMinutes < gracePeriodEndMinutes) {
        earlyLeaveMinutes = gracePeriodEndMinutes - endMinutes;
    }

    console.log (endTime + ' ||' + endMinutes +  ' ' + gracePeriodEndMinutes + ' = ' + earlyLeaveMinutes)
   
    if(startTime === '08:00' && endTime === '12:00' || startTime === '13:00' && endTime === '17:00'){
      return Number((1 - ((lateMinutes + earlyLeaveMinutes)/240)).toFixed(3)) > 0 ? Number((1 - ((lateMinutes + earlyLeaveMinutes)/240)).toFixed(3)):0
    }

    return Number((1 - ((lateMinutes + earlyLeaveMinutes)/480)).toFixed(3)) > 0 ? Number((1 - ((lateMinutes + earlyLeaveMinutes)/480)).toFixed(3)):0
    
}

function compareTimes(time1: string, time2: string): number {
    return convertToMinutes(time1) - convertToMinutes(time2);
}

function calculateMinutes(a:string,b:string) : number{
  const startMinutes = convertToMinutes(a);
  const endMinutes = convertToMinutes(b);
  return (endMinutes - startMinutes) / 480;
}
 function formatDate(dateString:string) {
     const date = new Date(dateString);
     const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
     const day = String(date.getDate()).padStart(2, '0');
     const year = date.getFullYear();
     return `${day}-${month}-${year}`;
   }

export default function UserAttendance(){
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const toggleCamera = () => {
    setIsCameraVisible(!isCameraVisible);
  };


  let username = '';
    if (typeof window !== 'undefined'){
     username = localStorage.getItem('username')!;
    }
    const token = Cookies.get('token');
    const [isExplain, setIsExplain] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [attendance,setAttendance] = useState<Attendance[]>([]);
    const [attendance_explain,setAttendance_Explain] = useState<AttendanceExplain[]>([]);
    const [currentCheckIn, setCurrentCheckIn] = useState<Attendance | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [isReasonTableVisible, setIsReasonTableVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const streamRef = useRef<MediaStream | null>(null); // Kiểu cho streamRef là MediaStream
    const [isOut, setIsOut] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const employeeId = localStorage.getItem('username');

    const getAllAttendance = async()=>{
        try{
            const response  = await axios(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance/${username}`,
              {
                              headers: {
                                  Authorization: `Bearer ${token}`  
                                }
                          });
            if(response.status === 200){
                setAttendance(response.data.data.reverse());
            }
        }catch(error:any){
            //errorSwal("Thất bại",`${error.response.data.message}`);
        }
    }

    const getAttendanceExplain = async()=>{
      try{
        const response  = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain/${username}`,    {
          headers: {
              Authorization: `Bearer ${token}`  
            }
      });
        if(response.status === 200){
            setAttendance_Explain(response.data.data.reverse());
        }
    }catch(error:any){
        //errorSwal("Thất bại",`${error.response.data.message}`);
    }
    }

    useEffect(()=>{
        getAllAttendance();
        getAttendanceExplain();
        const loadModels = async () => {
          try {
            const MODEL_URL = "/models"; // Đảm bảo đường dẫn chính xác
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
           
            console.log("Mô hình đã được tải thành công.");
          } catch (error) {
            console.error("Lỗi khi tải mô hình:", error);
          }
        };
      loadModels();
    },[])
    
    const itemsPerPage = 10;
    const totalPages = Math.ceil(attendance.length / itemsPerPage);
    const currentData = searchTerm ? 
    attendance.filter(
        (item) =>
          item.idemployee!.includes(searchTerm) ||
          item.dateattendance.includes(searchTerm)
          || item.checkintime.includes(searchTerm) ||
          item.checkouttime.includes(searchTerm) ||
          item.numberwork.toString().includes(searchTerm)
          || item.attendanceStatusName?.includes(searchTerm)||
          item.status.includes(searchTerm)
         
        
      ).slice((currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage) 
    :
    attendance.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    const handleCheckIn = () => {
 
      setModelsLoaded(true);
      // const today = new Date().toISOString().slice(0, 10);
      // const hasCheckedIn = attendance.some((item) => item.idemployee === `${username}` && item.dateattendance === today && item.checkintime);
   
      // if (hasCheckedIn) {
      //   errorAlert('Bạn đã chấm công vào trong ngày hôm nay rồi.');
        
      //   return;
      // }


  
      // const newEntry: Attendance = {
      //   idemployee: `${username}` , 
      //   dateattendance: today,
      //   // startime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      //   checkintime:new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      //   // checkintime:"10:30",
      //   checkouttime: '',
      //   status: compareTimes(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), "08:15") > 0 ? 'Đi trễ': 'Đi làm đầy đủ',
      //   numberwork: 0,
      //   // workhours: 0
      // };
      // if(compareTimes(newEntry.checkintime,"17:15") >= 0){
      //       errorSwal('Thất bại','Ngoài thời gian chấm công');
      //       return;
      //   }
      //   try{
      //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,newEntry,{
      //       headers: {
      //           Authorization: `Bearer ${token}`  
      //         }
      //   });
      //     if(response.status === 201){
              
      //       setCurrentCheckIn(newEntry);
      //       setAttendance([newEntry,...attendance]);
      //       setError(null);
      //           successSwal('Thành công',`${response.data.message}`);
      //     }
      //     if(response.data.status === 404){
      //       errorSwal('Thất bại',response.data.message);
      //       return;
      //     }
      // }catch(error:any){
      //     errorSwal('Thất bại',`${error.response.data.message}`);
      // }
      // setCurrentCheckIn(newEntry);
      // setAttendance([newEntry,...attendance]);
        
     
    };

    const checkInWork = async (token:string)=>{
      const today = new Date().toISOString().slice(0, 10);
      const hasCheckedIn = attendance.some((item) => item.idemployee === `${username}` && item.dateattendance === today && item.checkintime);
   
      if (hasCheckedIn) {
        errorAlert('Bạn đã chấm công vào trong ngày hôm nay rồi.');
        
        return;
      }


  
      const newEntry: Attendance = {
        idemployee: `${username}` , 
        dateattendance: today,
        // startime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        checkintime:new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        // checkintime:"10:30",
        checkouttime: '',
        status: compareTimes(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), "08:15") > 0 ? 'Đi trễ': 'Đi làm đầy đủ',
        numberwork: 0,
        // workhours: 0
      };
      if(compareTimes(newEntry.checkintime,"17:15") >= 0){
            errorSwal('Thất bại','Ngoài thời gian chấm công');
            return;
        }
        try{
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,newEntry,{
            headers: {
                Authorization: `Bearer ${token}`  
              }
        });
          if(response.status === 201){
              
            setCurrentCheckIn(newEntry);
            setAttendance([newEntry,...attendance]);
            setError(null);
                successSwal('Thành công',`${response.data.message}`);
          }
          if(response.data.status === 404){
            errorSwal('Thất bại',response.data.message);
            return;
          }
      }catch(error:any){
          errorSwal('Thất bại',`${error.response.data.message}`);
      }
    }
  
    const handleCheckOut = async () => {
      setModelsLoaded(true);
      setIsOut(true);
    };

    const checkOutWork = async (token:string)=>{
      setCurrentCheckIn(attendance.find(item => item.checkouttime === '') ?? null);
      if (currentCheckIn) {
        const today = new Date().toISOString().slice(0, 10);
        const hasCheckedOut = attendance.some((item) =>
          item.idemployee === currentCheckIn.idemployee &&
          item.dateattendance === today &&
          item.checkintime &&
          item.checkouttime
        );
  
        let statusAttendance = '';
        if (hasCheckedOut) {
          setError('Bạn đã chấm công ra trong ngày hôm nay rồi.');
          return;
        }
  
        
        let endTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        // const totalAdjustedDays = calculateAdjustedDays(currentCheckIn.startime, endTime);
     
        if (compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") > 0) {
            statusAttendance = 'Đi trễ';
        } else if (compareTimes(currentCheckIn.checkintime, "08:15") <= 0 && compareTimes(endTime, "16:45") < 0) {
           statusAttendance ='Về sớm';
        }else if(compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") < 0){
           statusAttendance ='Đi trễ về sớm';
        } 
        else {
             statusAttendance ='Đi làm đầy đủ';
        }
      

        let checkoutt = "16:00";

        const updatedEntry: Attendance = {
          ...currentCheckIn,
          checkouttime: endTime,
          // checkouttime:checkoutt,
          status:statusAttendance,
          attendanceStatusName:statusAttendance, // Hoặc tính toán trạng thái khác
          numberwork: calculateWorkHours(currentCheckIn.checkintime,endTime),
        //   workhours: totalAdjustedDays // Số công
        };


        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,updatedEntry,{
              headers: {
                  Authorization: `Bearer ${token}`  
                }
          });
            if(response.status === 200){
                const updatedData = attendance.map((item) =>
                    item.idemployee === currentCheckIn.idemployee && item.dateattendance === currentCheckIn.dateattendance ? updatedEntry : item
                  );
                  setAttendance(updatedData);
                  setCurrentCheckIn(null);
                  setError(null);
                  successSwal('Thành công',`${response.data.message}`);
            }
            if(response.data.status === 404){
              errorSwal('Thất bại',response.data.message);
              return;
            }
        }catch(error:any){
            errorSwal('Thất bại',`${error.response.data.message}`);
        }
      setIsOut(false);

      }
    }
  
    const showExplain = () => {
      setIsExplain(true);
    };
  
    const hideExplain = () => {
      setIsExplain(false);
      setSelectedRowIndex(null);
    };
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);
    
    const toggleReasonTable = () => {
      setIsReasonTableVisible(!isReasonTableVisible);
    };
  
    const closeReasonTable = ()=>{
      setIsReasonTableVisible(false);
    }
    const handleRowSelection = (index:any) => {
      setSelectedRowIndex(index === selectedRowIndex ? null : index);
    };
    const handleSelectRow = async() => {
      if (selectedRowIndex !== null) {
        const { value: text ,isDismissed } = await Swal.fire({
          input: "textarea",
          inputLabel: "Nhập lý do",
          inputPlaceholder: "Type your message here...",
          inputAttributes: {
            "aria-label": "Type your message here"
          },
          showCancelButton: true
        });
        if (isDismissed) {
          return; 
      }
        const selectedRow  = {
          idemployee: attendance[selectedRowIndex].idemployee,
          date: attendance[selectedRowIndex].dateattendance,
          checkintime: attendance[selectedRowIndex].checkintime,
          checkoutime: attendance[selectedRowIndex].checkouttime,
          reason:text
        } 
        const normalizeTime = (time: string) => {
          // Nếu định dạng thời gian là "HH:mm", thêm giây nếu cần
          if (time.length === 5) {
              return `${time}:00`;
          }
          return time; // Đã là định dạng "HH:mm:ss"
      };
      const isCheck =   attendance_explain.some(existingRow =>
          existingRow.idemployee === selectedRow.idemployee &&
          existingRow.date === selectedRow.date &&
          normalizeTime(existingRow.checkintime) === normalizeTime(selectedRow.checkintime) &&
          normalizeTime(existingRow.checkoutime) === normalizeTime(selectedRow.checkoutime)
      );
  
     
       if(isCheck){
          errorSwal('Thất bại','Không thêm giải trình do đã có');
          return;
       }
        try{
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain`,selectedRow,{
            headers: {
                Authorization: `Bearer ${token}`  
              }
        });
          if(response.status === 201){
            successSwal("Thành công",`${response.data.message}`);
            setSelectedRowIndex(null);
            setIsExplain(false);
          }
        }catch(error:any){
          errorSwal("Thất bại",`${error.response.data.message}`);
        }
        
      }
   
    };

    
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Camera started");
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop()); // Dừng camera
    }

    setModelsLoaded(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null; // Gỡ stream khỏi video element
    } // Đóng modal khi tắt camera
  };


  const identifyUser = async (descriptor: Float32Array) => {
    try {
      const response = await axios.post("http://localhost:8091/api/v1/face/recognize", {
        idEmployee:employeeId,
        faceDescriptor: Array.from(descriptor),
      });
      if(isOut){
        await checkOutWork(token!);
      }else{
        await checkInWork?.(token!);
      }

   //  successSwal('Thành công',response.data.data);

    } catch (error:any) {
      errorSwal("Lỗi", error.response.data.message);
    }
  };

  const detectFaceLoop = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Tạo canvas phù hợp với kích thước của video
    const displaySize = { width: video.width, height: video.height };

    faceapi.matchDimensions(canvas!, displaySize);
    const detections = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ lại
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas!, resizedDetections!);
      faceapi.draw.drawFaceLandmarks(canvas!, resizedDetections!);
    if (detections) {
      const descriptor = detections.descriptor;
      if (descriptor) {
        console.log("Khuôn mặt đã được nhận diện!");
        await identifyUser(descriptor);
        return; // Gửi descriptor để nhận diện
      } else {
        console.log("Không phát hiện khuôn mặt.");
      }
    }

    requestAnimationFrame(detectFaceLoop); // Tiếp tục vòng lặp nhận diện
  };

  const handleStartRecognition = async () => {
    if (!employeeId) {
      alert("Vui lòng nhập mã nhân viên!");
      return;
    }
    detectFaceLoop(); // Bắt đầu nhận diện khuôn mặt
  };
    return (
      <div className={classes.main_container}>
        <div className={classes.main_container_add_attendance}>
          <div className={classes.add_attendance}>
            {!isReasonTableVisible && (
              <>
               {/* <button className={classes.check_in_button} onClick={handleCheckIn}>
              <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '5px' }} />
              Chấm công vào
            </button>
            <button className={classes.check_out_button} onClick={handleCheckOut}>
              <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px' }} />
              Chấm công ra
            </button> */}
            <div>
      <button className={classes.faceRegisterButton} onClick={toggleCamera}>
        {isCameraVisible ? "Tắt đăng ký" : "Đăng ký khuôn mặt"}
      </button>

      {isCameraVisible && <FaceRegister/>}
    </div>

    <div>

      {/* <button onClick={openCamera}>
        {isCamera ? "Tắt Camera" : "Mở Camera"}
      </button> */}

                 

                    <>
                      {modelsLoaded && (
                        <>
                        <div className={classes.modalOverplay}>
                      <div className={classes.modalContent}>
                      
                           <div style={{ position: "relative", zIndex: 1000 }}>
                           <video ref={videoRef} autoPlay muted width={700} height={500} />   
                              <canvas
                                ref={canvasRef}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  border: "1px solid red", // Đường viền giúp dễ kiểm tra canvas
                                }}
                              />
                           </div>
                        

                          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <button className={classes.startCamera} onClick={startVideo}>Bắt đầu nhận diện khuôn mặt</button>
                          <button className={classes.faceRecoginiCamera} onClick={handleStartRecognition}>Nhận diện khuôn mặt</button>
                          <button className={classes.closeButton} onClick={stopVideo}>Tắt Camera</button>
                          </div>
                          
                          </div>
                          </div>
                        </>
                      )}
                     </>
                  
    </div>
              </>
            )}
           
          </div>
          <div className={classes.add_reason}>
            {isExplain ? (
              <>
                <button onClick={handleSelectRow} >
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                  Chọn
                </button>
                <button onClick={hideExplain}>
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />
                  Hủy
                </button>
              </>
            ) : isReasonTableVisible ? (
              <button onClick={closeReasonTable}>
              <FontAwesomeIcon icon={faDeleteLeft} style={{ marginRight: '5px' }} />
              Quay lại
            </button>
            ):(
              <>
              <button onClick={showExplain}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                Thêm giải trình
              </button>
                 <button onClick={toggleReasonTable}>
                 <FontAwesomeIcon icon={faTable} style={{ marginRight: '5px' }} />
                 Bảng giải trình
               </button>
              </>
              
            )}
          </div>
        </div>
        {!isReasonTableVisible && (
        <div className={classes.main_container_table}>
          <h2>Bảng danh sách chấm công của {username}</h2>
        
          <table className={classes.attendance_table}>
            <thead>
              <tr>
                {isExplain && <th>Lựa chọn</th>}
                <th>Mã nhân viên</th>
                <th>Ngày chấm công</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Trạng thái</th>
                <th>Số công</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  {isExplain && (
                    <td>
                      <input type="checkbox" 
                       checked={selectedRowIndex === index}
                       onChange={() => handleRowSelection(index)}
                      />
                    </td>
                  )}
                  <td>{item.idemployee}</td>
                  <td>{formatDate (item.dateattendance)}</td>
                  <td>{item.checkintime}</td>
                  <td>{item.checkouttime}</td>
                  <td>{item.attendanceStatusName}</td>
                  <td>{item.numberwork}</td>
                  {/* <td>{item.workhours.toFixed(2)}</td> Hiển thị số công với 2 chữ số thập phân */}
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
      )}

      {isReasonTableVisible && (
        <div className={classes.main_container_table}>
          <h2>Bảng giải trình</h2>
          <table className={classes.attendance_table}>
            <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Ngày giải trình</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {attendance_explain.map((a,index)=>(
                  <tr key={index}>
                    <td>{a.idemployee}</td>
                    <td>{a.date}</td>
                    <td>{a.checkintime}</td>
                    <td>{a.checkoutime}</td>
                    <td>{a.explaination}</td>
                    <td className={a.status === "Duyệt"? classes.statusActive: a.status === "Không duyệt"?classes.statusInactive:classes.statusUnActive}>{a.status}</td>
                  </tr>
              ))}
             
            </tbody>
          </table>
        </div>
      )}
      </div>
    );
}