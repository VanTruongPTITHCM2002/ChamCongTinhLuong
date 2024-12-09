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