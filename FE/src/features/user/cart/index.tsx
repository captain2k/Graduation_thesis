import { useState } from "react";
import styled from "./index.module.scss";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import TableCart from "./tableCart";
import TotalCart from "./TotalCart";
import TEXT_COMMON from "@/constants/text";

const CartOrder = () => {
  const [dataOrder, setDataOrder] = useState<OrderDetailState[]>([]);
  
  return (
    <div className={styled["cart__main"]}>
      <div className="cart__main-container">
      <div className="cart__main-title cart__order">
        <div className="main__title-link">
          <Link to="/">{TEXT_COMMON.SHOW_TEXT.HOME_PAGE}</Link>
          <span>&gt;</span>{TEXT_COMMON.SHOW_TEXT.CART}
        </div>
        <div className="main__title-text">{TEXT_COMMON.SHOW_TEXT.CART}</div>
      </div>
      <div className="cart__main-content  cart__order">
        <Row gutter={[16, 16]}>
          <Col span={24} md={16} className="main__content-update">
            <TableCart dataOrder={dataOrder} setDataOrder={setDataOrder} />
          </Col>
          <Col span={24} md={8} className="main__content-information">
            <TotalCart dataOrder={dataOrder}/>
          </Col>
        </Row>
      </div>
      </div>
    </div>
  );
};

export default CartOrder;
