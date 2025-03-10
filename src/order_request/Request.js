import React, { useState } from 'react';
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
      quantity: 50,
      status: "Pending"
    },
    {
      id: 2,
      items: ["Task Papers", "Letterheads"],
      plannerName: "Sarah Smith",
      company: "PlanPerfect Ltd.",
      description: "Materials needed for team workshop documentation",
      personalPhone: "555-0102",
      companyPhone: "555-0124",
      quantity: 30,
      status: "Pending"
    },
    {
      id: 3,
      items: ["Stamp Papers"],
      plannerName: "Mike Johnson",
      company: "CelebrateNow Co.",
      description: "Legal documents preparation for annual event",
      personalPhone: "555-0103",
      companyPhone: "555-0125",
      quantity: 20,
      status: "Approval"
    },
    {
      id: 4,
      items: ["Letterheads", "Task Papers"],
      plannerName: "Emily Brown",
      company: "EventSphere",
      description: "Branding materials for client presentation",
      personalPhone: "555-0104",
      companyPhone: "555-0126",
      quantity: 40,
      status: "Approval"
    },
    {
      id: 5,
      items: ["Stamp Papers", "Task Papers"],
      plannerName: "David Wilson",
      company: "OccasionPro",
      description: "Documentation for festival organization",
      personalPhone: "555-0105",
      companyPhone: "555-0127",
      quantity: 25,
      status: "Delivered"
    }
  ];

  const [activeSection, setActiveSection] = useState(null); // Track the active section

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section); // Toggle or close if same section is clicked
  };

  const handleRowClick = (request) => {
    navigate('/request/order', { state: { request } });
  };

  const renderRequestTable = (status) => {
    const filteredRequests = requests.filter((request) => request.status === status);
    if (filteredRequests.length === 0) {
      return <p className="text-gray-500 p-4">No {status} requests available.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white ">
          <thead className="bg-black border-y border-gray-900">
            <tr>
              <th className="p-3">Request Items</th>
              <th className="p-3">Planner Name</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr
                key={request.id}
                className="bg-black text-white border-b border-gray-900 hover:bg-gray-900 cursor-pointer"
                onClick={() => handleRowClick(request)}
              >
                <td className="p-3">{request.items.join(", ")}</td>
                <td className="p-3">{request.plannerName}</td>
                <td className="p-3">{request.quantity}</td>
                <td className="p-3 flex items-center">
                  <span className="mr-2">{request.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="bg-black min-h-screen my-10 items-center justify-center w-full">
      <Navbar />
      <div className="bg-black p-6 rounded-lg shadow-md lg:mx-10">
        <h2 className="text-2xl text-white text-center font-bold mb-4">Requests</h2>

        {/* FAQ-Style Dropdown Sections */}
        <div className="space-y-4 ">
          {/* Pending Section */}
          <div className='border-2 border-white'>
            <button
              onClick={() => toggleSection('pending')}
              className="w-full text-left bg-black rounded-lg p-4 flex justify-between items-center shadow-md"
            >
              <h3 className="text-lg font-semibold text-white">Pending Requests</h3>
              <span className="text-white text-2xl">
                {activeSection === 'pending' ? '−' : '+'}
              </span>
            </button>
            {activeSection === 'pending' && (
              <div className="mt-2 bg-black p-4 rounded-lg text-white">
                {renderRequestTable('Pending')}
              </div>
            )}
          </div>

          {/* Approval Section */}
          <div className='border-2 border-white'>
            <button
              onClick={() => toggleSection('approval')}
              className="w-full text-left bg-black  rounded-lg p-4 flex justify-between items-center shadow-md"
            >
              <h3 className="text-lg font-semibold text-white">Approval Requests</h3>
              <span className="text-white text-2xl">
                {activeSection === 'approval' ? '−' : '+'}
              </span>
            </button>
            {activeSection === 'approval' && (
              <div className="mt-2 bg-black p-4 rounded-lg text-white">
                {renderRequestTable('Approval')}
              </div>
            )}
          </div>

          {/* Delivered Section */}
          <div className='border-2 border-white'>
            <button
              onClick={() => toggleSection('delivered')}
              className="w-full text-left bg-black rounded-lg p-4 flex justify-between items-center shadow-md"
            >
              <h3 className="text-lg font-semibold text-white">Delivered Requests</h3>
              <span className="text-white text-2xl">
                {activeSection === 'delivered' ? '−' : '+'}
              </span>
            </button>
            {activeSection === 'delivered' && (
              <div className="mt-2 bg-black p-4 rounded-lg text-white">
                {renderRequestTable('Delivered')}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Request;