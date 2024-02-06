import React from "react";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { ROlE, TAG_ROLE, statusCode } from "@/constants/index";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import images from "@/constants/images";
import ModalEdit from "./modalEdit";
import { useAppDispatch } from "@/store/index";
import { deleteUser, setPagination, setUserSelected } from "@/store/manageUser";
import ModalConfirm from "@/components/confirm";
import userApi from "@/api/user";
import { eventEmitter } from "@/utils/index";
import Notification from "@/components/notificationSend";
import SearchUser from "./searchUser";
interface Props {
  loading?: boolean;
  userList: UserState[];
  pagination: basePagination;
  total: number;
}

const TableSaleContractManage = ({
  loading = false,
  userList = [],
  pagination,
  total,
}: Props) => {
  const dispatch = useAppDispatch();

  const handleDeleteUser = async (id) => {
    try {
      const { message, status } = await userApi.deleteUser(id);

      if (status === statusCode.DELETED) {
        dispatch(deleteUser(id));

        eventEmitter.emit("submit_modal");

        Notification({
          message: message,
          description: "Delete user success",
        });
      }
    } catch (e: unknown) {
      throw new Error((e as Error).message);
    }
  };

  const columns: ColumnsType<UserState> = [
    {
      title: "NAME",
      dataIndex: "fullName",
      key: "fullName",
      width: 100,
      render: (name: string, row: UserState) => {
        const avatar = row.avatar && JSON.parse(row.avatar);
       
        return (
          <div className="content__name">
            <div className="content__name-image">
              <img
                src={avatar?.url || images.AvatarDefault}
                alt="image description"
              />
            </div>
            <div className="content__name-info">
              <h5>{name}</h5>
              <span>{row.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "ADDRESS",
      dataIndex: "address",
      key: "address",
      width: 140,
    },
    {
      title: "DATE OF BIRTH",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      sorter: true,
      width: 100,
      render: (date: string) => {
        return <> {moment(date).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 70,
    },
    {
      title: "ROLE",
      dataIndex: "role_user",
      key: "role_user",
      align: "center",
      width: 30,
      render: (role: string) => {
        return <Tag color={TAG_ROLE[role]}>{ROlE[role]}</Tag>;
      },
    },
    {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      width: 130,
      render: (action: unknown, row: UserState) => (
        <>
          <ModalEdit
            destroyOnClose={true}
            title="Edit user"
            width={800}
            content={
              <Tag
                color="blue"
                className="tag__action"
                onClick={() => dispatch(setUserSelected(row))}
              >
                <EditOutlined /> EDIT
              </Tag>
            }
          />
          <ModalConfirm
            title="Delete user"
            description="Are you sure to delete this user?"
            handleConfirm={() => handleDeleteUser(row.id)}
          >
            <Tag color="red" className="tag__action">
              <DeleteOutlined /> DELETE
            </Tag>
          </ModalConfirm>
        </>
      ),
    },
  ];

  const onChangePagination = (page: number, size: number) => {
    dispatch(setPagination({current: page, pageSize: size}))
  }

  return (
    <div className="table__sale-contract">
      <div className="table__title">
        <SearchUser />
      </div>
      <Table
        // size="large"
        pagination={{ ...pagination, total: total, showSizeChanger: true, onChange: onChangePagination}}
        loading={loading}
        columns={columns}
        dataSource={userList}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default TableSaleContractManage;
