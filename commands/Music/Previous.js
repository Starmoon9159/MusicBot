const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["previous"],
    description: "播放播放列表中的上一首歌曲",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道");

        if (queue.previousSongs.length == 0) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`🚨\` | **沒有** `上一首` **歌曲**")

            interaction.editReply({ embeds: [embed] });
        } else { 
            await client.distube.previous(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏮\` | **歌曲已跳轉至：** `上一首`")

            interaction.editReply({ embeds: [embed] });
        }        
    }
}
