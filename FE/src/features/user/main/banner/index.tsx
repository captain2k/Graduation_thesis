import { Carousel } from "antd";
import React, { useContext, useEffect, useState } from "react";
import ImageConstant from "@/constants/images";
import MainPageContext from "../constant";
import lodash from "lodash";

type imageState = {
  url: string;
  origin?: string;
  name?: string;
};

const Banner: React.FC = () => {
  const { Images } = useContext(MainPageContext);
  const [images, setImage] = useState<imageState[]>([]);

  useEffect(() => {
    const imageMain = Images ? JSON.parse(Images) : [];

    if (!lodash.isEmpty(imageMain)) {
      setImage(imageMain);
    } else {
      setImage([
        { url: ImageConstant.Banner1 },
        { url: ImageConstant.Banner2 },
      ]);
    }
  }, [Images]);

  return (
    <Carousel autoplay autoplaySpeed={3000} draggable>
      {images.map((image, index) => {
        return (
          <div className="carousel__img" key={index}>
            <div
              className="img__content"
              style={{ backgroundImage: `url(${image.url})` }}
            >
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

export default Banner;
