import Logo from "@/assets/images/logo.png";
import { useAppSelector } from "@/store/index";
import { isJson } from "@/utils/index";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const Advertisement = () => {
  const activeAbout = useAppSelector((state) => state.aboutUs.aboutUsSelected);

  const logo = useMemo(() => {
    return isJson(activeAbout?.logo)
      ? JSON.parse(activeAbout?.logo)[0].url
      : Logo;
  }, [activeAbout]);

  return (
    <div className="advertisement layout__footer-contain">
        <div className="util__logo">
          {/* <Link to="/">
            <img width="200" height="100" src={logo} alt="noithatbanghe" />
          </Link> */}
        </div>
        <div className="advertisement__content">
            <p>Reveal yourself through your choice</p>
        </div>
    </div>
  );
};

export default Advertisement;
