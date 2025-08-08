import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '@clerk/clerk-react';

// Array warna untuk segmen pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28F9E', '#E4F1FE'];

const InstitutionPieChart = () => {
    // Menggunakan useState untuk menyimpan data yang diambil dari API
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();

    // useEffect untuk mengambil data dari backend saat komponen dimuat
    useEffect(() => {
        const fetchInstitutionData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Mendapatkan token otentikasi dari Clerk
                const token = await getToken();
                // Mengambil data dari endpoint FastAPI
                const response = await fetch('http://127.0.0.1:8000/api/stats/institution-distribution', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Memeriksa apakah respons berhasil
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (e) {
                console.error("Error fetching institution data:", e);
                setError("Gagal memuat data. Mohon coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutionData();
    }, [getToken]); // Pastikan efek ini dijalankan ulang jika getToken berubah

    // Tampilkan pesan loading atau error
    if (loading) {
        return <div className="text-center py-4 text-gray-500">Memuat data...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-4 text-gray-500">Tidak ada data institusi yang tersedia.</div>;
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-lg h-96 flex flex-col justify-center items-center">
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
        </div>
    );
};

// Komponen utama aplikasi
export default function App() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <InstitutionPieChart />
        </div>
    );
}