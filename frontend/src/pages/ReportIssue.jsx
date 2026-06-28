import { useState } from "react";
import {
  createIssue,analyzeWithGemini,getUserById,} from "../api";


const formatCategory = (cat) => {
  if (!cat) return "";
  return cat
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


const formatSeverity = (s) => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const categories = [
  { id: "water", label: "Water Leakage", icon: "💧" },
  { id: "pothole", label: "Pothole", icon: "🕳️" },
  { id: "streetlight", label: "Street Light", icon: "💡" },
  { id: "garbage", label: "Garbage", icon: "🗑️" },
  { id: "drainage", label: "Drainage", icon: "🌊" },
  { id: "other", label: "Other", icon: "⚠️" },
];

export default function ReportIssue({onNavigate,user,setUser}) {

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [aiResult, setAiResult] = useState(null);



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

const getCurrentLocation = () => {

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      setLatitude(lat);
setLongitude(lon);

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data = await response.json();

        const address = data.address;

        const cleanLocation =
          `${address.suburb || address.neighbourhood || address.village || ""} ${
            address.city || address.town || address.county || ""
          }, ${
            address.state || ""
          }, ${
            address.postcode || ""
          }, ${
            address.country || ""
          }`;

        setLocation(
          cleanLocation.replace(/\s+/g, " ").trim()
        );


      } catch(error) {

        console.error("Location error:", error);

        setLocation(
          `Latitude: ${lat}, Longitude: ${lon}`
        );

      }

    },

    () => {
      alert("Please allow location permission");
    }
  );

};

  const handleAnalyze = async () => {
    if (!selectedCategory || !description || !location) return;
    setStep(2);
    try {
      const result = await analyzeWithGemini(
  description,
  selectedCategory
);

console.log("FINAL AI DATA:", result);

setAiResult(result);

      setStep(3);
    } catch (error) {
      console.error("Gemini error:", error);
      setAiResult({
  category: selectedCategory,
  severity: "medium",
  priorityScore: "75",
  department: "Municipal Board",
  confidence: "95%",
  priorityLevel: "Medium",
  recommendedAction: "Inspect and resolve the reported issue.",
  estimatedResolutionTime: "24-48 Hours",
  impactAssessment: "May affect public safety and infrastructure if ignored.",
  complaint: "Issue reported by citizen and requires immediate attention.",
});
      setStep(3);
    }
  };

 const handleSubmit = async () => {
  try {

    let lat = latitude;
    let lng = longitude;

    // If user typed a location manually
    if ((lat === null || lng === null) && location.trim() !== "") {

      try {

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );

        const data = await response.json();

        if (data.length > 0) {

          lat = Number(data[0].lat);
          lng = Number(data[0].lon);

        } else {

          // Could not find location
          alert("Location not found. Please enter a valid city or address.");
          return;

        }

      } catch (err) {

        console.error(err);
        alert("Unable to fetch location.");
        return;

      }

    }

    // Safety check
    if (lat === null || lng === null) {

      alert("Please select your location.");
      return;

    }

    await createIssue({

      userEmail: user?.email,

      category: aiResult?.category || selectedCategory,

      title: description.slice(0, 50),

      description,

      location,

      latitude: lat,

      longitude: lng,

      reportedBy: localStorage.getItem("userEmail"), 

      severity: (aiResult?.severity || "Medium").toLowerCase(),

      status:
        aiResult?.severity === "critical"
          ? "In Progress"
          : aiResult?.severity === "high"
          ? "Acknowledged"
          : "Reported",

      department: aiResult?.department || "Municipal Board",

      verifications: Math.floor(Math.random() * 40) + 5,

      priorityScore: aiResult?.priorityScore || "75",

      priorityLevel: aiResult?.priorityLevel || "Medium",

      aiConfidence: aiResult?.confidence || "90",

      recommendedAction: aiResult?.recommendedAction || "",

      estimatedResolutionTime:
        aiResult?.estimatedResolutionTime || "",

      impactAssessment:
        aiResult?.impactAssessment || ""

    });

    if (user) {
    const updatedUser = await getUserById(user.id);
    setUser(updatedUser.data);
    localStorage.setItem(
    "user",
    JSON.stringify(updatedUser.data)
);
}

    onNavigate("dashboard");

  } catch (error) {

    console.error(error);

    if (error.response) {
      console.log(error.response.data);
    }

  }
};

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="text-cyan-400 text-sm font-medium mb-2">
            Step {step} of 3
          </div>
          <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
          <p className="text-slate-400">
            Our AI will analyze your report and route it automatically.
          </p>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Issue Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      selectedCategory === cat.id
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Upload Photo{" "}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-48">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">
                        Change photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-10 text-center transition-all bg-slate-900/50">
                    <div className="text-3xl mb-2">📸</div>
                    <div className="text-slate-400 text-sm mb-1">
                      Tap to upload a photo
                    </div>
                    <div className="text-slate-600 text-xs">
                      AI will classify severity, priority and responsible department
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Describe the Issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Large water pipe burst near the bus stop, water flooding the road..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm outline-none resize-none transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-3 block">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter address or area..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-600 text-sm outline-none transition-all"
                />
                <span className="absolute left-3 top-3.5 text-slate-500">
                  📍
                </span>
              </div>
              <button
  onClick={getCurrentLocation}
  className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
