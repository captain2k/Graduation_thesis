import { Menu } from "antd";
import { MenuItem, getItem } from "./constants";
import userApi from "@/api/user";
import { useEffect, useState } from "react";
import { iconMenu } from "@/constants/index";
import { Skeleton } from "antd";
import { Link, useLocation } from "react-router-dom";
import { NotificationError } from "@/utils/index";

const skeleton = [
  getItem("Sketon", "1", <Skeleton active avatar />),
  getItem("Sketon", "2", <Skeleton active avatar />),
  getItem("Sketon", "3", <Skeleton active avatar />),
];

const MenuNavbar = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const handleGetMenu = async () => {
    try {
      setLoading(true);

      const { metadata } = await userApi.getMenu();

      const menu = metadata?.map((item: metadataMenu) => {
        const IconComponent = iconMenu[item.icon];

        return getItem(
          <Link to={item.href}>{item.label}</Link>,
          item.href,
          <IconComponent />
        );
      });

      setMenu(menu.filter(item => item.key !== "/admin/setting_static" && item.key !== "/admin/about-us" && item.key !== "/admin/statistical"));
    } catch (error) {
      NotificationError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    handleGetMenu();

    return () => abortController.abort();
  }, []);

  return (
    <>
      <Menu
        defaultSelectedKeys={["/admin/manage-users"]}
        selectedKeys={[location.pathname === '/admin' ? '/admin/manage-users' : location.pathname ]}
        mode="inline"
        theme="dark"
        items={loading ? skeleton : menu}
      />
    </>
  );
};

export default MenuNavbar;
