const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["remove"],
    description: "從播放列表中移除歌曲",
    category: "Music",
    options: [
        {
            name: "position",
            description: "要移除的歌曲在播放列表中的位置",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("position");
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道");

        if (tracks == 0) return interaction.editReply("無法移除正在播放的歌曲.");
        if (tracks > queue.songs.length) return interaction.editReply("找不到該歌曲.");

        const song = queue.songs[tracks];

        await queue.songs.splice(tracks, 1);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`**已移除 • [${song.name}](${song.url})** \`${song.formattedDuration}\` • ${song.user}`)

        interaction.editReply({ content: " ", embeds: [embed] });
    }
}
