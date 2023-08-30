const { EmbedBuilder } = require('discord.js');

module.exports = { 
    name: ["shuffle"],
    description: "將播放列表中的歌曲打亂順序",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        await client.distube.shuffle(interaction);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`\`🔀\` | **歌曲已被：** \`打亂順序\``);

        interaction.editReply({ embeds: [embed] });
    }
};
