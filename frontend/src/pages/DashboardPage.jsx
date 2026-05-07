import { useEffect, useState } from "react";
import api from "../api/client";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setSummary(res.data));
  }, []);

  if (!summary) return <p className="loading-text">Loading dashboard...</p>;

  const stats = [
    { label: "Total", value: summary.total },
    { label: "Todo", value: summary.todo },
    { label: "In Progress", value: summary.inProgress },
    { label: "Done", value: summary.done },
    { label: "Overdue", value: summary.overdue }
  ];

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <div className="grid grid-4">
        {stats.map((item) => (
          <div key={item.label} className="card stat-card">
            <h3>{item.label}</h3>
            <p className="stat-value">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
