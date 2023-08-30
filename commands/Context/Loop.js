const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: ["Context | Loop"],
    type: ApplicationCommandType.Message,
    category: "Context",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("你必須與我在同一個語音頻道.");

        if (queue.repeatMode === 2) {
            await client.distube.setRepeatMode(interaction, 0);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("🔁 | 歌曲已取消循環播放：全部");

            interaction.editReply({ embeds: [embed] });
        } else {
            await client.distube.setRepeatMode(interaction, 2);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("🔁 | 歌曲已設置為循環播放：全部");

            interaction.editReply({ embeds: [embed] });
        }
    }
};
