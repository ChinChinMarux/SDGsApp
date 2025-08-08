import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@clerk/clerk-react';
import * as d3 from 'd3'; // Import d3 untuk skala warna

const SDGBarChart = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const { getToken } = useAuth();
    const isDark = theme.palette.mode === 'dark';
    const axisColor = isDark ? '#e2e8f0' : '#333';

    // Definisikan skala warna menggunakan D3.js
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    useEffect(() => {
        const fetchSDGCounts = async () => {
            const token = await getToken();
            try {
                const response = await fetch('http://127.0.0.1:8000/api/stats/sdg-counts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch SDG counts:", error);
            }
        };
        fetchSDGCounts();
    }, [getToken]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />
                <XAxis 
                    dataKey="sdg_name" 
                    stroke={axisColor} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                />
                <YAxis stroke={axisColor} />
                <Tooltip />
                {/* Perbaikan di sini: gunakan Cell untuk mengisi warna */}
                <Bar dataKey="count">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorScale(entry.sdg_name)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SDGBarChart;