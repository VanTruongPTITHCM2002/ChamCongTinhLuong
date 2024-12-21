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

export interface Salary{
    nameSalary: string,
    month:number,
    year:number,
    countEmployee:number,
}

export function groupPayrollByMonth(payroll: Payroll[]): Salary[] {
    const groupedPayroll = payroll.reduce((result, item) => {
        const key = `${item.month}-${item.year}`;
        if (!result[key]) {
            result[key] = {
                nameSalary: `Bảng lương tháng ${item.month}/${item.year}`,
                month: item.month,
                year: item.year,
                countEmployee: 0,
                
            };
        }
        result[key].countEmployee += 1;
       
        return result;
    }, {} as Record<string, Salary>);

    // Chuyển kết quả từ object sang array
    return Object.values(groupedPayroll);
}