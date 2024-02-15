import useResizeWindow from "@/hoc/useWindow";
import { Layout } from "antd";
import MenuNavbar from "./menuNavbar";
import { useAppSelector } from "@/store/index";
import { useEffect, useState } from "react";
import images from '@/constants/images';

const { Sider } = Layout;

interface Props {
  collapsed: boolean;
  setCollapsed: (collapsed: any) => void;
}

const SideBar = ({ collapsed, setCollapsed }: Props) => {
  const resize = useResizeWindow();
  const [avatar, setAvatar] = useState<string>('');
  const userInfo = useAppSelector((state) => state.user);
  
  // const avatar = JSON.parse(userInfo.avatar)
  console.log("🚀 ~ userInfo:", userInfo, avatar)

  useEffect(() => {
    const imageAvatar = userInfo.avatar && JSON.parse(userInfo.avatar);
    setAvatar(imageAvatar ? imageAvatar.url : images.AvatarDefault)
  }, [userInfo])

  return (
    <Sider
      //pc
      trigger={resize.width >= 1200 ? null : undefined}
      collapsible={true}
      collapsed={collapsed}
      //tablet and phone
      breakpoint={resize.width < 1200 ? "xxl" : undefined}
      collapsedWidth={resize.width < 1200 ? "0" : undefined}
      onBreakpoint={(broken) => {
        setCollapsed((collapse) => !collapse);
      }}
      onCollapse={(collapsed, type) => {
        setCollapsed((collapse) => !collapse);
      }}
    >
      <div className="logo__admin-vertical">
        <div className="user__image">
          <img src={avatar} alt={userInfo.fullName} />
        </div>
        <div className="user__name">{userInfo.fullName} </div>
      </div>
      <MenuNavbar />
    </Sider>
  );
};

export default SideBar;
