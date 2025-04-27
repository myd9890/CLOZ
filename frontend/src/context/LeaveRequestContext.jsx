import React, { createContext, useState, useContext } from 'react';

const LeaveRequestContext = createContext();

export const LeaveRequestProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const addLeaveRequest = (request) => {
    setLeaveRequests((prevRequests) => [...prevRequests, request]);
  };

  return (
    <LeaveRequestContext.Provider value={{ leaveRequests, addLeaveRequest }}>
      {children}
    </LeaveRequestContext.Provider>
  );
};

export const useLeaveRequestContext = () => useContext(LeaveRequestContext);