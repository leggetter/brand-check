require('dotenv').config()

const axios = require("axios");

const RAPID_API_KEY = process.env.RAPID_API_KEY

async function checkBrand(brand) {

    const results = {
        brand: brand,
        twitter: {available: null},
        github: {available: null},
        dotcom: {available: null},
        dotio: {available: null},
        dotco: {available: null},
        urban_dictionary: {has_matches: null, matches: null}
    }

    try {
        const twitter = await axios.get(`https://twitter.com/${brand}`)
        results.twitter.available = twitter.status !== 200
    }
    catch(error) {
        if(error.response) {
            results.twitter.available = error.response.status === 404
        }
        else {
            console.error(`unknown error for twitter:${brand}`)
        }
    }

    try {
        const github = await axios.get(`https://github.com/${brand}`)
        results.github.available = github.status !== 200
    }
    catch(error) {
        if(error.response) {
            results.github.available = error.response.status === 404
        }
        else {
            console.error(`unknown error for twitter:${brand}`)
        }
    }

    try {
        const dotcom = await domainr(brand, 'com')
        results.dotcom.available = dotcom.status === 'undelegated inactive'
        results.dotcom.status = dotcom.status
    }
    catch(error) {
        console.error(error)
        console.error('unexpected error getting .com status')
    }

    try {
        const dotio = await domainr(brand, 'io')
        results.dotio.available = dotio.status === 'undelegated inactive'
        results.dotio.status = dotio.status
    }
    catch(error) {
        console.error(error)
        console.error('unexpected error getting .io status')
    }

    try {
        const dotco = await domainr(brand, 'co')
        results.dotco.available = dotco.status === 'undelegated inactive'
        results.dotco.status = dotco.status
    }
    catch(error) {
        console.error(error)
        console.error('unexpected error getting .co status')
    }

    try {
        const urban = await axios.get(`http://api.urbandictionary.com/v0/define?term=${brand}`)
        results.urban_dictionary.has_matches = urban.data.list.length > 0
        results.urban_dictionary.matches = urban.data.list
    }
    catch(error) {
        console.error(`error for Urban Dictionary:${brand}`)
        console.error(error)
    }

    console.log(results)

    return results
}

async function domainr(brand, tld) {
    const result = await axios({
        "method": "GET",
        "url": "https://domainr.p.rapidapi.com/v2/status",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "domainr.p.rapidapi.com",
            "x-rapidapi-key": RAPID_API_KEY
        },
        "params": {
            "domain": `${brand}.${tld}`,
            "mashape-key": RAPID_API_KEY
        }
    })

    return result.data.status[0]
}

const express = require("express");
const app = express();

app.set('view engine', 'ejs');

app.get("/check", handleCheck)

app.get("/check/:brand", handleCheck)

async function handleCheck (request, response) {
    // console.log(request);

    const brand = request.params.brand || request.query.brand

    const checkResult = await checkBrand(brand)

    if(request.accepts('html')) {
        response.render('pages/index', {results: checkResult});
    }
    else {
        response.json(checkResult)
    }
}

app.get('/', (request, response) => {
    response.json({hello: 'world'})
})

const brand = process.argv[2]
if (brand) {
    console.log('performing brand checks for', brand)
    checkBrand(brand)
}
else {
    const listener = app.listen(process.env.PORT || 3000, () => {
        console.log("Your app is listening on port " + listener.address().port);
    });
}