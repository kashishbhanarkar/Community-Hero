import { useEffect, useState } from "react";
import { getAllIssues } from "../api";

const severityStyles = {
  critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  low: "bg-green-500/10 text-green-400 border border-green-500/20",
};

const statusStyles = {
  "In Progress": "text-blue-500",
  Reported: "text-slate-400",
  Acknowledged: "text-yellow-500",
  Resolved: "text-green-500",
};

const categoryIcons = {
  "Water Leakage": "💧",
  Pothole: "🕳️",
  "Street Light": "💡",
  Garbage: "🗑️",
};

export default function Home({ onNavigate }) {
  const [issues, setIssues] = useState([]);

useEffect(() => {
  loadIssues();
}, []);

const loadIssues = async () => {
  try {
    const response = await getAllIssues();
    setIssues(response.data);
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className="pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 text-sky-500 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            AI-Powered Civic Issue Platform
          </div>
          <h1 className="font-semibold tracking-tight leading-[1.15] mb-8">
  <span className="block text-4xl md:text-6xl text-slate-800">
    Every report starts a change.
  </span>
  <span className="block text-4xl md:text-6xl text-sky-500 mt-3">
    Every citizen can be a hero.
  </span>
</h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
           Report potholes, water leaks, broken streetlights, and more. Upload images, add details, and let AI analyze severity, priority, and the responsible department automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("report")}
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-lg shadow-sky-300/40"
            >
              Report an Issue →
            </button>
            <button
              onClick={() => onNavigate("map")}
              className="border border-sky-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 font-medium px-8 py-4 rounded-xl text-base transition-all"
            >
              View Live Map
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
  {
    label: "Issues Reported",
    value: issues.length,
    change: "Live Data",
  },
  {
    label: "Resolved",
    value: issues.filter(i => i.status === "Resolved").length,
    change: "Completed",
  },
  {
    label: "Critical Issues",
    value: issues.filter(i => i.severity === "critical").length,
    change: "Need Attention",
  },
  {
    label: "Departments",
    value: new Set(issues.map(i => i.department)).size,
    change: "Active",
  },
].map((stat) => (
  <div
    key={stat.label}
    className="bg-sky-50 border border-sky-200 rounded-2xl p-6"
  >
    <div className="text-3xl font-bold text-slate-800 mb-1">
      {stat.value}
    </div>

    <div className="text-sm text-slate-400 mb-2">
      {stat.label}
    </div>

    <div className="text-xs text-sky-500 font-medium">
      {stat.change}
    </div>
  </div>
))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-slate-800">How it works</h2>
          <p className="text-slate-400">Three steps to fix your community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {step: "01",icon: "📸",title: "AI Visual Reporting",desc: "Upload a photo of any civic issue. Gemini AI analyzes the complaint, detects the issue category, estimates urgency, and prepares a smarter report."},         
             { step: "02", icon: "🤝", title: "Community Validates", desc: "Neighbors upvote and confirm the issue. Higher community validation means faster response from authorities." },
            { step: "03", icon: "✅", title: "Track Resolution", desc: "Watch your issue move from Reported → In Progress → Resolved on the live map in real time." },
          ].map((item) => (
            <div key={item.step} className="bg-sky-50 border border-sky-200 rounded-2xl p-8 relative overflow-hidden group hover:border-sky-400 transition-all">
              <div className="absolute top-4 right-4 text-5xl font-black text-slate-200 group-hover:text-slate-300 transition-all">{item.step}</div>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

<section className="max-w-6xl mx-auto px-6 pb-24">

<div className="flex items-center justify-between mb-8">

<div>
<h2 className="text-3xl font-bold text-slate-800">
🌐 Live Community Reports
</h2>

<p className="text-slate-400 text-sm mt-2">
AI-powered civic intelligence
</p>

</div>


<button
onClick={() => onNavigate("dashboard")}
className="text-sky-500 font-medium"
>
View all →
</button>

</div>



<div className="grid md:grid-cols-3 gap-6">


{issues
.slice()
.reverse()
.slice(0,6)
.map((issue)=>(


<div
key={issue.id}
className="
bg-white 
border border-sky-100
rounded-3xl
p-5
shadow-sm
hover:shadow-xl
transition
">


<div className="flex justify-between">


<div>

<div className="text-3xl">

{
issue.category?.toLowerCase().includes("water")
? "💧"
: issue.category?.toLowerCase().includes("pothole")
? "🕳️"
: issue.category?.toLowerCase().includes("garbage")
? "🗑️"
: "📍"
}

</div>

<h3 className="text-lg font-bold uppercase text-slate-800">

{issue.category}

</h3>

</div>

<span
className="
text-sm
font-bold
uppercase
text-red-600
"
>
{issue.severity}
</span>
</div>

<p className="text-sm text-slate-500 mt-4">

{issue.title}

</p>



<div className="flex justify-between mt-5">

<span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">

⚡ AI Priority {issue.priorityScore || 50}
</span>



<span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">

🤖 AI Verified

</span>


</div>



<p className="text-xs text-slate-400 mt-4">

📍 {issue.location}

</p>



<p className="text-xs mt-2 text-green-600">

● {issue.status}

</p>


</div>


))}


</div>


</section>

      <section className="border-t border-sky-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">See something broken? <span className="text-sky-500">Fix it.</span></h2>
          <p className="text-slate-400 mb-8">Every report you make moves your city forward.</p>
          <button onClick={() => onNavigate("report")} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105">
            Report Your First Issue
          </button>
        </div>
      </section>
    </div>
  );
}