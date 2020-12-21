global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');




exports.dashboardPage = (req, res) => { res.render("pages/myaccount/admin/dashboard");}

exports.userPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];

        let url = `http://localhost:3000/api/user/`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let userInfo = await fetch(url, myInit);
        userInfo = await userInfo.json();

        res.render('pages/myaccount/admin/user', {userInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
}

exports.partnerPage = async (req, res) => { 
    const token = req.cookies["token"];
    let url;

    let myInit = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    if (req.query) {
        let urlStringFilter = "?";
        for (let property in req.query) {
            urlStringFilter += `${property}=${req.query[property]}&`
        }
        urlStringFilter = urlStringFilter.slice(0, urlStringFilter.length-1)
        url = `http://localhost:3000/api/partner${urlStringFilter}`;
    
    }
    
    try {
        let urlSelect = `http://localhost:3000/api/partner`;

        let partnerInfoForSelect = await fetch(urlSelect, myInit);
        partnerInfoForSelect = await partnerInfoForSelect.json();

        let partnerInfo = await fetch(url, myInit);
        partnerInfo = await partnerInfo.json();
        
        partnerInfo.forEach(info => {
            if(info.image != "noImage") {
                info.image = JSON.parse(info.image);
            }
        })

        let foodType = Array.from(new Set(partnerInfoForSelect.map(element => element.foodType))).sort();
        let chain = Array.from(new Set(partnerInfoForSelect.map(element => element.chain))).sort();
        let postcode = Array.from(new Set(partnerInfoForSelect.map(element => element.address.postcode))).sort();
        let city = Array.from(new Set(partnerInfoForSelect.map(element => element.address.city))).sort();

        let urlContainer = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(urlContainer, myInit);
        containerInfo = await containerInfo.json();
       
        let material = Array.from(new Set(containerInfo.map(element => element.material))).sort();
        
        let selectInfo = {
            foodType: foodType,
            chain: chain,
            postcode: postcode,
            city: city,
            material: material
        };



        res.render('pages/myaccount/admin/partner', { selectInfo, containerInfo, partnerInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
}

exports.containerPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];
        let url = `http://localhost:3000/api/container/`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let containerInfo = await fetch(url, myInit);
        containerInfo = await containerInfo.json();

        res.render('pages/myaccount/admin/container', {containerInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
}

exports.historyPage = async (req, res) => { 
    try {
        let url;

        if (req.query) {
            let urlStringFilter = "?";
            for (let property in req.query) {
                urlStringFilter += `${property}=${req.query[property]}&`
            }
            urlStringFilter = urlStringFilter.slice(0, urlStringFilter.length-1)
            url = `http://localhost:3000/api/history${urlStringFilter}`;
        }

        const token = req.cookies["token"];
        let urlAll = `http://localhost:3000/api/history/`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let historyInfo = await fetch(url, myInit);
        historyInfo = await historyInfo.json();

        let selectInfo = await fetch(urlAll, myInit);
        selectInfo = await selectInfo.json();

        let day = [... new Set(selectInfo.map( history => {
            if(history.day<10) {
                return "0"+history.day
            } else {
                return history.day
            }
        }))].sort()

        let month = [... new Set(selectInfo.map( history => {
            if(history.month<10) {
                return "0"+history.month
            } else {
                return history.month
            }
        }))].sort()

        selectDateInfo = {day, month}

        res.render('pages/myaccount/admin/history', {historyInfo, selectInfo, selectDateInfo});
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
}