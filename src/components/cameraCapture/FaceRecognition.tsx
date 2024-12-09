import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { successSwal, errorSwal } from "@/custom/sweetalert";
import Cookies from 'js-cookie';



interface FaceRecognitionProps {
  checkInWork?: (token:string) => Promise<void>; // Hàm không có tham số, không bắt buộc
  onStop?: () => void;  // Hàm không có tham số, không bắt buộc
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({checkInWork,onStop}) => {
  const token = Cookies.get('token');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    const loadModels = async () => {
        try {
          const MODEL_URL = "/models"; // Đảm bảo đường dẫn chính xác
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
          setModelsLoaded(true);
          console.log("Mô hình đã được tải thành công.");
        } catch (error) {
          console.error("Lỗi khi tải mô hình:", error);
        }
      };
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Camera started");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Dừng tất cả các track video
      setStream(null); // Đặt lại stream
      console.log("Camera stopped");
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null; // Xóa nguồn video khỏi thẻ <video>
    }
  };


  const identifyUser = async (descriptor: Float32Array) => {
    try {
      const response = await axios.post("http://localhost:8091/api/v1/face/recognize", {
        idEmployee:employeeId,
        faceDescriptor: Array.from(descriptor),
      });

      successSwal('Thành công',response.data.data)
     await checkInWork?.(token!);

    } catch (error:any) {
      errorSwal("Lỗi", error.response.data.message);
    }
  };

  const detectFaceLoop = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    const detections = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

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
    <div>
      <h1>Nhận diện khuôn mặt</h1>
      {modelsLoaded ? (
        <>
          <video ref={videoRef} autoPlay muted width={720} height={560} />
          <div>
            <label>Mã nhân viên:</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Nhập mã nhân viên"
            />
          </div>
          <button onClick={startVideo}>Bắt đầu nhận diện khuôn mặt</button>
          <button onClick={handleStartRecognition}>Nhận diện khuôn mặt</button>
          <button onClick={stopVideo}>Tắt Camera</button>
        </>
      ) : (
        <p>Đang tải mô hình...</p>
      )}
    </div>
  );
};

export default FaceRecognition;
