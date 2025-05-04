export const BASE_URL = import.meta.env.VITE_API_URL;
// export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  USERS: {
    GET_USER_DASHBOARD: "/api/user/dashboard",
    UPDATE_DAILY_SCORE: "/api/user/credits/daily-login",
    UPDATE_PROFILE_SCORE: "/api/user/credits/profile-complete",
    UPDATE_INTERACTION_SCORE: "/api/user/credits/interact",
  },
  ADMIN: {
    GET_ALL_USERS_CREDIT_SCORE: "/api/admin/users",
    GET_ALL_USERS: "/api/admin/all-users",
    GET_ADMIN_DASHBOARD: "/api/admin/dashboard",
    UPDATE_USER_CREDITS_MANUALLY: "/api/admin/users/update-credits",
    GET_ALL_REPORTS: "/api/admin/reports"
  },
  FEED: {
    GET_FEED: "/api/feed",
    FEED_SAVE_UPDATE: "/api/feed/save",
    FEED_REPORT_UPDATE: "/api/feed/report",
    FEED_REPORT_DELETE: (reportId) => `/api/feed/report/${reportId}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image",
  },
};
