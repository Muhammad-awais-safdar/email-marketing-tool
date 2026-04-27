import React from "react";
import AppRoutes from "./routes";
import { ToastProvider } from "./context/ToastContext";

function App() {
    return (
        <ToastProvider>
            <AppRoutes />
        </ToastProvider>
    );
}

export default App;