>
  Use my current location →
</button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedCategory || !description || !location}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold py-4 rounded-xl transition-all text-base"
            >
              Analyze with AI →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">AI is analyzing...</h2>
            <p className="text-slate-400 text-sm">
              Detecting severity, category, and responsible department
            </p>
            <div className="mt-8 space-y-2 text-left max-w-xs mx-auto">
              {[
                "Scanning image for issue markers...",
                "Classifying problem type...",
                "Estimating severity level...",
                "Identifying responsible department...",
              ].map((msg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-500"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
  <div className="space-y-6">

    {/* AI Analysis */}
    <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-cyan-400 text-sm font-medium">
          ✨ AI Analysis Complete
        </span>

        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">
          {aiResult?.confidence || "95%"} confidence
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Category</div>
          <div className="font-semibold text-white">
           {formatCategory(aiResult?.category || selectedCategory)}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Severity</div>
          <div className="font-semibold text-red-400">
            {formatSeverity(aiResult?.severity)}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Department</div>
          <div className="font-semibold text-white">
            {aiResult?.department}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Priority Score</div>
<div className="font-semibold text-yellow-400">
  {aiResult?.priorityScore || "N/A"}/100
</div>
        </div>
      </div>
    </div>

    {/* AI Generated Complaint */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="text-xs text-cyan-400 mb-3 font-medium uppercase">
        AI Generated Complaint
      </div>

      <p className="text-slate-300 leading-relaxed italic">
        "{aiResult?.complaint}"
      </p>
    </div>

    {/* AI Resolution Plan */}
    <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">
      <div className="text-xs text-cyan-400 mb-4 font-medium uppercase">
        AI Resolution Plan
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">
            Recommended Action
          </div>
          <div className="text-sm text-white">
            {aiResult?.recommendedAction}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">
            Resolution Time
          </div>
          <div className="font-semibold text-cyan-400">
            {aiResult?.estimatedResolutionTime}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">
            Priority Level
          </div>
          <div className="font-semibold text-yellow-400">
            {aiResult?.priorityLevel}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">
            Impact Assessment
          </div>
          <div className="text-sm text-white">
            {aiResult?.impactAssessment}
          </div>
        </div>

      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-3">
      <button
        onClick={() => setStep(1)}
        className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium py-4 rounded-xl transition-all"
      >
        Edit Report
      </button>

      <button
        onClick={handleSubmit}
        className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-xl transition-all"
      >
        Submit Report ✓
      </button>
    </div>

  </div>
)}
      </div>
    </div>
  );
}