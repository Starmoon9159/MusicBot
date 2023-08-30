const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: ["join"],
    description: "讓機器人加入語音頻道",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

		const queue = client.distube.getQueue(interaction);
		if (queue) return interaction.editReply("我已經在語音頻道中播放音樂了.");
		const { channel } = interaction.member.voice;
		if (!channel) return interaction.editReply("您需要在語音頻道中.");

		await client.distube.voices.join(interaction.member.voice.channel);

		const embed = new EmbedBuilder()
			.setColor(client.color)
			.setDescription(`🔊 | **加入了：** \`${channel.name}\``);

		interaction.editReply({ embeds: [embed] });
    }
};
