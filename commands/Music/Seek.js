const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["seek"],
    description: "搜尋歌曲時間戳",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "要搜尋的時間戳（秒）",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        
        const value = interaction.options.getInteger("seconds");
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        if(value >= queue.songs[0].duration || value < 0) return interaction.editReply(`無法搜尋超出歌曲長度的時間.`);

        await queue.seek(value);

        const embed = new EmbedBuilder()
            .setDescription(`\`⏭\` | *已搜尋至：* \`${value}\``)
            .setColor(client.color);

        interaction.editReply({ embeds: [embed] });
    }
}
