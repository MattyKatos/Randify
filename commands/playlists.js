const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const wait = require('node:timers/promises').setTimeout;

async function showPlaylist(interaction,x){

	const upload = new ButtonBuilder()
		.setCustomId('upload')
		.setLabel('Upload')
		.setStyle(ButtonStyle.Success)
		.setEmoji('✅')

	const next = new ButtonBuilder()
		.setCustomId('next')
		.setLabel(' ')
		.setStyle(ButtonStyle.Secondary)
		.setEmoji('▶️')

	const last = new ButtonBuilder()
		.setCustomId('last')
		.setLabel(' ')
		.setStyle(ButtonStyle.Secondary)
		.setEmoji('◀️')

	const row = new ActionRowBuilder()
		.addComponents(upload, next);

	const DiscordID = interaction.user.id
	const DiscordUserName = interaction.user.username
	try {
		userData = require('../cache/users/' + DiscordID + '.json')
		const SpotifyID = userData.SpotifyID
		userPlaylists = require('../cache/playlists/' + SpotifyID + '.json')
		console.log('[' + DiscordUserName + '] ran command /playlists.')
		console.log('[' + DiscordUserName + "] Sending Playlist " + x)
		const response = await interaction.editReply({
			content: '# [' + userPlaylists[x].name + ']' + '(' + userPlaylists[x].external_urls.spotify + ')' + "\n" + parseFloat(x+1) + '/' + parseFloat(userPlaylists.length+1),
			components: [row],
			ephemeral: true
		});
		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 600_000 });

			if (confirmation.customId === 'next') {
				if (x < userPlaylists.length) { x++ } else { x = 0 }
				await confirmation.update({ content: 'Loading...', components: [] });
				showPlaylist(interaction,x)
			} else if (confirmation.customId === 'last') {
				if (x = 0 ) { x = userPlaylists.length } else { x-- }
				await confirmation.update({ content: 'Loading...', components: [] });
				showPlaylist(interaction,x)
			} else if (confirmation.customId === 'upload') {
				fs.writeFileSync('./cache/masterlist/' + DiscordID + '-' + userPlaylists[x].id+'.json', JSON.stringify(userPlaylists[x]))
				interaction.editReply({ content: 'Playlist Uploaded!', components: [] });
			}

		} catch (e) {
			console.log(e)
			await interaction.editReply({ content: 'Request timed out.', components: [] });
		}

	} catch (error) {
		console.log(error)
		interaction.followUp({ content: 'Unable to find any playlists linked to you! Try using /check.', ephemeral: true });
		console.log('[' + DiscordUserName + '] ran command /playlists but no playlists were found linked to them.')
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlists')
		.setDescription('Shows you all your playlists.'),
	async execute(interaction) {
		var x = 0
		await interaction.deferReply({ ephemeral: true });
		showPlaylist(interaction,x)
	},
};