const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["skip"],
    description: "跳過目前正在播放的歌曲",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        if (queue.songs.length === 1 && queue.autoplay === false) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`🚨\` | **播放列表中沒有** `歌曲`")

            interaction.editReply({ embeds: [embed] });
        } else { 
            await client.distube.skip(interaction);
            
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription("\`⏭\` | **歌曲已被：** `跳過`")

            interaction.editReply({ embeds: [embed] });
        }
    }
}
