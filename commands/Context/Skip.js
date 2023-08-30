const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: ["Context | Skip"],
    type: ApplicationCommandType.Message,
    category: "Context",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel)
            return interaction.editReply("你必須跟我在同一個語音頻道");

        if (queue.songs.length === 1 && queue.autoplay === false) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("`🚨` | **目前播放列表中沒有其他歌曲**");

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.skip(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("`⏭` | **成功跳過歌曲**");

            interaction.editReply({ embeds: [embed] });
        }
    },
};