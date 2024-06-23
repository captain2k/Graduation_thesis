import { Link } from "react-router-dom"

const Directional = () => {
  return (
    <div className='directional layout__footer-contain'>
        <div className="directional__title">
            <h3>Điều hướng</h3>
        </div>
        <div className="directional__list">
            <ul>
                <li><Link to='/'>Trang chủ</Link></li>
                {/* <li><Link to='/introduce'>Về chúng tôi</Link></li> */}
                <li><Link to='/product'>Sản phẩm</Link></li>
                {/* <li><Link to='/news'>Điểm tin hữu ích</Link></li> */}
                <li><Link to='/contact'>Liên hệ</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default Directional