const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.setDescription('Returns the number of public playlists you have sync\'d'),
	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUserName = interaction.user.username
		try {
			userData = require('../cache/users/' + DiscordID + '.json')
			const SpotifyID = userData.SpotifyID
			userPlaylists = require('../cache/playlists/' + SpotifyID + '.json')
			const count = userPlaylists.length
			interaction.reply({ content: 'Your Discord is registered to the SpotifyID: "' + SpotifyID + '"\n' + 'You have synced '+ count + ' public playlists.', ephemeral: true })
			console.log('['+DiscordUserName+'] ran command /check. A SpotifyID and Playlist count was returned')
		}
		catch (error) {
			try {
				userData = require('../cache/users/' + DiscordID + '.json')
				const SpotifyID = userData.SpotifyID
				interaction.reply({ content: 'Your Discord is registered to the SpotifyID: "' + SpotifyID + '"\n' + 'You don\'t have any synced playlists yet. Try using /update', ephemeral: true })
				console.log('['+DiscordUserName+'] ran command /check. A SpotifyID was returned')
			} catch (error) {
				interaction.reply({ content: 'Unable to find your user data! Try using /register first.', ephemeral: true });
				console.log('['+DiscordUserName+'] ran command /check. No user data was found.')
			}

		}
	},
};