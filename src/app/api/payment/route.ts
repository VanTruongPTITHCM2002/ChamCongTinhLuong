import crypto, { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const { amount, orderId } = await request.json();
  let orderd = randomUUID();
  const vnp_TmnCode = 'LI8I49C2';
  const vnp_HashSecret = 'SREC8QGDOZLN30YQNR7ME7EFOLGMQMCS';
  const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Đối với môi trường test

  const date = new Date();
  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: (amount * 100).toString(),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderd.toString(),
    vnp_OrderInfo: `Thanh toan cho don hang ${orderd}`,
    vnp_OrderType: 'billpayment',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: 'http://localhost:3000/payment_success',
    vnp_IpAddr: '127.0.0.1',
    vnp_CreateDate: date.toISOString().slice(0, 19).replace(/[-T:]/g, ''),
  };

  // Sắp xếp các tham số theo thứ tự chữ cái
  const sortedKeys = Object.keys(vnp_Params).sort();
  const sortedParams: Record<string, string> = {};
  for (const key of sortedKeys) {
    sortedParams[key] = vnp_Params[key];
  }

  // Tạo chuỗi truy vấn
  const queryString = new URLSearchParams(sortedParams).toString();
  
  // Tính toán chữ ký
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  hmac.update(queryString, 'utf-8');
  const secureHash = hmac.digest('hex');
  
  // Thêm chữ ký vào tham số
  const finalParams = new URLSearchParams(sortedParams);
  finalParams.append('vnp_SecureHash', secureHash);

  const paymentUrl = `${vnp_Url}?${finalParams.toString()}`;
 
  return new Response(JSON.stringify(paymentUrl), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
