const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["restart"],
    description: "關閉機器人",
    category: "Utilities",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        if(interaction.user.id != client.owner) return interaction.channel.send("你又不是機器人擁有者你在這裝可愛是不是==")

        const embed = new EmbedBuilder()
            .setDescription("**機器人**: `正在進入睡眠...`")
            .setColor(client.color);

        await interaction.editReply({ embeds: [embed] });
        process.exit();
    }
};