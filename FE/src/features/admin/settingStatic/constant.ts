import * as yup from "yup";

export const schema = yup
    .object({
        Images: yup
            .mixed(),
        ImageSP: yup
            .mixed(),
        type: yup
            .number()
            .required(),
        productShow: yup
            .array()
            .max(3, 'The number of element cannot exceed 3!'),
        id: yup
            .number(),
    })
    .required();

export type FormData = yup.InferType<typeof schema>;


export const optionTypeStaticPage = [
    { value: "1", label: "Home Page" },
    { value: "2", label: "Introduce" },
    { value: "3", label: "Product" },
    { value: "4", label: "Contact" },
]

type imageType = {
    name: string,
    origin: string,
    url: string,
}

export type initialValueType = {
    ImageSP: imageType[],
    Images: imageType[],
    productShow: number,
    type: number | null,
}

export const initialValue: initialValueType = {
    ImageSP: [],
    Images: [],
    productShow: null,
    type: null,
};