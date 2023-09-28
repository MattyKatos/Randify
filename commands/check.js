const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription('Returns the number of public playlists you have sync\'d'),
	async execute(interaction) {
		const DiscordID = interaction.user.id
		try {
			userData = require('../cache/users/' + DiscordID + '.json')
			console.log(userData)
			const SpotifyID = userData.SpotifyID
			userPlaylists = require('../cache/playlists/'+SpotifyID+'.json')
			const count = userPlaylists.length
			interaction.reply({ content: 'Found '+count+' public playlists.', ephemeral: true })
		}
		catch (error) {
			interaction.reply({ content: 'Unable to find your user data! Try using /register. ', ephemeral: true });
		}
	},
};