import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="bg-black p-6 shadow-md min-h-screen flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 cursor-pointer max-w-7xl w-full">
                {/* First Card */}
                <div className="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[300px] lg:min-h-[300px] relative rounded-lg transition ease-in-out duration-300 hover:bg-pink-700 hover:scale-105"
                    onClick={() => navigate('/booking-details')}>
                    <div className="max-w-xs p-6">
                        <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Booking Details
                        </h2>
                        <p className="mt-4 text-left text-base/6 text-neutral-200">
                            List of bookings from user will be displayed here we go.
                        </p>
                    </div>
                </div>

                {/* Second Card */}
                <div className="col-span-1 min-h-[300px] bg-gray-800 relative cursor-pointer rounded-lg transition ease-in-out duration-300 hover:scale-105"
                    onClick={() => navigate('/request')}>
                    <div className="p-6">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Request Details
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                            Here you can see the list of requests from the Event Planners and the details of the requests.
                        </p>
                    </div>
                </div>

                {/* Third Card */}
                <div className="col-span-1 lg:col-span-3 bg-blue-900 min-h-[300px] lg:min-h-[300px] xl:min-h-[300px] relative rounded-lg transition ease-in-out duration-300 hover:scale-105"
                    onClick={() => navigate('/partner-details')}>
                    <div className="max-w-sm p-6">
                        <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Partner
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                          Approve and manage the partner registration and access there details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;