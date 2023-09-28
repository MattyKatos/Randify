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
		try {
            await interaction.deferReply({ephemeral: true});
			userData = require('../cache/users/' + DiscordID + '.json')
			console.log(userData)
			const SpotifyID = userData.SpotifyID
			userPlaylists = require('../cache/playlists/'+SpotifyID+'.json')
            for (let x = 0; x < userPlaylists.length+1; x++) {
                console.log("Sending Playlist "+x+" of " + userPlaylists.length + " for " + DiscordID)
                //await wait(1000)
                await interaction.followUp({ content: '# ['+userPlaylists[x].name+']'+'('+userPlaylists[x].external_urls.spotify+')' +"\n" + userPlaylists[x].tracks.total + " Tracks" + "\n", components:[row] , ephemeral: true });
              }
              
		}
		catch (error) {
            console.log(error)
			interaction.reply({ content: 'Unable to find your user data! Try using /register. ', ephemeral: true });
		}
	},
};