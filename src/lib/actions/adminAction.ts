'use server'


import {auth} from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';

export async function updateCompanyProfile({
name,logo,website
}:{
    name:string;
    website?:string;
    logo?:string,
}) {

   try {
    const {userId} = await auth(); 

    if (!userId) {
       throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
        select: {
            role: true,
            companyId:true
        }
    })


    if(!user) {
        throw new Error("User not found");

    }

    if(user.role !== 'ADMIN') {
        throw new Error("User not authorized");
    }


 await prisma.company.update({
        where: {

            id: user.companyId,
        },
        data: {
            name,
            logo,
            website
        }
    })

    revalidatePath('/admin/company-settings/profile')
    revalidatePath('/admin/company-settings')

    return  {
        success: true,
     
    }
     

   } catch (error) {
    console.error("Error updating company profile", error);
    return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update company profile"
    }
   }
    
   }





   export async function updateCompanyWorkingDays(workingDays: string[]) {

    try {
        const {userId} = await auth(); 

        if (!userId) {
           throw new Error("User not authenticated");
        }

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
            select: {
                role: true,
                companyId:true
            }
        })


        if(!user) {
            throw new Error("User not found");

        }

        if(user.role !== 'ADMIN') {
            throw new Error("User not authorized");
        }


     await prisma.company.update({
            where: {

                id: user.companyId,
            },
            data: {
                workingDays: JSON.stringify(workingDays),// Convert to JSON string 
            }
        })

        revalidatePath('/admin/company-settings/working-days')
        revalidatePath('/admin/company-settings')

        return  {
            success: true,
     
        }
         

       } catch (error) {
        console.error("Error updating company profile", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update company profile"
        }
       }
   }


   export async function addCompanyHoliday({
    name,
    date,
    isRecurring,
  }: {
    name: string;
    date: Date;
    isRecurring: boolean;
  }) {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("Unauthorised. Please sign in.");
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          companyId: true,
          role: true,
        },
      });
  
      if (!user) {
        throw new Error("User not found in database");
      }
  
      if (user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
  
      const holiday = await prisma.companyHoliday.create({
        data: {
          name,
          date,
          isRecurring,
          companyId: user.companyId,
        },
      });
  
      revalidatePath("/admin/company-settings/holidays");
  
      return holiday;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add company holiday");
    }
  }
  
  export async function updateCompanyHoliday({
    id,
    name,
    date,
    isRecurring,
  }: {
    id: string;
    name: string;
    date: Date;
    isRecurring: boolean;
  }) {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("Unauthorised. Please sign in.");
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          companyId: true,
          role: true,
        },
      });
  
      if (!user) {
        throw new Error("User not found in database");
      }
  
      if (user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
  
      const holiday = await prisma.companyHoliday.findUnique({
        where: { id },
        select: { companyId: true },
      });
  
      if (!holiday) {
        throw new Error("Holiday not found in database");
      }
  
      if (holiday.companyId !== user.companyId) {
        throw new Error("You can only update holidays for your own company");
      }
  
      const updatedHoliday = await prisma.companyHoliday.update({
        where: { id },
        data: {
          name,
          date,
          isRecurring,
        },
      });
  
      revalidatePath("/admin/company-settings/holidays");
  
      return updatedHoliday;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add company holiday");
    }
  }

  export async function deleteCompanyHoliday(id: string) {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          companyId: true,
          role: true,
        },
      });
  
      if (!user) {
        throw new Error("User not found in database");
      }
  
      if (user.role !== "ADMIN") {
        throw new Error("Only admins can delete company holidays");
      }
  
      const existingHoliday = await prisma.companyHoliday.findUnique({
        where: {
          id,
        },
        select: {
          companyId: true,
        },
      });
  
      if (!existingHoliday) {
        throw new Error("Holiday not found in database");
      }
  
      if (existingHoliday.companyId !== user.companyId) {
        throw new Error("You can only delete holidays for your own company");
      }
  
      await prisma.companyHoliday.delete({
        where: {
          id,
        },
      });
  
      revalidatePath("/admin/company-settings/holidays");
  
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete company holiday");
    }
  }

  export async function updateEmployeeAllowance({
    employeeId,
    availableDays,
  }: {
    employeeId: string;
    availableDays: number;
  }) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return { error: "Unauthorised" };
      }
  
      const adminUser = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });
  
      if (!adminUser || adminUser.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      await prisma.user.update({
        where: {
          id: employeeId,
        },
        data: {
          availableDays,
        },
      });
  
      revalidatePath("/admin/employees/allowance");
  
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update employee allowance");
    }
  }

  
export async function generateInvitationCode() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorise");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
        companyId: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const generateRandomCode = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit code
    };

    let code = generateRandomCode(); // Generate a random 6-digit code 

    let existingCode = await prisma.code.findFirst({
      where: {
        code,
      },
    }); // Check if the code already exists in the database 

    while (existingCode) {
      code = generateRandomCode();
      existingCode = await prisma.code.findFirst({
        where: {
          code,
        },
      });
    } // If the code already exists, generate a new one until a unique code is found

    const newCode = await prisma.code.create({
      data: {
        code,
        companyId: user.companyId,
        used: false,
      },
    }); // Create a new invitation code in the database

    revalidatePath("/admin/invitation-codes");

    return newCode;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate invitation code");
  }
}


export async function updateTimeOffRequestStatus({
  requestId,
  status,
  notes,
}: {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  notes?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorised");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        companyId: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    if (user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const request = await prisma.timeOffRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        employee: true,
      },
    });

    if (!request) {
      throw new Error("Time off request not found in database");
    }

    if (request.employee.companyId !== user.companyId) {
      throw new Error(
        "You can only update time off requests for your own company"
      );
    }

    const updatedRequest = await prisma.timeOffRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
        notes,
        managerId: user.id,
      },
    });

    if (status === "APPROVED") {
      await prisma.user.update({
        where: {
          id: request.employeeId,
        },
        data: {
          availableDays: {
            decrement: updatedRequest.workingDaysCount,
          },
        },
      });
    }
    revalidatePath("/admin/time-off-requests");

    return updatedRequest;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update time off request status");
  }
}