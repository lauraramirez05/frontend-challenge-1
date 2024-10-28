import { date, z } from "zod";

const dollarAmountSchema = z
  .number()
  .refine((value) => value >= 0, { message: "Dollar amount must be non-negative number." })
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toFixed(2)), { message: "Dollar amount mist have up to two decimal places" });

const iso8601DateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateSchema = z
  .string({ invalid_type_error: "Date must be a string." })
  .regex(iso8601DateRegex, { message: "Date must be in ISO 8601 format (YYYY-MM-DD)." })
  .transform((value) => new Date(value));

const baseNameSchema = z
  .string({ invalid_type_error: "Name must be a string." })
  .trim()
  .max(100, { message: "Name must be no more than 100 characters long." })
  .regex(/^[A-Za-z\s&.-]+$/, { message: "Name can only contain letters, numbers, spaces, and & or -." });

export const claimSchema = z.object({
  claim_id: z.number().int({ message: "Provider ID must be an integer." }).min(100000000000, { message: "Claim ID must be at least 12 digits long." }),
  subscriber_id: z.string().regex(/^[a-zA-Z]\d{7}[a-zA-Z]{2}$/, {
    message: "Invalid Subscriber ID. It must be exactly 10 characters long, start with a letter, followed by 7 digits, and end with 2 letters (e.g., A1234567BC).",
  }),
  member_sequence: z.number().int().min(0, { message: "Value must be at least 0." }).max(9, { message: "Value must be no more than 9." }),
  claim_status: z.enum(["Payable", "Denied", "Partial Deny"]).refine((value) => ["Payable", "Denied", "Partial Deny"].includes(value), {
    message: "Invalid claim status. It can only be 'Payable', 'Denied', or 'Partial Deny'.",
  }),
  billed: dollarAmountSchema,
  allowed: dollarAmountSchema,
  paid: dollarAmountSchema,
  payment_status_date: dateSchema,
  service_date: dateSchema,
  received_date: dateSchema,
  entry_date: dateSchema,
  processed_date: dateSchema,
  paid_date: dateSchema,
  payment_status: z
    .enum(["Paid", "Pending", "Partial Payment", "Denied", "Refunded"])
    .refine((value) => ["Paid", "Pending", "Partial Payment", "Denied", "Refunded"].includes(value), {
      message: "Inavlid payment status. It can only be 'Paid', 'Pending', 'Partial Payment', 'Denied', 'Refunded'",
    }),
  group_name: baseNameSchema.refine((value) => value.length >= 2, { message: "Group Name must be at least 2 characters long" }),
  group_id: z.string().regex(/^[A-Z]{3}\d{3}$/, { message: "Group ID mist be 6 characters long, the first three being capital letters and the last 3 being numbers" }),
  division_name: baseNameSchema.refine((value) => value.length >= 2, { message: "Division Name must be at least 2 characters long" }),
  division_id: z
    .string({ invalid_type_error: "Division Name must be a string." })
    .min(1, { message: "Division Name must be at least 1 character long." })
    .max(100, { message: "Division Name must be no more than 100 characters long." })
    .regex(/^[A-Za-z0-9\s&-]+$/, { message: "Division Name can only contain letters, numbers, spaces, and & or -." }),
  plan: baseNameSchema.refine((value) => value.length >= 2, { message: "Plan must be at least 2 characters long" }),
  plan_id: z.string().regex(/^[A-Z]{3}\d{3}$/, { message: "Plan ID mist be 6 characters long, the first three being capital letters and the last 3 being numbers" }),
  place_of_service: z
    .enum(["Outpatient Hospital", "Inpatient Hospital", "Emergency Room - Hospital"])
    .refine((value) => ["Outpatient Hospital", "Inpatient Hospital", "Emergency Room - Hospital"].includes(value), {
      message: "Invalid payment status. It can only be 'Outpatient Hospital', 'Inpatient Hospital', 'Emergency Room - Hospital'",
    }),
  claim_type: z
    .enum(["Professional", "Institutional"])
    .refine((value) => ["Professional", "Institutional"].includes(value), { message: "Invalid claim type. It can only be 'Professional' or 'Institutional" }),
  procedure_code: z.string().regex(/^[a-zA-Z]{1}\d{4}$/, { message: "Procedure code must be 5 characters long, starting with one letter followed by four digits (e.g., A1234).s" }),
  member_gender: z.enum(["Female", "Male"]).refine((value) => ["Female", "Male"].includes(value), { message: "Invalid member gender. It can only be 'Female' or 'Male'" }),
  provider_id: z
    .number()
    .int({ message: "Provider ID must be an integer." })
    .min(1000000, { message: "Provider ID must be at least 7 digits long." })
    .max(9999999999, { message: "Provider ID must be no more than 10 digits long." }),
  provider_name: z
    .string({ invalid_type_error: "Provider name must be a string." })
    .trim()
    .min(2, { message: "Provider name must be at least 2 characters long." })
    .max(100, { message: "Provider name must be no more than 100 characters long." })
    .regex(
      /^(Mr\. |Mrs\. |Ms\. |Dr\. |)([A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*)(?:\s(Jr\.|Sr\.|II|III|IV))?$/,

      {
        message: "Provider name must start with an uppercase letter and may contain multiple words separated by spaces, each starting with an uppercase letter (e.g., John Doe).",
      },
    ),
});
