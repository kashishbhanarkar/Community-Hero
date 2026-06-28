export default function Navbar({ 
  currentPage, 
  onNavigate, 
  user
}) {
const links = [
    { id: "home", label: "Home" },
    { id: "report", label: "Report Issue" },
    { id: "map", label: "Live Map" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-200">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
            CH
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">
            Community<span className="text-sky-500">Hero</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === link.id
                  ? "bg-sky-100 text-sky-500"
                  : "text-slate-400 hover:text-slate-800 hover:bg-sky-100"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">

         {user?.role === "admin" && (
<span className="text-xs bg-green-100 text-green-600 px-3 py-2 rounded-lg">
👮 Admin Panel
</span>
)}
          
          <button
            onClick={() => onNavigate("report")}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all"
          >
            + Report Now
          </button>

          <button
            onClick={() => onNavigate(user ? "profile" : "login")}
            className="w-9 h-9 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sm font-semibold text-sky-600"
          >
            {user ? user.name.charAt(0).toUpperCase() : "👤"}
          </button>
        </div>
      </div>
    </nav>
  );
}