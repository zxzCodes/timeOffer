import { z } from 'zod';

export const employeeSchema = z.object({
    firstName: z.string().min(1,'first name is required').max(50,'first name must be less than 50 characters'),
    lastName: z.string().min(1,'last name is required').max(50,'last name must be less than 50 characters'),
    email: z.string().email('invalid email address').max(50,'email must be less than 50 characters'),
    deparment:z.string().optional(),
    invitationCode: z.string().length(6,'invitation code must be 6 characters long')
});

export const adminSchema = z.object({
    firstName: z.string().min(1,'first name is required').max(50,'first name must be less than 50 characters'),
    lastName: z.string().min(1,'last name is required').max(50,'last name must be less than 50 characters'),
    email: z.string().email('invalid email address').max(50,'email must be less than 50 characters'),
    companyName: z.string().min(1,'company name is required').max(50,'company name must be less than 50 characters'),
    companyWebsite: z.string().url('invalid website url').optional().or(z.literal('')),
    companyLogo: z.string().url().optional().or(z.literal('')),
});


 export type EmployeeSchemaValues = z.infer<typeof employeeSchema>;
 export type AdminSchemaValues = z.infer<typeof adminSchema>;