const { EmbedBuilder } = require('discord.js');
const { Database } = require("st.db");

const GVoice = new Database("./settings/models/voice.json", { databaseInObject: true });

module.exports = {
    name: ["247"],
    description: "在語音頻道中啟用或停用24小時在語音播放模式",
    category: "Music",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("你必須與我在同一個語音頻道.");

        const db = await GVoice.get(interaction.guild.id);

        if (db.voice_enable === true) {
            await client.createDVoice(interaction);

            const embed = new EmbedBuilder()
                .setDescription("🌙 | 模式 24/7 已被停用.")
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });
        } else if (db.voice_enable === false) {
            await client.createEVoice(interaction);

            const embed = new EmbedBuilder()
                .setDescription("🌕 | 模式 24/7 已被啟用.")
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });
        }
    }
};
