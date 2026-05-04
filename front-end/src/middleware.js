import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req){
    const token = req.cookies.get("x-auth-token")?.value;


    if(!token ){
        return NextResponse.redirect(new URL("/", req.url));
    }

    try{
        const {payload} = await jwtVerify(token, secret);

        if(!payload || payload.role !== "admin"){
            return NextResponse.redirect(new URL("/", req.url));
        }
        
        return NextResponse.next();
    }catch(error){
        console.error("JWT verification error:", error.message);
        return NextResponse.redirect(new URL("/auth/auth", req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*',
        '/api/admin/:path*'
    ],
}