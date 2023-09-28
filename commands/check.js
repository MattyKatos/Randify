const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription('Returns the number of public playlists you have synced'),
	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUserName = interaction.user.username
		try {
			userData = require('../cache/users/' + DiscordID + '.json')
			const SpotifyID = userData.SpotifyID
			userPlaylists = require('../cache/playlists/' + SpotifyID + '.json')
			const count = userPlaylists.length + 1
			interaction.reply({ content: 'Your Discord is registered to the SpotifyID: "' + SpotifyID + '"\n' + 'You have synced ' + count + ' public playlists.', ephemeral: true })
			console.log('[' + DiscordUserName + '] ran command /check. A SpotifyID and Playlist count was returned')
		}
		catch (error) {
			interaction.followUp({ content: 'Error Code 500: Report to devs.', ephemeral: true })
		}
	},
};