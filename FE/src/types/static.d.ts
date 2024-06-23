interface metadataStatic extends baseInstance {
    metadata: StaticState
}

interface StaticState {
    id: number,
    ImageSP: string,
    Images: string,
    type: number,
    productShow: string,
    createdAt?: string,
    updatedAt?: string,
}

interface listStaticState extends baseInstance {
    metadata: StaticState[]
}

interface metadataPageState extends baseInstance {
    metadata: StaticPageState
}

interface StaticPageState {
    id: number,
    ImageSP: string,
    Images: string,
    type: number,
    productShow: productShowStatic,
    createdAt?: string,
    updatedAt?: string,
}

interface productShowStatic {
    top1: topProductStatic,
    top2: topProductStatic,
    top3: topProductStatic,
}

interface topProductStatic {
    category_id: number,
    total: number,
    category_name: string,
    data: topDataProductStatic[]
}

interface topDataProductStatic {
    id: number,
    name: string,
    description: string,
    price: number,
    stock_quantity: number,
    category_id: number,
    images: string,
    createdAt?: string,
    updatedAt?: string
}

