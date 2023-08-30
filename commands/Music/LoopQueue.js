const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["loopqueue"],
    description: "循環播放播放列表中的所有歌曲",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道.");

        if (queue.repeatMode === 2) {
            await client.distube.setRepeatMode(interaction, 0);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("🔁 | **歌曲已停止循環播放：** `全部歌曲`");

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.setRepeatMode(interaction, 2);
            
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("🔁 | **歌曲已循環播放：** `全部歌曲`");

            interaction.editReply({ embeds: [embed] });
        }
    }
};
