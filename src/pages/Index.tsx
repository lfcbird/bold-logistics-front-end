import { Navigate } from "react-router-dom";
import { auth } from "@/lib/api";

const Index = () => {
  return <Navigate to={auth.isAuthenticated() ? "/dashboard" : "/login"} replace />;
};

export default Index;
