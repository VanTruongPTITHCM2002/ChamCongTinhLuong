import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',  // Áp dụng cho tất cả các route bắt đầu với `/admin`
        // Thêm các route khác nếu cần bảo vệ
    ],
};