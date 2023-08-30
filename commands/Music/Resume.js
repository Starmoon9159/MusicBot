const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["resume"],
    description: "恢復播放音樂",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道");

        if (queue.paused) { 
            await client.distube.resume(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏯\` | **歌曲已恢復播放**");

            interaction.editReply({ embeds: [embed] });
            client.UpdateQueueMsg(queue);
        } else {
            await client.distube.pause(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏯\` | **歌曲已暫停**");

            interaction.editReply({ embeds: [embed] });
            client.UpdateQueueMsg(queue);
        }
    }
}
