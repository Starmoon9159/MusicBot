const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["setup"],
    description: "設置頻道歌曲請求",
    category: "Utilities",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.editReply(`您沒有權限進行此操作.`);

        await interaction.guild.channels.create({
            name: "command-channel",
            type: 0,
            topic: `⏯ *暫停/恢復播放音樂.*\n⬅ *播放上一首歌曲.*\n⏹ *停止播放音樂.*\n➡ *跳過當前歌曲.*\n🔁 *循環播放當前歌曲.*`,
            parent_id: interaction.channel.parentId,
            user_limit: 3,
            rate_limit_per_user: 3,
        }).then(async (channel) => {
            const attachment = new AttachmentBuilder("./settings/images/banner.png", { name: "setup.png" });

            const content = `**__歌曲排隊列表:__**\n加入語音頻道並在此排隊點播歌曲.`;

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: `當前沒有正在播放的歌曲.` })
                .setImage(`https://images2.alphacoders.com/110/thumb-1920-1109233.jpg`)
                .setDescription(`>>> [邀請機器人](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2184310032&scope=bot%20applications.commands) | [支援伺服器](https://discord.gg/SNG3dh3MbR) | [官方網站](https://adivise.github.io/Stylish/)`)
                .setFooter({ text: `前綴：/` });

            // 先發送橫幅!
            await channel.send({ files: [attachment] });
            await channel.send({ content: `${content}`, embeds: [embed], components: [client.diSwitch, client.diSwitch2] }).then(async (message) => {

                // 創建資料庫!
                await client.createSetup(interaction, channel.id, message.id); // 可在 handlers/loadDatabase.js 找到

                const embed = new EmbedBuilder()
                    .setDescription(`*成功在* ${channel} *設置音樂系統.*`)
                    .setColor(client.color);

                return interaction.followUp({ embeds: [embed] });
            })
        });
    }
};