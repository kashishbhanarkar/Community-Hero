import { useState, useEffect } from "react";
import { getAllIssues, updateIssueStatus } from "../api";
const formatCategory = (cat) => {
  if (!cat) return "";
  return cat
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


const statusColor = {
  "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Reported: "bg-slate-200/40 text-slate-500 border-slate-300",
  Acknowledged: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Resolved: "bg-green-500/10 text-green-500 border-green-500/20",
};

const severityDot = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};
export default function Dashboard({ onNavigate, user }) {

const [filter, setFilter] = useState("all");
const [issues, setIssues] = useState([]);
const [selectedIssue, setSelectedIssue] = useState(null);
const changeStatus = async(status)=>{

try{

await updateIssueStatus(
selectedIssue.id,
status
);


setSelectedIssue({
...selectedIssue,
status
});


setIssues(
issues.map((i)=>
i.id===selectedIssue.id
?
{...i,status}
:
i
)
);


}
catch(err){
console.log(err);
}

};

useEffect(() => {
  getAllIssues()
    .then((res) => setIssues(res.data))
    .catch((err) => console.error("Failed to fetch issues:", err));
}, []);
  const filters = ["all", "critical", "In Progress", "Resolved"];

  const filtered = issues.filter((i) => {
    if (filter === "all") return true;
    if (filter === "critical") return i.severity === "critical";
    return i.status === filter;
  });

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-slate-800">
Civic Issue Monitoring Dashboard
</h1>
           <p className="text-slate-400">
AI verified reports and resolution tracking
</p>
          </div>
          <button
            onClick={() => onNavigate("report")}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            + New Report
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Issues", value: issues.length, icon: "📋", color: "text-slate-800" },
            { label: "Critical", value: issues.filter((i) => i.severity === "critical").length, icon: "🔴", color: "text-red-500" },
            { label: "In Progress", value: issues.filter((i) => i.status === "In Progress").length, icon: "⚡", color: "text-blue-500" },
            { label: "Resolved", value: issues.filter((i) => i.status === "Resolved").length, icon: "✅", color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-sky-100 text-sky-500 border border-sky-300"
                  : "bg-sky-50 text-slate-400 border border-sky-200 hover:border-slate-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-sky-200 text-xs text-slate-400 font-medium uppercase tracking-wider">

            <span>Issue</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Verified By</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-sky-200">
            {filtered.map((issue) => (
  <div
    key={issue.id}
    onClick={() => setSelectedIssue(issue)}
    className="px-6 py-4 hover:bg-sky-100/60 transition-all cursor-pointer hover:shadow-md"
  >
                


                <div className="md:hidden">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${severityDot[issue.severity]}`} />
                      <span className="font-medium text-sm text-slate-800">{issue.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${statusColor[issue.status]}`}>
                      {issue.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex gap-3">
                    <span>📍 {issue.location}</span>
                    <span>👥 {issue.verifications}</span>
                    <span>{issue.time}</span>
                  </div>
                </div>
<div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center">


{/* ISSUE */}
<div>
  <div className="flex items-center gap-2 mb-1">

    <span 
    className={`w-2 h-2 rounded-full ${severityDot[issue.severity]}`}
    />

    <span className="font-medium text-sm text-slate-800">
      {issue.title}
    </span>

  </div>

  <div className="text-xs text-slate-400 pl-4">
    📍 {issue.location}
  </div>

</div>



{/* CATEGORY */}

<div className="text-sm text-slate-400">
 {formatCategory(issue.category)}
</div>



{/* PRIORITY */}

<div>

<div className="text-sm text-yellow-500 font-semibold">
⚡ {issue.priorityScore || "N/A"}/100
</div>


<div className="mt-1 text-xs 
bg-sky-100 text-sky-600 
px-2 py-1 rounded-full inline-flex">

🤖 {issue.priorityLevel || "AI"}

</div>


</div>




{/* VERIFIED */}

<div className="text-sm text-slate-400">

👥 {issue.verifications} people

</div>




{/* STATUS */}

<div>

<span 
className={`text-xs px-3 py-1 rounded-full border ${statusColor[issue.status]}`}
>

{issue.status}

</span>

</div>


</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
{selectedIssue && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-2xl p-6 max-w-md w-full">


<div className="flex justify-between items-center mb-4">

<h2 className="text-xl font-bold text-sky-600">
🤖 AI Civic Analysis
</h2>

<span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
AI Verified
</span>

</div>

<h3 className="font-semibold text-slate-700 mb-3">
{selectedIssue.title}
</h3>


<p>
Severity:
{" "}
<b>{selectedIssue.severity}</b>
</p>


<p>
Priority:
{" "}
<b>{selectedIssue.priorityScore}/100</b>
</p>


<p>
Department:
{" "}
<b>{selectedIssue.department}</b>
</p>


<p>
Resolution:
{" "}
<b>{selectedIssue.estimatedResolutionTime}</b>
</p>

<p>
Location:
{" "}
<b>{selectedIssue.location}</b>
</p>

<p>
Community Verification:
{" "}
<b>{selectedIssue.verifications} people</b>
</p>

<p className="mt-3">
Impact:
{" "}
<b>{selectedIssue.impactAssessment}</b>
</p>


<p className="mt-3 text-slate-500">
💡 {selectedIssue.recommendedAction}
</p>

<div className="flex gap-3 mt-5">


{user?.role === "admin" && (

<>
<button
onClick={()=>changeStatus("In Progress")}
className="
bg-blue-500
text-white
px-4
py-2
rounded-xl
"
>
In Progress
</button>


<button
onClick={()=>changeStatus("Resolved")}
className="
bg-green-500
text-white
px-4
py-2
rounded-xl
"
>
Resolve
</button>

</>

)}


<button
onClick={() => setSelectedIssue(null)}
className="
bg-slate-400
text-white
px-4
py-2
rounded-xl
"
>
Close
</button>


</div>
</div>

</div>

)}
    </div>
  );
}