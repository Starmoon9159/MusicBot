const { PermissionsBitField, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const ytsr = require("@distube/ytsr");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = {
    name: ["search"],
    description: "搜尋歌曲並播放音樂",
    category: "Music",
    options: [
        {
            name: "name",
            type: ApplicationCommandOptionType.String,
            description: "要播放的歌曲",
            required: true
        }
    ],
    run: async (client, interaction) => {
        const string = interaction.options.getString("name");

        const db = await GSetup.get(interaction.guild.id);
        if (db.setup_enable === true) return interaction.reply("此指令已禁用，因為已有歌曲請求的頻道!");

        await interaction.reply(`🔍 **搜尋中...** \`${string}\``);

        const message = await interaction.fetchReply();
        await client.createPlay(interaction, message.id);

        const { channel } = interaction.member.voice;
        if (!channel) return interaction.editReply("您需要加入語音頻道.");
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)) return interaction.editReply(`我在 ${channel.name} 無法 \`連接\` 語音頻道!`);
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Speak)) return interaction.editReply(`我在 ${channel.name} 無法 \`發言\` 於語音頻道!`);

        const row = new  ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("one")
                .setEmoji("1️⃣")
                .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("two")
                .setEmoji("2️⃣")
                .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("three")
                .setEmoji("3️⃣")
                .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("four")
                .setEmoji("4️⃣")
                .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId("five")
                .setEmoji("5️⃣")
                .setStyle(ButtonStyle.Secondary)
            );

        const options = {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction,
        };

        const res = await ytsr(string, { safeSearch: true, limit: 5 });

        let index = 1;
        const result = res.items.slice(0, 5).map(x => `**(${index++}.) [${x.name}](${x.url})** 作者：\`${x.author}\``).join("\n");

        const embed = new EmbedBuilder()
            .setAuthor({ name: `選擇歌曲...`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor(client.color)
            .setDescription(result)
            .setFooter({ text: `請在30秒內回應` });

        await message.edit({ content: " ", embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, time: 30000, max: 1 });

        collector.on('collect', async (interaction) => {
            const id = interaction.customId;
            const loader = new EmbedBuilder()
                .setDescription("**正在載入請稍候....**");

            if(id === "one") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[0].url, options);
            } else if(id === "two") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[1].url, options);
            } else if(id === "three") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[2].url, options);
            } else if(id === "four") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[3].url, options);
            } else if(id === "five") {
                await message.edit({ embeds: [loader], components: [] });
                await client.distube.play(interaction.member.voice.channel, res.items[4].url, options);
            }
        });

        collector.on('end', async (collected, reason) => {
            if(reason === "time") {
                message.edit({ content: `沒有回應`, embeds: [], components: [] });
            }
        });
    }
}
