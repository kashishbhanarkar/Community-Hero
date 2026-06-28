import { useEffect, useState } from "react";
import { getAllIssues } from "../api";

export default function LiveMap() {

  const [issues, setIssues] = useState([]);

  useEffect(() => {

    getAllIssues()
      .then(res => setIssues(res.data))
      .catch(err => console.log(err));

  }, []);


  return (
    <div className="pt-16 min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Live Issue Map 🗺️
        </h1>

        <p className="text-slate-400 mb-8">
          Real-time community reported problems
        </p>


        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6">

          {/* temporary map area */}
          <div className="h-[400px] rounded-xl bg-slate-200 flex items-center justify-center mb-6">

            <div className="text-center">

              <div className="text-5xl mb-3">
                📍
              </div>

              <p className="text-slate-600 font-medium">
                Interactive Map Coming Here
              </p>

              <p className="text-sm text-slate-400">
                Showing {issues.length} reported issues
              </p>

            </div>

          </div>



          <div className="space-y-3">

            {issues.map(issue => (

              <div
                key={issue.id}
                className="bg-white border border-sky-100 rounded-xl p-4"
              >

                <div className="flex justify-between">

                  <h3 className="font-semibold text-slate-800">
                    {issue.title}
                  </h3>


                  <span className="text-xs text-red-500">
                    {issue.severity}
                  </span>

                </div>


                <p className="text-sm text-slate-400">
                  📍 {issue.location}
                </p>


              </div>

            ))}

          </div>


        </div>

      </div>

    </div>
  );
}