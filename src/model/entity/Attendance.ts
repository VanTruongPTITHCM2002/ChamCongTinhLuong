interface Attendance{
    idemployee:string,
    dateattendance:string,
    date?:string;
    checkintime:string,
    checkouttime:string,
    status:string,
    attendanceStatusName?:string
    numberwork:number
 } 

 interface AttendanceExplain{
    idemployee:string;
    date:string;
    checkintime:string;
    checkoutime:string;
    explaination:string;
    status:string;
 }