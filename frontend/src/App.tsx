import { useEffect, useState } from "react";
import { Dashboard } from "./pages/Dashboard"; 

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const tokenManual = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ODJlZjlkYS02YmQyLTQ2NWQtODc5NC00NGIyZDI3NzM0ZGQiLCJlbWFpbCI6ImZ1bGFuby5kZS50YWxAdGVzdGUuY29tIiwiaWF0IjoxNzc1OTMxMjkyLCJleHAiOjE3NzYwMTc2OTJ9.hQ-riZiiD1PweqkrfBTSqPSV7ME2Jm-wxhRb32AMja4";
    
    localStorage.setItem("@CloudManager:token", tokenManual);
    setIsAuth(true);

    console.log("Sessão de teste iniciada com token manual.");
  }, []);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Iniciando Dashboard...</p>
      </div>
    );
  }

  return <Dashboard />;
}