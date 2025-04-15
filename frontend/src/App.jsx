import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    screen_time: "",
    data_usage: "",
    social_media_time: "",
    gaming_time: "",
  });

  const [result, setResult] = useState("");
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const screen = parseFloat(form.screen_time || 0);
    const social = parseFloat(form.social_media_time || 0);
    const gaming = parseFloat(form.gaming_time || 0);

    setLoading(true);
    setResult("");
    setAdviceList([]);

    try {
      const response = await axios.post(
        "https://dsbda-backend.onrender.com/predict",
        form
      );

      setTimeout(() => {
        setLoading(false);
        let level = response.data.result;

        if (level === "Addicted") {
          setResult("✅ You are addicted to phone usage. 📱🔥");

          const tips = [];
          if (screen > 6) tips.push("🕒 Try reducing your overall screen time.👍");
          if (social > 3) tips.push("📱 Spend less time on social media apps.👍");
          if (gaming > 2) tips.push("🎮 Reduce your gaming time slightly.👍");
          if (tips.length === 0)
            tips.push("💡 Try maintaining a balance in your routine.👍");

          setAdviceList(tips);
        } else if (level === "Not Addicted") {
          setResult("✅ You are not addicted to phone usage. 👍");
        }
      }, 700);
    } catch (error) {
      setLoading(false);
      setResult("❌ Error: " + error.message);
    }
  };

  const getUnit = (field) => (field === "data_usage" ? "GB" : "hrs");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-xl transition-shadow duration-700 hover:shadow-2xl text-gray-800">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-700 mb-6">
          📱 Phone Addiction Predictor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["screen_time", "data_usage", "social_media_time", "gaming_time"].map((field) => (
            <div key={field}>
              <label className="block font-semibold mb-1 text-sm sm:text-base">
                {field.replaceAll("_", " ").toUpperCase()}
              </label>
              <div className="flex">
                <input
                  type="number"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="0.1"
                  required
                />
                <span className="bg-gray-200 px-3 sm:px-4 flex items-center rounded-r-md text-xs sm:text-sm font-medium">
                  {getUnit(field)}
                </span>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm sm:text-base transition cursor-pointer"
          >
            🔍 Predict
          </button>
        </form>

        {loading && (
          <div className="text-center mt-6 text-indigo-600 font-medium animate-pulse text-sm sm:text-base">
            🤖 Analyzing data using trained AI model ...
          </div>
        )}

        {!loading && result && (
          <div className="mt-6 text-center">
            <h3
              className={`text-lg sm:text-xl font-bold ${
                result.includes("Error")
                  ? "text-red-600"
                  : result.includes("not addicted")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {result}
            </h3>

            {adviceList.length > 0 && (
              <div className="mt-4 text-sm sm:text-base">
                <p className="font-medium mb-2">💡 Here's some advice:</p>
                <ul className="list-disc list-inside space-y-1 px-6 text-center">
                  {adviceList.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
