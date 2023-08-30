const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["earrape"],
    description: "切換到Earrape效果",
    category: "Filter",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });;
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        queue.setVolume(1000)

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔊\` | **Volume charge to:** \`Earrape\``);

        interaction.editReply({ content: ' ', embeds: [embed] })

    }
};