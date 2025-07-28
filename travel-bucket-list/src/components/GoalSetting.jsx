import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import "./GoalSetting.css"; 

function GoalSetting() {
  const [goals, setGoals] = useState({ weekly: "", yearly: "" });
  const [formData, setFormData] = useState({
    weekly: "",
    yearly: "",
    weeklyCompleted: "",
    yearlyCompleted: ""
  });

  // Load goals on mount
  useEffect(() => {
    fetch("https://travelbucketlist-1.onrender.com/goals")
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("https://travelbucketlist-1.onrender.com/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoals(data);
        setFormData({
          weekly: "",
          yearly: "",
          weeklyCompleted: "",
          yearlyCompleted: ""
        });
      });
  }

  return (
    <div className="goal-section">
      <h2>Travel Goals</h2>
      <p><strong>Weekly Goal:</strong> {goals.weekly || "Not set"}</p>
      <p><strong>Yearly Goal:</strong> {goals.yearly || "Not set"}</p>

      {/* Progress */}
      {goals.weekly && goals.weeklyCompleted !== undefined && (
        <ProgressBar
          label="Weekly Progress"
          completed={goals.weeklyCompleted}
          total={goals.weekly}
        />
      )}
      {goals.yearly && goals.yearlyCompleted !== undefined && (
        <ProgressBar
          label="Yearly Progress"
          completed={goals.yearlyCompleted}
          total={goals.yearly}
        />
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="weekly"
          placeholder="Set weekly goal"
          value={formData.weekly}
          onChange={handleChange}
        />
        <input
          name="yearly"
          placeholder="Set yearly goal"
          value={formData.yearly}
          onChange={handleChange}
        />
        <input
          name="weeklyCompleted"
          placeholder="Weekly completed"
          value={formData.weeklyCompleted}
          onChange={handleChange}
          type="number"
          min="0"
        />
        <input
          name="yearlyCompleted"
          placeholder="Yearly completed"
          value={formData.yearlyCompleted}
          onChange={handleChange}
          type="number"
          min="0"
        />

        <button type="submit" className="goal-btn">Save Goals</button>
      </form>
    </div>
  );
}

export default GoalSetting;
