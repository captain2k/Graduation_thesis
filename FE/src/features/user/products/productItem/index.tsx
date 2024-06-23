import { RootState, useAppDispatch, useAppSelector } from "@/store/index";
import { setPagination } from "@/store/manageProducts";
import { useEffect, useMemo } from "react";
import styled from "./index.module.scss";
import { Col, Row, Spin, Tooltip } from "antd";
import lodash from "lodash";
import Images from "@/constants/images";
import { NotificationError, formatCurrency, handleURL, messageOrderTooLimit } from "@/utils/index";
import orderApi from "@/api/order";
import orderDetailApi from "@/api/orderDetail";
import Notification from "@/components/notificationSend";
import { statusCode } from "@/constants/index";
import { searchOrder } from "@/store/orderUser";
import AOS from "aos";
import "aos/dist/aos.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import TEXT_COMMON from "@/constants/text";

interface Props {
  handleScrollPage: any;
}

const ProductItem = ({handleScrollPage}: Props) => {
  const listProduct = useAppSelector(
    (state: RootState) => state.manageProduct.productList
  );
  const orderId = useAppSelector((state: RootState) => state.order.id);
  const list_order = useAppSelector((state: RootState) => state.order.list_order);
  const pagination = useAppSelector((state: RootState) => state.manageProduct.pagination)
  const countProduct = useAppSelector(
    (state: RootState) => state.manageProduct.total
  );
  const userId = useAppSelector((state: RootState) => state.user.id);

  const dispatch = useAppDispatch();

  const productInOrder = useMemo(() => {
    return list_order.map((order) => {
      return order.productId;
    });
  }, [list_order]);

  const handleAddOrderDetail = async (product) => {
    try {
      if(!userId) {
        Notification({
          type: 'error',
          message: TEXT_COMMON.ERROR_TEXT.NOTIFY_MESSAGE,
          description: TEXT_COMMON.ERROR_TEXT.ORDER_AUTH,
        });

        return;
      }
      if (product?.stock_quantity < 1) {
        Notification({
          type: 'error',
          message: TEXT_COMMON.ERROR_TEXT.NOTIFY_MESSAGE,
          description: messageOrderTooLimit(product.stock_quantity, 1),
        });
  
        return;
      }

      let order_id = orderId;

      if (!order_id) {
        const { metadata } = await orderApi.createOrder({ user_id: userId });
        order_id = metadata.id;
      }

      const { status, message } = await orderDetailApi.createOrderDetail({
        order_id,
        productId: product.id,
        quantity: 1,
      });
      if (status === statusCode.CREATED || status === statusCode.UPDATED) {
        Notification({
          message: TEXT_COMMON.SUCCESS_TEXT.NOTIFY_MESSAGE,
          description: message,
        });

        dispatch(
          searchOrder({ order_status: "pending", user_id: userId, limit: 1 })
        );
      }
    } catch (error) {
      NotificationError(error);
    }
  };

  const handleFetchScroll = (pagination) => {
    handleScrollPage(pagination)
    dispatch(setPagination({...pagination}))
  }

  //init aos
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  return (
    <div className={styled["product__list"]}>
      <div className="product__list-total">
        <div className="list__total-number">
          Hiện thị tất cả {countProduct} kết quả
        </div>
      </div>
      <div className="product__list-content">
        {!lodash.isEmpty(listProduct) ? (
          <InfiniteScroll
            dataLength={listProduct.length}
            next={() => {
              const {current} = pagination;

              handleFetchScroll({...pagination, current: Number(current) + 1})
            }}
            hasMore={listProduct.length < countProduct}
            loader={<Spin />}
          >
            <Row gutter={[30, 30]}>
              {listProduct.map((product, index) => {
                const image = handleURL(product.images);
                return (
                  <Col
                    md={8}
                    span={12}
                    key={index}
                    data-aos="fade-right"
                    data-aos-delay={"200"}
                  >
                    <div className="product_item-content">
                      <div className="item__content-image">
                      <Link to={`/product/${product.id}`} >
                        <img src={image.url} alt={product.description} />
                      </Link>
                      <div className="shopping_card" onClick={(e) => e.preventDefault()}>
                          {productInOrder.includes(product.id) ? (
                            <Link to={`/cart`} className="shopping__card-exists">
                              Xem giỏ hàng →
                            </Link>
                          ) : (
                            <Tooltip placement="top" title="Thêm vào giỏ">
                              <strong
                                onClick={() => handleAddOrderDetail(product)}
                                className="icon__shopping"
                              >
                                +
                              </strong>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    
                      <div className="item__content-price">
                        <p className="item__type">{product.category_name}</p>
                        <p className="item_name">
                          <a>{product.name}</a>
                        </p>
                        <p className="item_price">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </InfiniteScroll>
        ) : (
          <Row gutter={[30, 30]}>
            <Col sm={6} xs={12}>
              <div className="product_item-content">
                <div className="item__content-image">
                  <img src={Images.StoreEmpty} alt="store empty" />
                </div>
                <div className="item__content-price">
                  <p className="item__type">empty product</p>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
