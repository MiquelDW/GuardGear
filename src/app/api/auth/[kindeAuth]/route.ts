// the handleAuth function provides a set of default authentication routes and handlers. These routes are typically used for login, logout, callback, and other authentication-related actions
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// this will handle Kinde Auth endpoints in your NextJS app
export const GET = handleAuth();
