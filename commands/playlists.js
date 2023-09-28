const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlists')
		.setDescription('Shows you all your playlists.'),
	async execute(interaction) {

		const upload = new ButtonBuilder()
			.setCustomId('upload')
			.setLabel('Upload')
			.setStyle(ButtonStyle.Success)
            .setDisabled(true);

        const row = new ActionRowBuilder()
			.addComponents(upload);

		const DiscordID = interaction.user.id
		const DiscordUserName = interaction.user.username
		await interaction.deferReply({ephemeral: true});
		try {
			userData = require('../cache/users/' + DiscordID + '.json')
			const SpotifyID = userData.SpotifyID
			userPlaylists = require('../cache/playlists/'+SpotifyID+'.json')
			console.log('['+DiscordUserName+'] ran command /playlists.')
            for (let x = 0; x < userPlaylists.length+1; x++) {
                console.log('['+DiscordUserName+"] Sending Playlist "+x+" of " + userPlaylists.length)
                //await wait(1000)
                await interaction.followUp({ content: '# ['+userPlaylists[x].name+']'+'('+userPlaylists[x].external_urls.spotify+')' +"\n" + userPlaylists[x].tracks.total + " Tracks" + "\n", components:[row] , ephemeral: true });
            }
		}
		catch (error) {
			interaction.followUp({ content: 'Unable to find any playlists linked to you! Try using /check.', ephemeral: true });
			console.log('['+DiscordUserName+'] ran command /playlists but no playlists were found linked to them.')
		}
	},
};