import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("sandbox", "routes/sandbox.tsx"),
    route("mock-shop", "routes/mock-shop.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("api/tickets", "routes/api.tickets.tsx"),    
    route("api/messages", "routes/api.messages.tsx"),  
] satisfies RouteConfig;