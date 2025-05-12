const Request = require('../models/Request');

const getAllRequests = async (req, res) => {
    console.log('Fetching all requests...'); // Log the request
    try {
        const requests = await Request.find();
        console.log('All requests:', requests); // Log all requests
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const applyRequest = async (req, res) => {
    // make it dummy for now
    const { empID, leaveType, startDate, endDate, reason, duration } = req.body;
    const lastRequest = await Request.findOne().sort({ _id: -1 });
    const lastReqID = lastRequest ? parseInt(lastRequest.reqID, 10) : 0;
    const newReqID = String(lastReqID + 1).padStart(4, '0');
    console.log('Applying for request:', req.body); // Log the request body
    try {
        const newRequest = new Request({
            reqID: newReqID,
            empID,
            leaveType,
            startDate,
            endDate,
            reason,
            duration: Number(duration),
            status: 'Pending', // Default status
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    }
    catch (error) {
        console.error('Error applying for request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateRequestStatus = async (req, res) => {
    const { reqID, status } = req.body;
    console.log('Updating request status:', req.body); // Log the request body
    try {
        // find the request by reqID
        const request = await Request.findOne({ reqID });
        if (!request) {
            console.log('Request not found:', reqID); // Log if request not found
            return res.status(404).json({ error: 'Request not found' });
        }

        // delete status should delete the request
        if (status === 'Delete') {
            await Request.deleteOne({ reqID });
            console.log('Request deleted:', reqID); // Log the deletion
            return res.status(200).json({ message: 'Request deleted successfully' });
        }
        request.status = status;
        const updatedRequest = await request.save();
        console.log('Updated request:', updatedRequest); // Log the updated request
        // send the updated request as a response
        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    applyRequest,
    getAllRequests,
    updateRequestStatus
  };