'use server'

import { clerkClient } from "@clerk/nextjs/server"
import prisma from "../prisma"


export async function createEmployee(deparment:string | undefined,clerkId:string,invitationCode:string) {
   

    try {
        const clerk = await clerkClient(); // initialize Clerk client
        const user = await clerk.users.getUser(clerkId); // get user by clerkId

        if(!user || !user.firstName || !user.lastName) {
            throw new Error("User not found")
        }
        const code =  await prisma.code.findFirst({
            where: {
                code: invitationCode,
                used: false
            }
        }) // get code by invitation code 

        if(!code) {
            throw new Error("Invalid invitation code")
        }
        await (await clerkClient()).users.updateUserMetadata(user.id, {
            publicMetadata: {
                onboardingCompleted: true,
                role: 'EMPLOYEE',
                companyId: code.companyId,
                


            }

        }) // update user metadata with onboardingCompleted and role

        await prisma.user.create({
            data: {
                clerkId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0]?.emailAddress,
                role: 'EMPLOYEE',
                department: deparment || null,
                companyId: code.companyId,

               
                
              
            }
        }) // create user in database 
        
        await prisma.code.update({
            where: {
                id: code.id
            },
            data: {
                used: true
            }
        }) // update code to used

        return {
            success: true
        }

        
    } catch (error) {
        console.error(error)
       
        
    }
    
}


export async function createAdmin(companyName:string,companyWebsite:string,companyLogo:string,clerkId:string) {
    try {
        const user = await (await clerkClient()).users.getUser(clerkId) // get user by clerkId

        if(!user || !user.firstName || !user.lastName) {
            throw new Error("User not found")
        }
        const company = await prisma.company.create({
            data: {
                name: companyName,
                website: companyWebsite,
                logo: companyLogo,
               
            }
        }) // create company in database 







        await (await clerkClient()).users.updateUserMetadata(user.id, {
            publicMetadata: {
                onboardingCompleted: true,
                role: 'ADMIN',
                companyId: company.id,
               
               
            }
        }) // update user metadata with onboardingCompleted and role

        await prisma.user.create({
            data: {
                clerkId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0]?.emailAddress,
                role: 'ADMIN',
                department: null,
                companyId: company.id,

                
              
            }
        }) // create user in database 

        return {
            success: true,
        }

        
    } catch (error) {
        console.error(error)
        return {
            success: false
        }
        
    }
}