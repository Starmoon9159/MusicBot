const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: ["volume"],
    description: "調整機器人的音量",
    category: "Music",
    options: [
        {
            name: "amount",
            description: "設定機器人的音量",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const volume = interaction.options.getInteger("amount");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        if (!volume) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`目前的 **音量** : \`${queue.volume}\`%`)

            return interaction.editReply({ embeds: [embed] });
        }

        if (volume < 1 || volume > 100) return interaction.editReply(`請提供介於 1 到 100 之間的數字`)

        await client.distube.setVolume(interaction, volume);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔊\` | **音量已調整至:** \`${volume}\`%`)

        interaction.editReply({ embeds: [embed] });
    }
}
