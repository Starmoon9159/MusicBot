const { PermissionsBitField, ApplicationCommandType } = require('discord.js');
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = { 
    name: ["Context | Play"],
    type: ApplicationCommandType.Message,
    category: "Context",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const string = (interaction.channel.messages.cache.get(interaction.targetId)?.content ?? (await interaction.channel.messages.fetch(interaction.targetId)).content);
        if (!string.startsWith('https')) return interaction.editReply("訊息必須是一個連結.");

        const db = await GSetup.get(interaction.guild.id);
        if (db.setup_enable === true) return interaction.editReply("指令已被停用，因為已設定了點歌請求的頻道!");

        await interaction.editReply(`🔍 **搜尋中...** \`${string}\``);

        const message = await interaction.fetchReply();
        await client.createPlay(interaction, message.id);

        const { channel } = interaction.member.voice;
        if (!channel) return interaction.editReply("你需要在語音頻道中.");
        if (!channel.permissionsFor(interaction.guild.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`我沒有 \`CONNECT\` 權限在 ${channel.name} 加入語音頻道!`);
        if (!channel.permissionsFor(interaction.guild.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`我沒有 \`SPEAK\` 權限在 ${channel.name} 加入語音頻道!`);

        try {
            const options = {
                member: interaction.member,
                textChannel: interaction.channel,
                interaction,
            };

            await client.distube.play(channel, string, options);
        } catch (e) {
            // 在此處處理任何錯誤
        }
    },
};
