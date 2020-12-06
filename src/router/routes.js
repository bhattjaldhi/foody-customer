const routes = [{
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        name: 'Main',
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        name: 'ShopDetails',
        path: 'shop_details/:shopId',
        props: true,
        component: () => import('pages/ShopDetails.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
