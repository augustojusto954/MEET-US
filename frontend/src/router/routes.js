// frontend/src/router/routes.js

const routes = [
  // --- Vitrine Pública Principal (http://localhost:9000/) ---
  {
    path: '/',
    name: 'home',
    component: () => import('src/pages/landing/LandingPage.vue')
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/designs',
    name: 'designs',
    component: () => import('src/pages/designs/ClickableDesignsPage.vue')
  },

  // --- Portal do Estudante (Main Layout) ---
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('src/pages/dashboard/DashboardPage.vue') },
      { path: 'students', name: 'students', component: () => import('src/pages/students/SearchStudentsPage.vue') },
      { path: 'skills', name: 'skills', component: () => import('src/pages/skills/MySkillsPage.vue') },
      { path: 'matching', name: 'matching', component: () => import('src/pages/matching/MatchingPage.vue') },
      { path: 'matching/:id', name: 'matching-details', component: () => import('src/pages/matching/MatchingDetailsPage.vue') },

      // Collaboration
      { path: 'connections', name: 'connections', component: () => import('src/pages/connections/ConnectionsPage.vue') },
      { path: 'exchanges', name: 'exchanges', component: () => import('src/pages/exchanges/ExchangeRequestsPage.vue') },
      { path: 'exchanges/create', name: 'exchange-create', component: () => import('src/pages/exchanges/CreateExchangePage.vue') },
      { path: 'exchanges/:id', name: 'exchange-details', component: () => import('src/pages/exchanges/ExchangeDetailsPage.vue') },
      { path: 'swaps', name: 'swaps', component: () => import('src/pages/exchanges/ExchangeRequestsPage.vue') },
      { path: 'sessions/:id', name: 'session-details', component: () => import('src/pages/sessions/SessionDetailsPage.vue') },
      { path: 'calendar', name: 'calendar', component: () => import('src/pages/calendar/CalendarPage.vue') },
      { path: 'calls', name: 'calls', component: () => import('src/pages/calls/CallPage.vue') },

      // Community
      { path: 'community', name: 'community', component: () => import('src/pages/community/CommunityFeedPage.vue') },
      { path: 'community/:id', name: 'post-details', component: () => import('src/pages/community/PostDetailsPage.vue') },
      { path: 'chat', name: 'chat', component: () => import('src/pages/chat/ConversationsPage.vue') },
      { path: 'chat/:userId', name: 'chat-user', component: () => import('src/pages/chat/ConversationsPage.vue') },
      { path: 'leaderboard', name: 'leaderboard', component: () => import('src/pages/leaderboard/LeaderboardPage.vue') },
      { path: 'achievements', name: 'achievements', component: () => import('src/pages/achievements/AchievementsPage.vue') },

      // Personal
      { path: 'profile', name: 'profile', component: () => import('src/pages/profile/ProfilePage.vue') },
      { path: 'profile/edit', name: 'profile-edit', component: () => import('src/pages/profile/ProfileEditorPage.vue') },
      { path: 'notifications', name: 'notifications', component: () => import('src/pages/notifications/NotificationsPage.vue') },
      { path: 'reviews', name: 'reviews', component: () => import('src/pages/reviews/ReviewsPage.vue') },
      { path: 'settings', name: 'settings', component: () => import('src/pages/settings/SettingsPage.vue') },
      { path: 'settings/privacy', name: 'settings-privacy', component: () => import('src/pages/settings/SettingsPage.vue') },
      { path: 'help', name: 'help', component: () => import('src/pages/help/HelpCenterPage.vue') }
    ]
  },

  // --- Painel Administrativo Independente (Admin Layout) ---
  {
    path: '/admin',
    component: () => import('src/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/overview' },
      { path: 'overview', name: 'admin-overview', component: () => import('src/pages/admin/AdminOverviewPage.vue') },
      { path: 'students', name: 'admin-students', component: () => import('src/pages/admin/StudentManagementPage.vue') },
      { path: 'universities', name: 'admin-universities', component: () => import('src/pages/admin/UniversityManagementPage.vue') },
      { path: 'faculties', name: 'admin-faculties', component: () => import('src/pages/admin/FacultyManagementPage.vue') },
      { path: 'courses', name: 'admin-courses', component: () => import('src/pages/admin/CourseManagementPage.vue') },
      { path: 'categories', name: 'admin-categories', component: () => import('src/pages/admin/SkillCategoriesPage.vue') },
      { path: 'moderation', name: 'admin-moderation', component: () => import('src/pages/admin/CommunityModerationPage.vue') },
      { path: 'reports', name: 'admin-reports', component: () => import('src/pages/admin/ReportsManagementPage.vue') },
      { path: 'reviews', name: 'admin-reviews', component: () => import('src/pages/admin/ReviewsManagementPage.vue') },
      { path: 'analytics', name: 'admin-analytics', component: () => import('src/pages/admin/PlatformAnalyticsPage.vue') },
      { path: 'profile', name: 'admin-profile', component: () => import('src/pages/admin/AdminProfilePage.vue') },
      { path: 'settings', name: 'admin-settings', component: () => import('src/pages/admin/AdminSettingsPage.vue') }
    ]
  },

  // --- Autenticação ---
  {
    path: '/auth',
    component: () => import('src/layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'login', component: () => import('src/pages/auth/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('src/pages/auth/RegisterPage.vue') },
      { path: 'forgot', name: 'forgot', component: () => import('src/pages/auth/ForgotPasswordPage.vue') }
    ]
  },

  // 404 Not Found
  { path: '/:catchAll(.*)*', component: () => import('src/pages/errors/NotFoundPage.vue') }
]

export default routes
