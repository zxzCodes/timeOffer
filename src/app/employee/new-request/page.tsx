import TimeOffRequestForm from "@/components/time-request-form";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function page() {
    const { userId } = await auth();

    if (!userId) {
      redirect("/");
    }
  
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        companyId: true,
      },
    });
  
    if (!user) {
      redirect("/onboarding");
    }
  
    const requests = await prisma.timeOffRequest.findMany({
      where: {
        employeeId: userId,
      },
    });

    console.log(requests);
  
    const companyHolidays = await prisma.companyHoliday.findMany({
      where: {
        companyId: user.companyId,
      },
    });
    console.log(companyHolidays);
  return (
    <TimeOffRequestForm 
      existingRequests={requests}
      companyHolidays={companyHolidays}
    />
    
  )
}
