const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: ["Context | Shuffle"],
    type: ApplicationCommandType.Message,
    category: "Context",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel)
            return interaction.editReply("你必須跟我在同一個語音頻道");

        await client.distube.shuffle(interaction);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription("`🔀` | **已隨機洗牌播放列表中的歌曲**");

        interaction.editReply({ embeds: [embed] });
    },
};
