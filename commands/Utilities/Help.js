const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: ["help"],
    description: "顯示機器人擁有的所有指令",
    category: "Utilities",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${interaction.guild.members.me.displayName} 幫助指令!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));
        const categories = readdirSync("./commands/")

        embed.setDescription(`機器人的前綴是：**/**`)
        embed.setFooter({ text: `© ${interaction.guild.members.me.displayName} | 總指令數量：${client.slash.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })});

        categories.forEach(category => {
            const dir = client.slash.filter(c => c.category === category);
            const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

            try {
                embed.addFields({ name: `❯ ${capitalise} [${dir.size}]:`, value: `${dir.map(c => `\`${c.name.at(-1)}\``).join(", ")}`, inline: false })
            } catch(e) {
                console.log(e)
            }
        })

        return interaction.editReply({ embeds: [embed] })
    }
}