import { useEffect, useState } from "react";
import { getAllIssues } from "../api";

export default function Profile({ user, setUser, onNavigate }) {

  const [reports, setReports] = useState(0);

  // Logout function should be here
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");

    setUser(null);

    onNavigate("login");
  };


  useEffect(() => {

    if (!user) return;

    const loadIssues = async () => {

      try {

        const res = await getAllIssues();

        const myIssues = res.data.filter(issue =>
          issue.reportedBy === user.email ||
          issue.userEmail === user.email ||
          issue.email === user.email
        );

        setReports(myIssues.length);

      } catch (err) {

        console.log(err);

      }

    };

    loadIssues();

  }, [user]);


  if (!user) {

    return (
      <div className="pt-32 text-center">

        <p className="text-slate-500 mb-4">
          You're not logged in yet.
        </p>

        <button
          onClick={() => onNavigate("login")}
          className="bg-sky-500 hover:bg-sky-400 text-white px-6 py-2 rounded-xl font-medium"
        >
          Log In
        </button>

      </div>
    );
  }


  return (

    <div className="pt-16 min-h-screen">

      <div className="max-w-2xl mx-auto px-6 py-12">


        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-8 mb-6 flex items-center gap-5">


          <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center text-2xl font-bold">

            {user?.name?.charAt(0)?.toUpperCase() || "U"}

          </div>


          <div>

            <h1 className="text-xl font-bold text-slate-800">
              {user?.name || "User"}
            </h1>

            <p className="text-slate-500 text-sm">
              {user?.email}
            </p>

          </div>

        </div>



        <div className="grid grid-cols-2 gap-4 mb-6">


          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">

            <div className="text-2xl font-bold text-sky-500">
              {user?.points ?? 0}
            </div>

            <div className="text-xs text-slate-500">
              Hero Points
            </div>

          </div>



          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">

            <div className="text-2xl font-bold text-sky-500">
              {reports}
            </div>

            <div className="text-xs text-slate-500">
              Issues Reported
            </div>

          </div>


        </div>



        <div className="space-y-3">


          <button
            onClick={() => onNavigate("report")}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl"
          >
            Report a New Issue
          </button>



         <button
  onClick={handleLogout}
  className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 rounded-xl"
>
  Logout
</button>


        </div>


      </div>

    </div>

  );

}