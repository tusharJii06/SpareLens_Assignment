// src/components/ChartsPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { PieChart, Pie, Tooltip, Cell, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";

const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042","#AA336A","#3399AA"];

export default function ChartsPanel({datasetId, column}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!datasetId || !column) return;
    api.get(`/datasets/${datasetId}/aggregate?column=${encodeURIComponent(column)}`).then(res => {
      setData(res.data.data.map(d=>({name:d.key, value: parseInt(d.value) || 0})));
    }).catch(()=>setData([]));
  }, [datasetId, column]);

  if (!data || data.length === 0) return <div>No chart data</div>;
  return (
    <div style={{display:"flex", gap:20}}>
      <PieChart width={300} height={300}>
        <Pie dataKey="value" data={data} cx={150} cy={150} outerRadius={80} label>
          {data.map((entry, index) => <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip/>
      </PieChart>

      <BarChart width={400} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Count" />
      </BarChart>
    </div>
  );
}
