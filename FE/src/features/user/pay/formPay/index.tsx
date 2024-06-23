import { InputComponent, TextAreComponent } from "@/components/form";
import Notification from "@/components/notificationSend";
import { NotificationError } from "@/utils/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Form, Row } from "antd";
import { useForm } from "react-hook-form";
import { FormData, schema } from "./constant";
import styled from "./index.module.scss";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import orderApi from "@/api/order";
import { isEmpty } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { resetOrderList } from "@/store/orderUser";
import TEXT_COMMON from "@/constants/text";

interface Props {
  order_id: number;
  dataOrder: OrderDetailState[];
}

const FormPay = ({ order_id, dataOrder }: Props, ref) => {
  const orderInfo = useAppSelector((state) => state.order.userInfo);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormData) => {
    try {
      if (!dataOrder || isEmpty(dataOrder)) {
        Notification({
          type: "warning",
          message: TEXT_COMMON.ERROR_TEXT.NOTIFY_WARNING_MESSAGE,
          description: TEXT_COMMON.ERROR_TEXT.WARNING_PRE_ORDER,
        });

        return;
      }

      const { message } = await orderApi.updateOrder({
        ...data,
        id: order_id,
        order_status: "pending",
      });

      Notification({
        message: TEXT_COMMON.SUCCESS_TEXT.NOTIFY_MESSAGE,
        description: message,
      });

      dispatch(resetOrderList());
      reset();
    } catch (error: unknown) {
      NotificationError(error);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      submit: handleSubmit(onSubmit),
    };
  });

  useEffect(() => {
    setValue('name', orderInfo.name)
    setValue('address', orderInfo.address)
    setValue('email', orderInfo.email)
    setValue('phone_number', orderInfo.phone_number)
  }, [orderInfo])

  return (
    <div className={styled["form__pay"]}>
      <Form name="change__field-category" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={[16, 0]}>
          <Col span={24} md={12}>
            <InputComponent
              name="name"
              control={control}
              errors={errors}
              className="remove__border"
              labelCol={{ span: 24 }}
              label="Họ và tên"
            />
          </Col>
          <Col span={24} md={12}>
            <InputComponent
              name="phone_number"
              control={control}
              errors={errors}
              className="remove__border"
              labelCol={{ span: 24 }}
              label="Số điện thoại"
            />
          </Col>
          <Col span={24}>
            <InputComponent
              name="email"
              control={control}
              errors={errors}
              className="remove__border"
              labelCol={{ span: 24 }}
              label="Email"
            />
          </Col>
          <Col span={24}>
            <InputComponent
              name="address"
              control={control}
              errors={errors}
              className="remove__border"
              labelCol={{ span: 24 }}
              label="Địa chỉ"
            />
          </Col>
          <Col span={24}>
            <TextAreComponent
              name="note"
              control={control}
              errors={errors}
              label="Ghi chú về đơn hàng"
              className="remove__border"
              rows={4}
              labelCol={{ span: 24 }}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default forwardRef(FormPay);
