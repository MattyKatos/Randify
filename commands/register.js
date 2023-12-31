const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers your Discord to your Spotify')
		.addStringOption(option =>
			option.setName('userid')
			.setDescription('Your Spotify UserID')
			.setRequired(true)),
	async execute(interaction) {
		const SpotifyID = interaction.options.getString('userid')
		const DiscordID = interaction.user.id
		const DiscordUserName = interaction.user.username
		const DiscordGlobalName = interaction.user.globalName
		userData = '{"DiscordID":"'+DiscordID+'","DiscordUserName":"'+DiscordUserName+'","DiscordGlobalName":"'+DiscordGlobalName+'","SpotifyID":"'+SpotifyID+'"}'
		fs.writeFileSync('./cache/users/'+DiscordID+'.json',userData)
		interaction.reply({content:'Linked!', ephemeral: true});
		console.log('['+DiscordUserName+'] ran command /register. User data has been created.')
	},
};