import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@clerk/clerk-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28F9E', '#E4F1FE'];

const InstitutionPieChart = () => {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchInstitutionData = async () => {
            const token = await getToken();
            const response = await fetch('http://127.0.0.1:8000/api/stats/institution-distribution', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            setData(result);
        };
        fetchInstitutionData();
    }, [getToken]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default InstitutionPieChart;