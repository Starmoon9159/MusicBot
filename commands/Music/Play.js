const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["play"],
    description: "播放來自指定來源的歌曲",
    category: "Music",
    options: [
        {
            name: "name",
            type: ApplicationCommandOptionType.String,
            description: "要播放的歌曲",
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction) => {
        try {
            if (interaction.options.getString("name")) {
                const db = await GSetup.get(interaction.guild.id);
                if (db.setup_enable === true) return interaction.reply("該指令已禁用，已有歌曲請求頻道!");

                await interaction.reply(`🔍 **搜索中...** \`${interaction.options.getString("name")}\``);

                const message = await interaction.fetchReply();
                await client.createPlay(interaction, message.id);

                const { channel } = interaction.member.voice;
                if (!channel) return interaction.editReply("你需要加入語音頻道.")
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`我沒有在 ${channel.name} 中的 \`CONNECT\` 權限來加入語音頻道!`);
                if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`我沒有在 ${channel.name} 中的 \`SPEAK\` 權限來加入語音頻道!`);

                try {
                    const string = interaction.options.getString("name");

                    const options = {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        interaction,
                    }

                    await client.distube.play(interaction.member.voice.channel, string, options);
                } catch (e) {
                    //
                }
            }
        } catch (e) {
            //
        }
    }
}
