const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["autoplay"],
    description: "切換伺服器的自動播放功能",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("你必須跟我在同一個語音頻道.");

        if (!queue.autoplay) {
            await client.distube.toggleAutoplay(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("📻 | 自動播放功能已被啟用.");

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.toggleAutoplay(interaction);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("📻 | 自動播放功能已被停用.");

            interaction.editReply({ embeds: [embed] });
        }
    }
};
