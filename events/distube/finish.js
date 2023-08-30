const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GVoice = new Database("./settings/models/voice.json", { databaseInObject: true });

module.exports = async (client, queue) => {
    const db = await GVoice.get(queue.textChannel.guild.id);

    if (db.voice_enable === true) {
        // 如果語音功能啟用，則更新音樂並發送結束訊息
        await client.UpdateMusic(queue);
    
        const embed = new EmbedBuilder()
            .setDescription(`\`📛\` | **歌曲已結束**`)
            .setColor('#000001')
    
        queue.textChannel.send({ embeds: [embed] })
    } else if (db.voice_enable === false) {
        // 如果語音功能未啟用，則更新音樂並離開語音頻道，然後發送結束訊息
        await client.UpdateMusic(queue);
        await client.distube.voices.leave(queue.textChannel.guild);
    
        const embed = new EmbedBuilder()
            .setDescription(`\`📛\` | **歌曲已結束**`)
            .setColor('#000001')
    
        queue.textChannel.send({ embeds: [embed] })
    }
    
}