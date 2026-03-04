import React from "react";
import AppRoutes from "./routes";
import CustomCursor from "./components/CustomCursor";
import { ToastProvider } from "./context/ToastContext";

function App() {
    return (
        <ToastProvider>
            <AppRoutes />
            <CustomCursor />
        </ToastProvider>
    );
}

export default App;
