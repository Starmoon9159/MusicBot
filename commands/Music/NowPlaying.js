const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["nowplaying"],
    description: "顯示當前正在播放的歌曲",
    category: "Music",
    run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });

        const db = await GSetup.get(interaction.guild.id);
        if (db.setup_enable === true) return interaction.editReply("指令已被停用，因為已有歌曲請求頻道!");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道.");

        const uni = `${queue.songs[0].playing ? '⏸️ |' : '🔴 |'}`;
        const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);

        const embed = new EmbedBuilder()
            .setAuthor({ name: queue.songs[0].playing ? '歌曲已暫停...' : '正在播放中...', iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif"})
            .setColor(client.color)
            .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
            .setThumbnail(`${queue.songs[0].thumbnail}`)
            .addFields({ name: '上傳者:', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true })
            .addFields({ name: '請求者:', value: `${queue.songs[0].user}`, inline: true })
            .addFields({ name: '音量:', value: `${queue.volume}%`, inline: true })
            .addFields({ name: '觀看次數:', value: `${queue.songs[0].views}`, inline: true })
            .addFields({ name: '點贊數:', value: `${queue.songs[0].likes}`, inline: true })
            .addFields({ name: '篩檢器:', value: `${queue.filters.names.join(', ') || "普通"}`, inline: true })
            .addFields({ name: `當前播放進度: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`${uni} ${'─'.repeat(part) + '🎶' + '─'.repeat(30 - part)}\`\`\``, inline: false })
            .setTimestamp()

        interaction.editReply({ embeds: [embed] });
    }
}
