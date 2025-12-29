import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../Styles/ComplaintGraph.css";
import moment from 'moment-timezone';

const MyChartComponent = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      const hostel = localStorage.getItem("hostel");
      try {
        const response = await Axios.get("https://hostel-complaint-management-webapp.onrender.com/complaints/graph-data", {
          headers: { hostel: hostel },
        });
        console.log('Complaints data:', response.data); 
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints data:', error);
      }
    };
    fetchComplaints();
  }, []);

  const formattedData = complaints.map(item => ({
    
    date: moment(item._id).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm"), // Convert UTC date to IST
    count: item.count,
  }));

  return (
    <div className='graph-container'>
      <button className="back-button" onClick={() => navigate("/admindashboard")}>
        ⬅ Back
      </button>
      <h3 style={{ textAlign: 'center', color: '#333' }}>Complaints Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => moment(date).format("MM/DD HH:mm")} 
            tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
            interval={Math.ceil(formattedData.length / 10)} // Display only some of the labels to prevent overlap
          />
          <YAxis tick={{ fontSize: 12 }} label={{ value: 'Complaints', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value) => `${value} complaints`} 
            labelFormatter={(label) => `Date: ${label}`} 
            contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={{ r: 5 }} 
            activeDot={{ r: 8, strokeWidth: 2, fill: "#8884d8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyChartComponent;
