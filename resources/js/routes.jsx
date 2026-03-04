import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Subscribers from "./pages/Subscribers";
import EmailLists from "./pages/EmailLists";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WhatsappCampaigns from "./pages/WhatsappCampaigns";
import WhatsappContacts from "./pages/WhatsappContacts";
import WhatsappLists from "./pages/WhatsappLists";
import WhatsappTemplates from "./pages/WhatsappTemplates";
import WhatsappDashboard from "./pages/WhatsappDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "campaigns", element: <Campaigns /> },
            { path: "subscribers", element: <Subscribers /> },
            { path: "lists", element: <EmailLists /> },
            { path: "templates", element: <Templates /> },
            { path: "whatsapp-campaigns", element: <WhatsappCampaigns /> },
            { path: "whatsapp-contacts", element: <WhatsappContacts /> },
            { path: "whatsapp-lists", element: <WhatsappLists /> },
            { path: "whatsapp-templates", element: <WhatsappTemplates /> },
            { path: "whatsapp-dashboard", element: <WhatsappDashboard /> },
            { path: "settings", element: <Settings /> },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
]);

export default function AppRoutes() {
    return <RouterProvider router={router} />;
}
