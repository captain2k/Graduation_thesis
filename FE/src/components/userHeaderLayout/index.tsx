import { useEffect, useMemo, useRef, useState } from "react";
import styled from "./index.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NavBarUser from "./navMobile.tsx/index.tsx";
import useResizeWindow from "@/hoc/useWindow.tsx";
import Logo from "@/assets/images/logo.png";
import UtilUser from "./utilUser/index.tsx";
import { RootState, useAppDispatch, useAppSelector } from "@/store/index.ts";
import { searchOrder } from "@/store/orderUser/index.ts";
import userApi from "@/api/user.ts";
import { Skeleton } from "antd";
import { isJson, NotificationError } from "@/utils/index.ts";
import { debounce } from "lodash";

const UserLayoutHeader = () => {
  const resize = useResizeWindow();
  const [headerFixed, setHeaderFixed] = useState<boolean>(false);
  const [menu, setMenu] = useState<metadataMenu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const idUser = useAppSelector((state: RootState) => state.user.id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>();

  const activeAbout = useAppSelector((state) => state.aboutUs.aboutUsSelected);

  // const logo = useMemo(() => {
  //   return isJson(activeAbout?.logo)
  //     ? JSON.parse(activeAbout?.logo)[0].url
  //     : Logo;
  // }, [activeAbout]);

  const handleSetSearch = (e) => {
    const name_search = e.target.value;

    if(inputRef.current) {
      inputRef.current.value = '';
    }
  
    navigate('/product', {state: {name: name_search}})
  };

  const handleScroll = () => {
    const heightViewPort = window.scrollY;

    if (heightViewPort > 1500) {
      setHeaderFixed(true);
    }

    if (heightViewPort < 50) {
      setHeaderFixed(false);
    }
  };

  const handleGetMenu = async () => {
    try {
      const { metadata } = await userApi.getMenuUser();
      const unusedMenu = metadata?.filter(item => item.href !== '/introduce' && item.href !== '/news')
      setMenu(unusedMenu);
      setLoading(false);
    } catch (error) {
      NotificationError(error);
    }
  };

  useEffect(() => {
    if (idUser) {
      dispatch(
        searchOrder({ order_status: "pending", user_id: idUser, limit: 1 })
      );
    }
  }, [idUser]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    handleGetMenu();
  }, []);


  const propertyHeader = {
    className: headerFixed
      ? `${styled["header_page"]} ${styled["add__fixed"]} ${styled["stuckModeDown"]}`
      : styled["header_page"],
  };

  return (
    <article>
      <header {...propertyHeader}>
        <div
          className={
            headerFixed
              ? "header__wrapper stuck stuckModeDown"
              : "header__wrapper"
          }
        >
          <div className="header_wrapper-util">
            <div className="container header_wrapper-util-container">
              <div className="util__search">
                <div className="util__search-input">
                  {resize.width >= 850 ? (
                    <>
                      <input
                      ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm..."
                        onChange={debounce(handleSetSearch, 500)}
                      />
                      <SearchOutlined />
                    </>
                  ) : (
                    <NavBarUser menu={menu}/>
                  )}
                </div>
              </div>
              {/* <div className="util__logo">
                <Link to="/">
                  <img
                    width="200"
                    height="100"
                    src={logo}
                    alt="noithatbanghe"
                  />
                </Link>
              </div> */}
              <UtilUser />
            </div>
          </div>
          {resize.width >= 850 ? (
            <div className="header_wrapper-products">
              {loading ? (
                <Skeleton active paragraph={{ rows: 0 }} />
              ) : (
                menu?.map((item, index) => {
                  return (
                    <div className="wrapper__product" key={index}>
                      <NavLink to={item.href}>
                        {({ isActive }) => (
                          <h5 className={isActive ? "active" : ""}>
                            {item.label}
                          </h5>
                        )}
                      </NavLink>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </header>
    </article>
  );
};

export default UserLayoutHeader;
