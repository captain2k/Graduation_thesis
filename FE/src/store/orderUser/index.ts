import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import orderApi from '@/api/order';
import { isJson } from '@/utils/index';

//redux thunk
export const searchOrder = createAsyncThunk(
    'users/searchOrder',
    async (params: paramSearchOrder): Promise<typeMetadataOrder> => {
        
        const { metadata } = await orderApi.searchOrder(params);
        return metadata;
    }
)

export const searchOrderAll = createAsyncThunk(
    'users/searchOrderAll',
    async (params: paramSearchOrder): Promise<typeMetadataOrder> => {
        const { metadata } = await orderApi.searchOrder(params);
        return metadata;
    }
)

const initialState: state_reducer_orderUser = {
    id: null,
    order_status: 'pending',
    loading: false,
    list_order: [],
    list__order_all: [],
    orderSelected: null,
    pagination: {
        current: 1,
        pageSize: 10,
    },
    total: 0,
    userInfo: {
        name: '',
        address: '',
        email: '',
        phone_number: ''
    }
}

export const orderUser = createSlice({
    name: 'order_user',
    initialState,
    reducers: {
        resetOrderList: (state) => {
            state.list_order = [];
            state.id = null;
            state.total = 0;
        },
        deleteOrder: (state, action: PayloadAction<number>) => {
            state.list_order = state.list_order.filter((item) => {
                return item.orderDetailId !== action.payload;
            })
        
            return state;
        },
        setOrderSelected: (state, action: PayloadAction<OrderState | null>) => {
            state.orderSelected = action.payload;
        },
        deleteOrderAll: (state, action: PayloadAction<number>) => {
            const id = action.payload;

            const { current, pageSize } = state.pagination;

            const maxPage = Math.ceil(state.total / (pageSize || 10));
            if (maxPage === state.pagination.current && state.list__order_all.length === 1 && Number(current) > 1) {
                state.pagination.current = Number(current) - 1
            }

            state.list__order_all = state.list__order_all.filter((category: OrderState) => {
                return category.id !== id;
            })
            state.total = state.total - 1;
        },
        editItemInOrderAll: (state, action: PayloadAction<OrderState>) => {
            const {id, ...value} = action.payload;

            state.list__order_all = state.list__order_all.map((order: OrderState) => {
                if(order.id === id) {
                    order = {...order, ...value}
                }

                return order;
            })
        },
        setPagination: (state, action: PayloadAction<basePagination>) => {
            state.pagination = { ...state.pagination, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(searchOrder.fulfilled, (state, action) => {
            const { rows, count } = action.payload;
            const [orderField] = rows;

          console.log(orderField, 'orderField');
          

            if(orderField) {
                const { id, order_status, order_detail, address, name, email, phone_number } = orderField;

                const list_order = order_detail.map(({ product_data, ...orderDetail }) => {
                    return {
                        orderDetailId: orderDetail.id,
                        productId: orderDetail.productId,
                        categoryId: product_data.category_id,
                        quantity: orderDetail.quantity,
                        name: product_data.name,
                        price: product_data.price,
                        stock_quantity: product_data.stock_quantity,
                        description: product_data.description,
                        images: isJson(product_data.images) ? JSON.parse(product_data.images) : [],
                    }
                })
    
                state = { ...state, loading: false, id, order_status, list_order, userInfo: {name, email, address, phone_number} };
            }
            state.total = count;

            return state;
        }).addCase(searchOrder.pending, (state) => {
            state = { ...state, loading: true }

            return state;
        }).addCase(searchOrder.rejected, (state) => {
            state = { ...state, loading: false }

            return state;
        })

        builder.addCase(searchOrderAll.fulfilled, (state, action) => {
            const { rows, count } = action.payload;
            state.loading = false;
            state.list__order_all = rows;
          
            state.total = count;

            return state;
        }).addCase(searchOrderAll.pending, (state) => {
            state = { ...state, loading: true }

            return state;
        }).addCase(searchOrderAll.rejected, (state) => {
            state = { ...state, loading: false }

            return state;
        })
        
    },
})

// Action creators are generated for each case reducer function
export const { 
    setOrderSelected, 
    deleteOrderAll, 
    deleteOrder, 
    editItemInOrderAll, 
    setPagination,
    resetOrderList
} = orderUser.actions
export default orderUser.reducer