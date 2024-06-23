import {
  NotificationError,
  formatCurrency,
  isJson,
  messageOrderTooLimit,
} from "@/utils/index";
import { useEffect, useMemo, useState } from "react";
import styled from "./index.module.scss";
import { Col, Row } from "antd";
import { TYPE_ADD_MINUS, statusCode } from "@/constants/index";
import { RootState, useAppDispatch, useAppSelector } from "@/store/index";
import orderDetailApi from "@/api/orderDetail";
import orderApi from "@/api/order";
import Notification from "@/components/notificationSend";
import { searchOrder } from "@/store/orderUser";
import Images from "@/constants/images";
import { Image } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import ModalComment from "./comments";
import TEXT_COMMON from "@/constants/text";

interface Props {
  product: ProductState | null;
}

const ProductContent = ({ product }: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const listOrder = useAppSelector(
    (state: RootState) => state.order.list_order
  );
  const orderId = useAppSelector((state: RootState) => state.order.id);
  const userId = useAppSelector((state: RootState) => state.user.id);
  const [imageSelected, setImageSelected] = useState({
    url: Images.StoreEmpty,
  });

  console.log(product, 'product');
  

  const dispatch = useAppDispatch();

  const images = useMemo(() => {
    return product?.images && isJson(product?.images)
      ? JSON.parse(product?.images)
      : [];
  }, [product]);

  const handleSetData = (type) => {
    if (type === TYPE_ADD_MINUS.MINUS && quantity <= 1) return;

    if (type === TYPE_ADD_MINUS.ADD) {
      setQuantity((prev) => prev + 1);
    }

    if (type === TYPE_ADD_MINUS.MINUS && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddOrderDetail = async (product) => {
    try {
      let order_id = orderId;

      if (!order_id) {
        const { metadata } = await orderApi.createOrder({ user_id: userId });
        order_id = metadata.id;
      }

      if (quantity > product?.stock_quantity) {
        Notification({
          type: "error",
          message: TEXT_COMMON.ERROR_TEXT.NOTIFY_MESSAGE,
          description: messageOrderTooLimit(product.stock_quantity, quantity),
        });

        return;
      }

      const { status, message } = await orderDetailApi.createOrderDetail({
        order_id,
        productId: product.id,
        quantity: quantity,
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

  const handleAddOrder = async () => {
    if(!userId) {
      Notification({
        type: "error",
        message: TEXT_COMMON.ERROR_TEXT.NOTIFY_MESSAGE,
        description: TEXT_COMMON.ERROR_TEXT.ORDER_AUTH,
      });

      return;
    }
    const orderExist = listOrder.find(
      (order) => order.productId === product?.id
    );

    if (!orderExist) {
      handleAddOrderDetail(product);
      return;
    }

    const totalQuantity = orderExist.quantity + quantity;

    if (totalQuantity > orderExist.stock_quantity) {
      Notification({
        type: "error",
        message: TEXT_COMMON.ERROR_TEXT.NOTIFY_MESSAGE,
        description: messageOrderTooLimit(
          orderExist.stock_quantity,
          totalQuantity
        ),
      });

      return;
    }

    const { status, message } = await orderDetailApi.createOrderDetail({
      order_id: orderId,
      productId: product?.id,
      quantity: totalQuantity,
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
  };

  useEffect(() => {
    const [imageFirst] = images;
    if (imageFirst) {
      setImageSelected(imageFirst);
    }
  }, [images]);

  return (
    <div className={styled["detail__content-item"]}>
      <Row gutter={[16, 16]}>
        <Col span={24} md={14}>
          <div className="content__item-image">
            <Image src={imageSelected.url} alt={product?.name} />
          </div>
          <div className="content__item-list">
            <Row gutter={[16, 16]} justify={"center"}>
              {images.map((image, index) => {
                return (
                  <Col
                    span={4}
                    key={index}
                    className="item__list-item"
                    onClick={() => setImageSelected(image)}
                  >
                    <img src={image.url} alt="" />
                  </Col>
                );
              })}
            </Row>
          </div>
        </Col>
        <Col span={24} md={10}>
          {product ? (
            <div className="content__item-info">
              <div className="item__info-name">
                <h1>{product?.name}</h1>
              </div>
              <div className="item__info-price">
                <span>{formatCurrency(product?.price)} {TEXT_COMMON.SHOW_TEXT.CURRENT_ENDPOINT}</span>
              </div>
              <div className="item__info-description">
                <p>{product?.description}</p>
              </div>
              <div className="item__info-order">
                <div className="btn__order">
                  <button
                    className={quantity <= 1 ? "btn__disabled" : ""}
                    onClick={() =>
                      quantity > 1 && handleSetData(TYPE_ADD_MINUS.MINUS)
                    }
                  >
                    -
                  </button>
                  {quantity}
                  <button onClick={() => handleSetData(TYPE_ADD_MINUS.ADD)}>
                    +
                  </button>
                </div>
                <div className="btn__order-add">
                  <button onClick={handleAddOrder}> Thêm vào giỏ</button>
                </div>
              </div>
              <div className="item__info-category">
                <p>
                  Danh mục: <span>{product?.category_name}</span>
                </p>
              </div>
              {/* <div className="item__info-comment">
                <ModalComment
                  width={800}
                  product={product}
                  content={
                    <p>
                      <CommentOutlined /> Hỏi và đáp (Comment)
                    </p>
                  }
                />
              </div> */}
            </div>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

export default ProductContent;
