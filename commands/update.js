var axios = require("axios")
const qs = require('qs');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

//SPOTIFY CONFIG
const client_id = process.env.SPOTIFY_CLIENT_ID; // Spotify Client ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Spotify Client Secret
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

//DISCORD CONFIG
const app_id = process.env.DISCORD_APP_ID
const public_key = process.env.DISCORD_PUBLIC_KEY
const bot_token = process.env.DISCORD_BOT_TOKEN
const guild_id = process.env.DISCORD_GUILD_ID

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
		console.log('Fetching playlists for '+userID);
		fs.writeFileSync('./cache/playlists/' + userID + '.json', JSON.stringify(response.data.items).substring(0, JSON.stringify(response.data.items).length - 1))
		if (response.data.next) { getMore(response.data.next, userID) } else { fs.appendFileSync('./cache/playlists/' + userID + '.json', ']') }
	} catch (error) {
		console.log(error);
	}
};

const getMore = async (next, userID) => {
	const access_token = await getAuth();
	const api_url = next
	try {
		const response = await axios.get(api_url, {
			headers: {
				'Authorization': `Bearer ${access_token}`
			}
		});
		console.log('Fetching more playlists for '+userID);
		fs.appendFileSync('./cache/playlists/' + userID + '.json', ',' + JSON.stringify(response.data.items).substring(1, JSON.stringify(response.data.items).length - 1))
		if (response.data.next) { getMore(response.data.next, userID) } else { fs.appendFileSync('./cache/playlists/' + userID + '.json', ']') }
	} catch (error) {
		console.log(error);
	}
};

//COMMAND

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('Syncs your playlists'),
	async execute(interaction) {
		const DiscordID = interaction.user.id
		try {
			userData = require('../cache/users/' + DiscordID + '.json')
			console.log(userData)
			const SpotifyID = userData.SpotifyID
			getPlaylists(SpotifyID)
			interaction.reply({ content: 'Updated playlists! ', ephemeral: true })
		}
		catch (error) {
			console.log(error)
			interaction.reply({ content: 'Unable to find your user data! Try using /register. ', ephemeral: true });
		}
	},
};