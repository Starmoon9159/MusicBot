const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: ["skipto"],
    description: "跳轉到播放列表中的特定歌曲",
    category: "Music",
    options: [
        {
            name: "position",
            description: "播放列表中的歌曲位置",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("position");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道");

        if ((args > queue.songs.length) || (args && !queue.songs[args])) return interaction.editReply("找不到該歌曲.");

        await client.distube.jump(interaction, args)
        
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`⏭\` | **跳轉至：** ${args}`)

        interaction.editReply({ embeds: [embed] });
    }
}
