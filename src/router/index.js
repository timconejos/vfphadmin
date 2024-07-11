import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/DashboardView.vue';
import SubmissionsView from '../views/SubmissionsView.vue';
import UsersView from '../views/UsersView.vue';
import FeedView from '../views/FeedView.vue';
import RegistrationView from '../views/RegistrationView.vue';
import Login from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/submissions',
    name: 'Submissions',
    component: SubmissionsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/feed',
    name: 'Feed',
    component: FeedView,
    meta: { requiresAuth: true },
  },
  {
    path: '/registrations',
    name: 'Registrations',
    component: RegistrationView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;