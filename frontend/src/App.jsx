import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Dashboard from "./pages/Dashboard";
import IssueMap from "./pages/IssueMap";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";


export default function App() {

  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

useEffect(() => {

    const savedUser = localStorage.getItem("user");
    if(savedUser){
      setUser(JSON.parse(savedUser));
    }
 }, []);
const renderPage = () => {

    switch(page){

      case "home":
        return <Home onNavigate={setPage}/>;


      case "report":
        return (
          <ReportIssue
            onNavigate={setPage}
            user={user}
            setUser={setUser}
          />
        );


      case "dashboard": 
return (
<Dashboard 
onNavigate={setPage}
user={user}
/>
);

      case "map":
        return <IssueMap onNavigate={setPage}/>;


      case "login":
        return (
          <Login
            onLogin={setUser}
            onNavigate={setPage}
          />
        );


      case "register":
        return (
          <Register
            onLogin={setUser}
            onNavigate={setPage}
          />
        );


      case "profile":
        return (
          <Profile
            user={user}
            setUser={setUser}
            onNavigate={setPage}
          />
        );


      default:
        return <Home onNavigate={setPage}/>;

    }

  };



  return (

    <div className="min-h-screen bg-white text-slate-800">


      <Navbar 
currentPage={page} 
onNavigate={setPage} 
user={user}
/>


      {renderPage()}


    </div>

  );

}