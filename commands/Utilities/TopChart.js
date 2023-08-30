const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const ytsr = require("@distube/ytsr");

const SStats = new Database("./settings/models/chart.json", { databaseInObject: true });

module.exports = {
    name: ["topchart"],
    description: "顯示最近可播放的熱門歌曲",
    category: "Utilities",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const all = SStats.all().slice(0, 10);

        all.sort((a, b) => {
            return b.data - a.data;
        });

        var index = 0;

        for (let i = 0; i < all.length; i++) {
            const total = all[i].data;
            index = (index + total)
        }

        const TopChart = [];
        for (let i = 0; i < all.length; i++) {
            const format = `https://youtu.be/${all[i].ID}`;
            const search = await ytsr(format, { limit: 1 });
            const track = search.items[0];

            TopChart.push(
                `**${i + 1}.** [${track.name}](${track.url}) | **可播放次數：** \`${all[i].data}\`
                `)
        }

        const str = TopChart.join('');

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `排行榜`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(`${str == '' ? '  沒有可播放的歌曲' : '\n' + str}`)
            .setFooter({ text: `總歌曲數 • ${SStats.all().length} | 可播放次數 • ${index}` })


        return interaction.editReply({ embeds: [embed] })
    }
}