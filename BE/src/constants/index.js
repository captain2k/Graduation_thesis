export const ROLE_USER = {
  ADMIN: 1,
  USER: 2,
  SHIPPER: 3,
}

export const menu = [
  {
    id: 1,
    label: "Manage users",
    href: "/admin/manage-users",
    role: [ROLE_USER.ADMIN],
    icon: "sale_contract_management",
  },
  {
    id: 2,
    label: "Manage Category",
    href: "/admin/manage-category",
    role: [ROLE_USER.ADMIN],
    icon: "expense",
  },
  {
    id: 3,
    label: "Manage Products",
    href: "/admin/manage-products",
    role: [ROLE_USER.ADMIN],
    icon: "progress",
  },
  // {
  //   id: 4,
  //   label: "Manage News",
  //   href: "/admin/manage-news",
  //   role: [ROLE_USER.ADMIN],
  //   icon: "manage_service_contract",
  // },
  {
    id: 5,
    label: "Manage order",
    href: "/admin/manage-order",
    role: [ROLE_USER.ADMIN],
    icon: "manage_service_contract",
  },
  {
    id: 6,
    label: "Contact",
    href: "/admin/manage-contact",
    role: [ROLE_USER.ADMIN],
    icon: "manage_service_contract",
  },
  {
    id: 7,
    label: "Setting static",
    href: "/admin/setting_static",
    role: [ROLE_USER.ADMIN],
    icon: "manage_service_contract",
  },
  {
    id: 8,
    label: "About Us",
    href: "/admin/about-us",
    role: [ROLE_USER.ADMIN],
    icon: "manage_service_contract",
  },
  {
    id: 9,
    label: "Statistical",
    href: "/admin/statistical",
    role: [ROLE_USER.ADMIN],
    icon: "manage_service_contract",
  },
  {
    id: 10,
    label: "Screen User",
    href: "/",
    role: [ROLE_USER.ADMIN],
    icon: "manage_service_contract",
  },
];

export const menu_user = [
  {
    id: 0,
    label: "Trang chủ",
    href: "/",
    role: [ROLE_USER.ADMIN, ROLE_USER.USER, ROLE_USER.SHIPPER],
  },
  {
    id: 1,
    label: "Giới Thiệu",
    href: "/introduce",
    role: [ROLE_USER.ADMIN, ROLE_USER.USER, ROLE_USER.SHIPPER],
  },
  {
    id: 2,
    label: "Sản Phẩm",
    href: "/product",
    role: [ROLE_USER.ADMIN, ROLE_USER.USER, ROLE_USER.SHIPPER],
  },
  {
    id: 3,
    label: "Tin Tức",
    href: "/news",
    role: [ROLE_USER.ADMIN, ROLE_USER.USER, ROLE_USER.SHIPPER],
  },
  {
    id: 4,
    label: "Liên Hệ",
    href: "/contact",
    role: [ROLE_USER.ADMIN, ROLE_USER.USER, ROLE_USER.SHIPPER],
  },
  {
    id: 5,
    label: "Admin",
    href: "/admin",
    role: [ROLE_USER.ADMIN],
  },
];

export const TYPE_WS = {
  PING: 'PING',
  PONG: 'PONG',
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
}

export const TYPE_LOGIN_PROVIDER = {
  LOCAL: 'local',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
}

export const TYPE_GENDER = {
  MALE: '1',
  FEMALE: '2',
  OTHER: '3',
}

export const TYPE_ROLE_USER = {
  ADMIN: '1',
  USER: '2',
  SHIPPER: '3',
}

export const TYPE_USER_ACTIVE = {
  NON_ACTIVE: '0',
  ACTIVE: '1',
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
}
