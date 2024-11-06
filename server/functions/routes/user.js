const router = require('express').Router();
const admin = require("firebase-admin");

let data = [];  // This should be updated with the actual user data you want to return

router.get('/', (req, res) => {
    return res.send('Inside the user router');
});

router.get("/jwtVerification", async (req, res) => { 
    if (!req.headers.authorization) {
        return res.status(500).send({msg: "Token Not Found"});
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedValue = await admin.auth().verifyIdToken(token);
        if (!decodedValue) {
            return res.status(500).json({success: false, msg: "unauthorized access"});
        }
        return res.status(200).json({success: true, data: decodedValue});
    } catch (err) {
        return res.status(500).send({ 
            success: false, 
            msg: `Error in extracting the token: ${err}` 
        });
    }
});

// This is the corrected version of listAllUsers function
const listAllUsers = async (nextPageToken) => {
    try {
        // List batch of users, 1000 at a time.
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
        
        // Add the users to the data array
        listUsersResult.users.forEach((userRecord) => {
            data.push(userRecord.toJSON());
        });

        if (listUsersResult.pageToken) {
            // List next batch of users recursively
            await listAllUsers(listUsersResult.pageToken);
        }

    } catch (error) {
        console.log('Error listing users:', error);
    }
};

router.get("/all", async (req, res) => {
    try {
        data = []; // Reset the data array for each request
        await listAllUsers();  // Wait for users to be fetched before sending a response
        return res.status(200).send({success: true, data: data, dataCount: data.length});
    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `Error in listing users: ${err}`
        });
    }
});

module.exports = router;
