const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const db = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client) => {

    // 更新播放列表的訊息
    client.UpdateQueueMsg = async function (queue) {
        const CheckDB = await db.has(queue.textChannel.guild.id);
        if(!CheckDB) return;

        const data = await db.get(queue.textChannel.guild.id);
        if (data.setup_enable === false) return;

        const channel = await client.channels.cache.get(data.setup_ch);
        if (!channel) return;

        const playMsg = await channel.messages.fetch(data.setup_msg, { cache: false, force: true });
        if (!playMsg) return;

        const songStrings = [];
        const queuedSongs = queue.songs.map((song, i) => `*\`${i + 1} • ${song.name} • [${song.formattedDuration}]\`* • \`${song.user.tag}\``);

        songStrings.push(...queuedSongs);

        const Str = songStrings.slice(0, 10).join('\n');

        const cSong = queue.songs[0];

        const played = queue.playing ? `正在播放...` : `歌曲暫停...`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${played}`, iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
            .setDescription(`[${cSong.name}](${cSong.url}) \`[${cSong.formattedDuration}]\` • ${cSong.user}`) // [${cSong.title}](${cSong.uri}) \`[${formatDuration(cSong.duration)}]\` • ${cSong.requester}
            .setColor(client.color)
            .setImage(`https://img.youtube.com/vi/${cSong.id}/sddefault.jpg`)
            .setFooter({ text: `${queue.songs.length} • 排隊中的歌曲數 | 音量 • ${queue.volume}% | ${queue.formattedDuration} • 總時長` }) //${queue.queue.length} • Song's in Queue | Volume • ${queue.volume}% | ${qDuration} • Total Duration

        return playMsg.edit({ 
            content: `**__播放列表：__**\n${Str == '' ? `加入語音頻道，然後在此處按名稱或URL排隊歌曲。` : '\n' + Str}`, 
            embeds: [embed],
            components: [client.enSwitch, client.enSwitch2] 
        }).catch((e) => {});
    };

    // 更新音樂播放時的狀態
    client.UpdateMusic = async function (queue) {
        const CheckDB = await db.has(queue.textChannel.guild.id);
        if(!CheckDB) return;

        const data = await db.get(queue.textChannel.guild.id);

        if (data.setup_enable === false) return;

        const channel = await client.channels.cache.get(data.setup_ch);
        if (!channel) return;

        const playMsg = await channel.messages.fetch(data.setup_msg, { cache: false, force: true });
        if (!playMsg) return;

        const queueMsg = `**__播放列表：__**\n加入語音頻道，然後在此處按名稱或URL輸入在聊天室。`;

        const playEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `目前沒有播放任何歌曲。` })
          .setImage(`https://images2.alphacoders.com/110/thumb-1920-1109233.jpg`)
          .setDescription(`>>> [邀請機器人](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands) | [支援伺服器](https://discord.gg/74qYKnvn9R) | [網站](http://starmoon.ml)`)
          .setFooter({ text: `指令前綴：/` });

        return playMsg.edit({ 
            content: `${queueMsg}`, 
            embeds: [playEmbed], 
            components: [client.diSwitch, client.diSwitch2] 
        }).catch((e) => {});
    };
};
