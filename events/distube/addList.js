const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GMessage = new Database("./settings/models/message.json", { databaseInObject: true });
const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, playlist) => {
   // 從 GSetup 取得資料庫設定
const db = await GSetup.get(queue.textChannel.guild.id);
if (db.setup_enable === true) return;

// 從 GMessage 取得訊息資料
const data = await GMessage.get(queue.textChannel.guild.id);
const msg = await queue.textChannel.messages.cache.get(data.message_id);

// 建立新的 Embed 物件
const embed = new EmbedBuilder()
    .setDescription(`**已加入對列 • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` (${playlist.songs.length} 首歌曲) • ${playlist.user}`)
    .setColor('#000001')

// 編輯訊息內容，更新為新的 Embed
await msg.edit({ content: " ", embeds: [embed] });

}