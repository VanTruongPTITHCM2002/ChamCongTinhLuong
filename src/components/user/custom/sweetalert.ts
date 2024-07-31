import Swal from "sweetalert2";

export const successSwal = (title:string, text:string) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };
  
  export const errorSwal = (title:string, text:string) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  export const successAlert = (text:string) =>{
    return Toast.fire({
      icon: "success",
      title: text
    });
  }

  export const errorAlert = (text:string)=>{
    return Toast.fire({
      icon: "error",
      title: text
    });
  }