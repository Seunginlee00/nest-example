// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

// Lazy load 페이지
const EntryGate = () => import('@/pages/EntryGate.vue');
const About = () => import('@/pages/About.vue');
const PushIndex = () => import('@pages/push/IndexPage.vue');
const ErrorPage = () => import('@/pages/ErrorPage.vue');
const AccessDenied = () => import('@/pages/AccessDenied.vue'); // 추가

// 서브 라우터 정의 import
// import authRoutes from "@router/authRoutes.js";
// import memberRoutes from './memberRouter';
// import bwRoutes from './bwRouter.js';
import pushRoutes from './pushRouter.js';

const routes = [
  {
    path: '/',
    name: 'Entry',
    component: EntryGate,
    meta: { requiresAuth: true },
  },
  {
    path: '/push',
    component: PushIndex,
    meta: { requiresAuth: true },
    children: pushRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorPage,
    meta: { layout: 'Empty', showFooter: true }, // EmptyLayout 적용
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// IP 접속 체크 함수
// async function checkIpAccess() {
//   try {
//     const res = await axios.get(`${API_SERVER_HOST}/check-access`);
//     return res.data;
//   } catch (error) {
//     console.error('접속 확인 실패:', error);
//     return { success: false, data: 'Unknown' };
//   }
// }

// 글로벌 가드(공통 처리)
// router.beforeEach(async (to, from, next) => {
//   // 1단계: IP 접속 체크 (최우선)
//   // AccessDenied 페이지나 IP 체크 제외 페이지가 아닌 경우만 체크
//   // if (!to.meta.skipIpCheck && to.name !== 'AccessDenied') {
//   //   const ipCheckResult = await checkIpAccess();

//   //   if (!ipCheckResult.success) {
//   //     return next({
//   //       name: 'AccessDenied',
//   //       params: { ip: ipCheckResult.data },
//   //       replace: true, // 히스토리에 남기지 않음
//   //     });
//   //   }
//   // }

//   // 2단계: 기존 인증 및 권한 체크
//   // 반드시 화살표 함수, this 금지!
//   // const loginStore = useLoginStore();
//   // const isLogin = loginStore.isLogin;
//   // const userRole = loginStore.userRole;

//   // 인증 필요
//   // const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   // if (requiresAuth && !isLogin) {
//   //   return next({ name: 'LoginPage', query: { redirect: to.fullPath } });
//   // }

//   // 권한 체크
//   // if (to.meta.requiresRole) {
//   //   const allowed = Array.isArray(to.meta.requiresRole)
//   //     ? to.meta.requiresRole.includes(userRole)
//   //     : to.meta.requiresRole === userRole;
//   //   if (!allowed) return next({ name: 'NotFound' });
//   // }

//   // next();
// });

export default router;
