const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["clearqueue"],
    description: "清除播放列表中的所有歌曲",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("你必須跟我在同一個語音頻道.");

        await queue.songs.splice(1, queue.songs.length);
        await client.UpdateQueueMsg(queue);

        const embed = new EmbedBuilder()
            .setDescription("📛 | 播放列表已被清除.")
            .setColor(client.color);

        interaction.editReply({ embeds: [embed] });
    }
};
