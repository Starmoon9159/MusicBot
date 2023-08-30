const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["leave"],
    description: "讓機器人離開語音頻道",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
		if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道.");

        await client.distube.voices.leave(interaction.guild);

        const embed = new EmbedBuilder()
            .setDescription(`🚫 | **已離開：** | \`${channel.name}\``)
            .setColor(client.color);

        interaction.editReply({ embeds : [embed] });
    }
};
