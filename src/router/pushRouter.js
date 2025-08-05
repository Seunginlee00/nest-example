// src/router/pushRouter.js

export default [
    {
        path: 'list',
        name: 'PushList',
        component: () => import('@pages/push/ListPage.vue'),
    },
    {
        path: '',
        redirect: { name: 'PushList' }, // 기본 경로는 list로 리다이렉트
    },
    {
        path: 'add',
        name: 'PushAdd',
        component: () => import('@pages/push/AddPage.vue'),
    },
    {
        path: 'read/:pno',
        name: 'PushRead',
        component: () => import('@pages/push/ReadPage.vue'),
        props: true, // :pno 를 props로 받도록 설정
    },
    {
        path: 'modify/:pno',
        name: 'PushModify',
        component: () => import('@pages/push/ModifyPage.vue'),
        props: true,
    },
];
