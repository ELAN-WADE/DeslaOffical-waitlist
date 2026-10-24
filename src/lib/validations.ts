import { z } from 'zod';

export const waitlistFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(100, { message: 'Full name cannot exceed 100 characters' })
    .optional()
    .default(''),
  firstName: z
    .string()
    .trim()
    .max(100)
    .optional(),
  email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email address' })
    .max(150, { message: 'Email cannot exceed 150 characters' })
    .toLowerCase(),
  city: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default('Lagos'),
  role: z.enum(['shopper', 'creator', 'distributor', 'partner']),
  skinConcern: z.string().trim().max(150).optional().nullable(),
  creatorHandle: z.string().trim().max(100).optional().nullable(),
  creatorPlatform: z.string().trim().max(100).optional().nullable(),
  distributorBusiness: z.string().trim().max(150).optional().nullable(),
  distributorVolume: z.string().trim().max(100).optional().nullable(),
  partnerOrganization: z.string().trim().max(150).optional().nullable(),
  partnerFocus: z.string().trim().max(150).optional().nullable(),
});

export type WaitlistInput = z.infer<typeof waitlistFormSchema>;
