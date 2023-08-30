const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["move"],
    description: "移動播放列表中歌曲的位置",
    category: "Music",
    options: [
        {
            name: "queue",
            description: "要移動的歌曲在播放列表中的位置",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: "position",
            description: "要移動到的位置在播放列表中的位置",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const tracks = interaction.options.getInteger("queue");
        const position = interaction.options.getInteger("position");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道.");

        if (tracks == 0) return interaction.editReply("無法移動正在播放的歌曲.");
        if (position == 0) return interaction.editReply("無法移動到正在播放的位置.");
        if (tracks > queue.songs.length) return interaction.editReply("播放列表 | 找不到歌曲.");
        if (position > queue.songs.length) return interaction.editReply("位置 | 找不到歌曲.");

        const song = queue.songs[tracks];

        await queue.songs.splice(tracks);
        await queue.addToQueue(song, position);

        const embed = new EmbedBuilder()
            .setDescription(`**已移動 • [${song.name}](${song.url})** 到位置 ${position}`)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });
    }
}
