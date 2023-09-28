const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('path')
const mLDir = '../cache/masterlist'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Retuns a random playlist from the masterlist.'),
	async execute(interaction) {
		const DiscordID = interaction.user.id
		const DiscordUserName = interaction.user.username
		await interaction.deferReply({});
		try {
			const masterList = fs.readdirSync(path.join(__dirname,'..','cache','masterlist'))
			random = masterList[(Math.floor(Math.random()*masterList.length))]
			randomPlaylist = require('../cache/masterlist/'+random)
			interaction.editReply({ content: '# [' + randomPlaylist.name + ']' + '(' + randomPlaylist.external_urls.spotify + ')' })
			console.log('[' + DiscordUserName + '] ran command /random. A playlist was returned')
		}
		catch (error) {
			console.log(error)
		}
	},
};