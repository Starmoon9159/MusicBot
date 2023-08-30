const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { QueuePage } = require('../../structures/PageQueue.js');

module.exports = {
    name: ["queue"],
    description: "顯示播放列表中的歌曲",
    category: "Music",
    options: [
        {
            name: "page",
            description: "要顯示的頁數",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("page");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道");

        let pagesNum = Math.ceil(queue.songs.length / 10);
        if (pagesNum === 0) pagesNum = 1;

        const songStrings = [];
        for (let i = 1; i < queue.songs.length; i++) {
            const song = queue.songs[i];
            songStrings.push(
                `**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}\n`
            );
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join('');
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Queue - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
                .setThumbnail(queue.songs[0].thumbnail)
                .setColor(client.color)
                .setDescription(`**目前播放：**\n**[${queue.songs[0].name}](${queue.songs[0].url})** \`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**播放列表的其餘部分**${str === '' ? '  沒有歌曲' : '\n' + str }`)
                .setFooter({ text: `頁數 • ${i + 1}/${pagesNum} | ${queue.songs.length} • 首歌曲 | ${queue.formattedDuration} • 總時長`});
            pages.push(embed);
        }

        if (!args) {
            if (pages.length === pagesNum && queue.songs.length > 10) QueuePage(client, interaction, pages, 60000, queue.songs.length, queue.formattedDuration);
            else return interaction.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(args)) return interaction.editReply('頁數必須是數字.');
            if (args > pagesNum) return interaction.editReply(`只有 ${pagesNum} 頁可供查看.`);
            const pageNum = args === 0 ? 1 : args - 1;
            return interaction.editReply({ embeds: [pages[pageNum]] });
        }
    }
}
