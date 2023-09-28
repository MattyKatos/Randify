var axios = require("axios")
const qs = require('qs');
require('dotenv').config();
const fs = require('fs');

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

var body = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

const getAuth = async () => {
    try {
        //make post request to SPOTIFY API for access token, sending relavent info
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify({ 'grant_type': 'client_credentials' });

        const response = await axios.post(token_url, data, {
            headers: {
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        //return access token
        return response.data.access_token;
        //console.log(response.data.access_token);   
    } catch (error) {
        console.log(error.code);
    }
}

const getPlaylists = async (userID) => {
    const access_token = await getAuth();
    const api_url = "https://api.spotify.com/v1/users/" + userID + "/playlists"
    try {
        const response = await axios.get(api_url, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        console.log(response.data);
        fs.writeFile('./cache/'+userID+'playlists.json'),JSON.stringify(response.data), error => {
            if (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

getPlaylists('cannachronic')