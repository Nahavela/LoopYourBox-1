global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');

exports.containerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        res.render('pages/container/container', {containerInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.containerDetailsPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/container/${req.params.id}`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        if (containerInfo.image != "noImage") {
            containerInfo.image = JSON.parse(containerInfo.image);
        }
        res.render('pages/container/containerDetails', {containerInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.createContainerPage = async (req, res) => { 
    const token = req.cookies['token'];
    const decodedToken = jwt.verify(token, process.env.JWT_PW);
    const userId = decodedToken.userId;
    try {
        let url = `http://localhost:3000/api/partner/container/${userId}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let partnerInfo = await fetch(url, myInit);
        partnerInfo = await partnerInfo.json();
        let partnerId = partnerInfo._id


        let urlUser = `http://localhost:3000/api/user/${userId}`;

        let userInfo = await fetch(urlUser, myInit);
        userInfo = await userInfo.json();

        let urlContainer = `http://localhost:3000/api/container/partner/default`;

        let containerInfo = await fetch(urlContainer, myInit);
        containerInfo = await containerInfo.json();

        /*if (userInfo.status == "admin") {
            partnerId = "default";
        }*/

        console.log(userInfo.status)

        res.render('pages/container/createContainer', {partnerId, containerInfo, userStatus: userInfo.status})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.updateContainerPage = async (req, res) => { 
    try {
        //const token = req.cookies['token'];
        let url = `http://localhost:3000/api/container/${req.params.id}`;

        /*let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };*/

        let containerInfo = await fetch(url /*, myInit*/);
        containerInfo = await containerInfo.json();

        if (containerInfo.image != "noImage") {
            containerInfo.image = JSON.parse(containerInfo.image);
        }

        res.render('pages/container/updateContainer', {containerInfo})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
    }
};