import PublicLayout from '@/layouts/PublicLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SingInPage from '@/features/auth/singIn';
import SingUpPage from '@/features/auth/singUp';
import AdminLayout from '@/layouts/AdminLayout';

import PublicLayoutUser from '@/layouts/PublicLayoutUser';
import MainPage from '@/features/user/main';

import NotFound from '@/features/misc/NotFound';
import Admin from '@/features/admin';
import Introduce from '@/features/user/introduce';
import Forbidden from '@/features/misc/Forbidden';
import ManageUsers from '@/features/admin/manageUser';
import ManageCategory from '@/features/admin/manageCategory';
import ManageProduct from '@/features/admin/manageProducts';
import SettingStatic from '@/features/admin/settingStatic';
import CartOrder from '@/features/user/cart';
import Products from '@/features/user/products';
import ProductDetail from '@/features/user/productDetail';
import ManageNews from '@/features/admin/manageNews';
import News from '@/features/user/news';
import NewsDetail from '@/features/user/newsDetail';
import Verify from '@/features/misc/Verify';
import ActiveUser from '@/features/misc/ActiveUser';
import Contact from '@/features/user/contact';
import ManageContact from '@/features/admin/manageContact';
import PayComponent from '@/features/user/pay';
import ManageOrder from '@/features/admin/manageOrder';
import AboutUS from '@/features/admin/aboutUs';
import Purchase from '@/features/user/purchase';
import Statistical from '@/features/admin/statistical';

function RouterComponent() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayoutUser />,
      children: [
        {
          index: true,
          element: <MainPage />
        },
        {
          path: '/introduce',
          element: <Introduce />
        },
        {
          path: '/cart',
          element: <CartOrder />
        },
        {
          path: '/product',
          element: <Products />
        },
        {
          path: '/product/:id',
          element: <ProductDetail />
        },
        {
          path: '/news',
          element: <News />
        },
        {
          path: '/news/:id',
          element: <NewsDetail />
        },
        {
          path: '/contact',
          element: <Contact />
        },
        {
          path: "/pay",
          element: <PayComponent />
        },
        {
          path: "/purchase",
          element: <Purchase />
        },
      ]
    },
    {
      path: "/login",
      element: <PublicLayout />,
      children: [
        {
          index: true,
          element: <SingInPage />
        },
        {
          path: "sing-up",
          element: <SingUpPage />,
        },
      ]
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Admin />
        },
        {
          path: "manage-users",
          element: <ManageUsers />
        },
        {
          path: "manage-category",
          element: <ManageCategory />
        },
        {
          path: "manage-products",
          element: <ManageProduct />
        },
        {
          path: "manage-news",
          element: <ManageNews />
        },
        {
          path: "setting_static",
          element: <SettingStatic />
        },
        {
          path: "manage-contact",
          element: <ManageContact />
        },
        {
          path: "manage-order",
          element: <ManageOrder />
        },
        // {
        //   path: "about-us",
        //   element: <AboutUS />
        // },
        // {
        //   path: "statistical",
        //   element: <Statistical />
        // },
      ]
    },
    {
      path: "/verify-email",
      element: <Verify />
    },
    {
      path: "/active-user",
      element: <ActiveUser />
    },
    {
      path: "/Forbidden",
      element: <Forbidden />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default RouterComponent
