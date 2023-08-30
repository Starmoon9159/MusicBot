const { EmbedBuilder } = require('discord.js');
const delay = require('delay');

module.exports = {
    name: ["reverse"],
    description: "切換到Reverse效果",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        queue.filters.add("reverse")

        const embed = new EmbedBuilder()
            .setAuthor({ name: '切換到: Reverse', iconURL: 'https://cdn.discordapp.com/emojis/758423098885275748.gif'})
            .setColor(client.color);

        await delay(5000);
        interaction.editReply({ content: ' ', embeds: [embed] })
    }
}; /// testing version