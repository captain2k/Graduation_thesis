import { useEffect, useState } from "react";
import styled from "./index.module.scss";
import Banner from "./banner";
import Products from "./products";
import Benefit from "./benefit";
import BestOffer from "./bestOffer";
import staticApi from "@/api/static";
import MainPageContext, { defaultValueMainPage } from "./constant";

const MainPage = () => {
  const [staticHomePage, setStaticHome] =
    useState<StaticPageState>(defaultValueMainPage);
  const productShow = staticHomePage?.productShow;

  // useEffect(() => {
  //   handleGetStaticHome();
  // }, []);

  const handleGetStaticHome = async () => {
    const { metadata } = await staticApi.getStaticPage({
      type: 1,
      limitProduct: 8,
    });

    setStaticHome(metadata);
  };

  return (
    <MainPageContext.Provider value={staticHomePage}>
      <div className={styled["main__page"]}>
        <div className="main__page-banner">
          <Banner />
        </div>
        <div className="main__page-product">
          <Products dataProduct={productShow?.top1} />
        </div>
        <div className="main__page-benefit">
          <Benefit />
        </div>
        <div className="main__page-product">
          <Products dataProduct={productShow?.top2} />
        </div>
        <div className="main__page-bestOffer">
          <BestOffer />
        </div>
        <div className="main__page-product">
          <Products dataProduct={productShow?.top3} />
        </div>
        {/* <div className="main__useful-information">
          <UseFulInformation />
        </div> */}
      </div>
    </MainPageContext.Provider>
  );
};

export default MainPage;
