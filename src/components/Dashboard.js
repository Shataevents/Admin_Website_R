import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();



    return (
        <div className="p-6 shadow-md min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {/* First Card */}
                <div
                    className="w-full h-[15rem] flex flex-col items-start justify-start p-2 rounded-lg border border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate('/booking-details')}
                >
                    <div className="max-w-xs p-6">
                        <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] ">
                            Booking Details
                        </h2>
                        <p className="mt-4 text-left text-base/6 ">
                            List of bookings from user will be displayed here we go.
                        </p>
                    </div>
                </div>

                {/* Second Card */}
                <div
                    className="w-full h-[15rem] flex flex-col items-start justify-start p-2 rounded-lg border border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate('/request')}
                >
                    <div className="p-6">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] ">
                            Request Details
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 ">
                            Here you can see the list of requests from the Event Planners and the details of the requests.
                        </p>
                    </div>
                </div>

                {/* Third Card */}
                <div
                    className="w-full h-[15rem] flex flex-col items-start justify-start p-2 rounded-lg border border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate('/partner-details')}
                >
                    <div className="max-w-sm p-6">
                        <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] ">
                            Partner
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 ">
                            Approve and manage the partner registration and access there details.
                        </p>
                    </div>
                </div>

                {/* Fourth Card - User Count */}
                <div className="w-full h-[15rem] flex flex-col items-start justify-start p-2 rounded-lg border border-gray-300 hover:shadow-lg transition-all cursor-pointer duration-300"
                onClick={() => navigate('/user-count')}
                >
                    <div className="max-w-xs p-6">
                        <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] ">
                            User Count
                        </h2>
                        <p className='mt-4 max-w-[26rem] text-left text-base/6 '>
                            It displays the user list and provides details on the number of users, selected events, total revenue, received commission, and the count of each booked service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
