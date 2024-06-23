import { useAppSelector } from "@/store/index";

const AboutMe = () => {
  const activeAbout = useAppSelector((state) => state.aboutUs.aboutUsSelected);

  return (
    <div className="aboutMe layout__footer-contain">
      <div className="aboutMe__title">
        <h3>Thông tin liên hệ</h3>
      </div>
      <div className="aboutMe__content">
        <div className="aboutMe__content-field">
          <p><span>Address:</span> 125 Lê Thanh Nghị, HBT, Hà Nội</p>
        </div>
        <div className="aboutMe__content-field">
          <p><span>Telephone:</span> 0919013030</p>
        </div>
        <div className="aboutMe__content-field">
          <p><span>Email:</span> wheystore@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default AboutMe