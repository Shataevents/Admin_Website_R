import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Request() {
  const navigate = useNavigate();

  const requests = [
    {
      id: 1,
      items: ["Letterheads", "Stamp Papers"],
      plannerName: "John Doe",
      company: "EventMaster Inc.",
      description: "Request for office supplies for upcoming board meeting",
      personalPhone: "555-0101",
      companyPhone: "555-0123",
      quantity: 50
    },
    {
      id: 2,
      items: ["Task Papers", "Letterheads"],
      plannerName: "Sarah Smith",
      company: "PlanPerfect Ltd.",
      description: "Materials needed for team workshop documentation",
      personalPhone: "555-0102",
      companyPhone: "555-0124",
      quantity: 30
    },
    {
      id: 3,
      items: ["Stamp Papers"],
      plannerName: "Mike Johnson",
      company: "CelebrateNow Co.",
      description: "Legal documents preparation for annual event",
      personalPhone: "555-0103",
      companyPhone: "555-0125",
      quantity: 20
    },
    {
      id: 4,
      items: ["Letterheads", "Task Papers"],
      plannerName: "Emily Brown",
      company: "EventSphere",
      description: "Branding materials for client presentation",
      personalPhone: "555-0104",
      companyPhone: "555-0126",
      quantity: 40
    },
    {
      id: 5,
      items: ["Stamp Papers", "Task Papers"],
      plannerName: "David Wilson",
      company: "OccasionPro",
      description: "Documentation for festival organization",
      personalPhone: "555-0105",
      companyPhone: "555-0127",
      quantity: 25
    }
  ];

  const handleRowClick = (request) => {
    navigate('/request/order', { state: { request } });
  };

  return (
    <>
      <Navbar/>
      <div className="bg-black p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-white text-center font-bold mb-4">Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3">Request #</th>
                <th className="p-3">Items</th>
                <th className="p-3">Planner</th>
                <th className="p-3">Company</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr 
                  key={request.id}
                  className="bg-white text-black border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(request)}
                >
                  <td className="p-3">{request.id}</td>
                  <td className="p-3">
                    <ul className="list-disc list-inside">
                      {request.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3">{request.plannerName}</td>
                  <td className="p-3">{request.company}</td>
                  <td className="p-3">{request.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Request;