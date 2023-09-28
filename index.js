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
        console.log(response.data);
        fs.writeFileSync('./cache/playlists/'+userID+'.json',JSON.stringify(response.data.items).substring(0,JSON.stringify(response.data.items).length-1))
        if(response.data.next){getMore(response.data.next,userID)}else{fs.appendFileSync('./cache/playlists/'+userID+'.json',']')}
    } catch (error) {
        console.log(error);
    } 
};

const getMore = async (next,userID) => {
    const access_token = await getAuth();
    const api_url = next
    try {
        const response = await axios.get(api_url, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        console.log(response.data);
        fs.appendFileSync('./cache/playlists/'+userID+'.json',','+JSON.stringify(response.data.items).substring(1,JSON.stringify(response.data.items).length-1))
        if(response.data.next){getMore(response.data.next,userID)}else{fs.appendFileSync('./cache/playlists/'+userID+'.json',']')}
    } catch (error) {
        console.log(error);
    }
};

//getPlaylists('modifiedcatlady')

//DISCORD BOT

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Create a new commands collection
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

//Slash command listener
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Log in to Discord with your client's token
client.login(bot_token);