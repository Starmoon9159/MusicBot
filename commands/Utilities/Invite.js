const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: ["invite"],
    description: "邀請機器人加入您的伺服器",
    category: "Utilities",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: "邀請!" })
            .setDescription("```邀請我加入您的伺服器!```")
            .setTimestamp()
            .setFooter({ text: `由 ${interaction.user.tag} 要求`, iconURL: interaction.user.displayAvatarURL() });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("邀請")
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands`)
                    .setEmoji("🔗")
                    .setStyle(ButtonStyle.Link)
            )

        interaction.editReply({ embeds: [embed], components: [row] });
    }
}