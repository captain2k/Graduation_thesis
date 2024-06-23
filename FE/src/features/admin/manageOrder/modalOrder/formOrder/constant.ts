import * as yup from "yup";

export const schema = yup
    .object({
        name: yup
            .string(),
        email: yup
            .string(),
        phone_number: yup
            .string(),
        address: yup
            .string(),
        note: yup
            .string(),
        order_status: yup
            .string(),
        id: yup
            .number(),
    })
    .required();

export type FormData = yup.InferType<typeof schema>;

export const optionStatusOrder = [
    { value: "pending", label: "pending" },
    
    { value: "confirmed", label: "confirmed" },
   
    { value: "cancelled", label: "cancelled" },
    
]