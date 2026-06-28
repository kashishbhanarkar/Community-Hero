import { useEffect, useState } from "react";
import { getAllIssues } from "../api";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const severityColor = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const markerIcons = {
  low: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  medium: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  high: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  critical: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};


export default function IssueMap({ onNavigate }) {

  const [issues, setIssues] = useState([]);


  useEffect(() => {
    loadIssues();
  }, []);


  const loadIssues = async () => {

    try {

      const response = await getAllIssues();


      const mappedIssues = response.data.map((issue,index)=>({

        ...issue,

        icon:
        issue.category?.toLowerCase().includes("water")
        ? "💧"
        : issue.category?.toLowerCase().includes("pothole")
        ? "🕳️"
        : issue.category?.toLowerCase().includes("street")
        ? "💡"
        : issue.category?.toLowerCase().includes("garbage")
        ? "🗑️"
        : "📍",

         lat: issue.latitude,
         lng: issue.longitude

      }));


      setIssues(mappedIssues);


    } catch(error){

      console.log(error);

    }

  };



return (

<div className="pt-16 min-h-screen">

<div className="max-w-6xl mx-auto px-6 py-12">


<div className="flex justify-between mb-8">

<div>

<h1 className="text-3xl font-bold text-slate-800">
Live Issue Map
</h1>

<p className="text-slate-400">
Real-time civic issues across your city
</p>

</div>


<button
onClick={()=>onNavigate("report")}
className="bg-sky-500 text-white px-5 py-2 rounded-xl"
>
+ Report Here
</button>


</div>



<MapContainer

center={[21.1458,79.0882]}

zoom={13}

className="h-[500px] w-full rounded-2xl"


>


<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>



{issues.map((issue) => (
  <Marker
  key={issue.id}
  position={[
    issue.latitude,
    issue.longitude
  ]}
  icon={markerIcons[issue.severity?.toLowerCase()] || markerIcons.medium}
>



<Popup maxWidth={320}>
  <div className="space-y-2">

    <h3 className="font-bold text-lg">
      {issue.icon} {issue.category}
    </h3>

    <p className="text-gray-700">
      {issue.description}
    </p>

    <hr />

    <p>
      📍 <b>Location:</b><br />
      {issue.location}
    </p>

    <p>
      🚨 <b>Severity:</b> {issue.severity}
    </p>

    <p>
      ⚡ <b>Priority:</b> {issue.priorityScore}/100
    </p>

    <p>
      🏢 <b>Department:</b><br />
      {issue.department}
    </p>

    <p>
      🤖 <b>AI Confidence:</b> {issue.aiConfidence}
    </p>

    <hr />

    <p>
      ✅ <b>Recommended Action</b><br />
      {issue.recommendedAction}
    </p>

    <p>
      ⏱ <b>Resolution Time</b><br />
      {issue.estimatedResolutionTime}
    </p>

    <p>
      🌍 <b>Impact</b><br />
      {issue.impactAssessment}
    </p>

  </div>
</Popup>


</Marker>


))

}



</MapContainer>



<div className="flex gap-6 mt-6 text-sm">


{
Object.keys(severityColor).map(level=>(

<div
key={level}
className="flex gap-2 items-center"
>


<span
className={`w-3 h-3 rounded-full ${severityColor[level]}`}
>
</span>


{level}


</div>

))
}


</div>



</div>

</div>

);


}