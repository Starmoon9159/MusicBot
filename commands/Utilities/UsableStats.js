const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const BStats = new Database("./settings/models/stats.json", { databaseInObject: true });

module.exports = {
    name: ["usablestats"],
    description: "顯示所有可使用的指令統計",
    category: "Utilities",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const all = BStats.all().slice(0, 10);

        all.sort((a, b) => {
            return b.data - a.data;
        });

        var index = 0;

        for (let i = 0; i < all.length; i++) {
            const total = all[i].data;
            index = (index + total)
        }

        const TopUsable = [];
        for (let i = 0; i < all.length; i++) {
            const name = all[i].ID;
            const usable = all[i].data;

            TopUsable.push(
                `**${i + 1}.** ${name} | **可用次數：** \`${usable}\`
                `)
        }

        const str = TopUsable.join('');

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `可用指令統計!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`${str == '' ? '  沒有可用指令' : '\n' + str}`)
            .setFooter({ text: `總指令數 • ${BStats.all().length} | 可用次數 • ${index}` })


        return interaction.editReply({ embeds: [embed] })
    }
}
