// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api, { setToken } from "../services/api";
import UploadForm from "../components/UploadForm";
import DataTable from "../components/DataTable";
import ChartsPanel from "../components/ChartsPanel";

export default function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rows, setRows] = useState([]);
  const [filterQ, setFilterQ] = useState("");
  const [page, setPage] = useState(1);
  const [chartCol, setChartCol] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setToken(token);

    // Verify token before fetching data
    api.get("/auth/me")
      .then(() => {
        fetchDatasets();
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchDatasets = async () => {
    const res = await api.get("/datasets");
    setDatasets(res.data);
  };

  const loadRows = async (ds) => {
    setSelected(ds);
    setRows([]);
    const r = await api.get(`/datasets/${ds.id}/rows?page=1&per_page=50`);
    setRows(r.data.rows);
    setChartCol(Object.keys(ds.schema || {})[0] || "");
  };

  const applyFilter = async () => {
    const r = await api.get(
      `/datasets/${selected.id}/rows?q=${encodeURIComponent(filterQ)}&page=${page}&per_page=50`
    );
    setRows(r.data.rows);
  };

  if (loading) return <div>Loading...</div>;

  return (
      
      <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ minWidth: 300 }}>
          <UploadForm onUploaded={fetchDatasets} />
          <h4>Your Datasets</h4>
          <ul>
            {datasets.map((ds) => (
              <li key={ds.id}>
                <button onClick={() => loadRows(ds)}>{ds.name}</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {selected ? (
            <>
              <h3>{selected.name}</h3>
              <div>
                <input
                  placeholder="filters: col:value;col2:value2"
                  value={filterQ}
                  onChange={(e) => setFilterQ(e.target.value)}
                />
                <button onClick={applyFilter}>Apply</button>
              </div>
              <DataTable rows={rows} />
              <div style={{ marginTop: 20 }}>
                <label>Chart column: </label>
                <select
                  value={chartCol}
                  onChange={(e) => setChartCol(e.target.value)}
                >
                  <option value="">--select--</option>
                  {Object.keys(selected.schema || {}).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {chartCol && (
                  <ChartsPanel datasetId={selected.id} column={chartCol} />
                )}
              </div>
            </>
          ) : (
            <div>Select a dataset to view</div>
          )}
        </div>
      </div>
    </div>
  );
}
