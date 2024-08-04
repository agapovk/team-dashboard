import { PrismaClient } from "@repo/db";
const prisma = new PrismaClient();

import { NextResponse } from "next/server";

// export async function GET(request) {
//   const injuries = await prisma.injury.findMany();
//   return NextResponse.json(injuries);
// }

export async function POST(request: any) {
  // try {
  //   const json = await request.json();
  // const injury = await prisma.injury.create({
  //   data: json,
  // });
  //   return new NextResponse(JSON.stringify(injury), {
  //     status: 201,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // } catch (error: any) {
  //   if (error.code === 'P2002') {
  //     return new NextResponse('Injury already exists', {
  //       status: 409,
  //     });
  //   }
  //   return new NextResponse(error.message, { status: 500 });
  // }
}
