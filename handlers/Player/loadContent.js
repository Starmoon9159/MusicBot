const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const delay = require("delay");

const db = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client) => {
    try {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.guild || interaction.user.bot) return;
            if (interaction.isButton()) {
                const { customId, member } = interaction;
                let voiceMember = interaction.guild.members.cache.get(member.id);
                let channel = voiceMember.voice.channel;

                const queue = client.distube.getQueue(interaction);
                if (!queue) return;

                const data = await db.get(interaction.guild.id);
                if (data.setup_enable === false) return;

                switch (customId) {
                    case "sprevious":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else if (queue.previousSongs.length == 0) {
                                interaction.reply("\`🚨\` | **目前沒有** `上一首` **歌曲**");
                            } else {
                                await client.distube.previous(interaction);
                                const embed = new EmbedBuilder()
                                    .setDescription("\`⏮\` | **歌曲已切換至：** `上一首`")
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sskip":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else if (queue.songs.length === 1 && queue.autoplay === false) {
                                const embed = new EmbedBuilder()
                                    .setColor("#000001")
                                    .setDescription("\`🚨\` | **播放列表中沒有** `歌曲`")

                                interaction.reply({ embeds: [embed] });
                            } else {
                                await client.distube.skip(interaction);
                                const embed = new EmbedBuilder()
                                    .setColor("#000001")
                                    .setDescription("\`⏭\` | **歌曲已切換至：** `下一首`")

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sstop":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else {
                                await client.distube.stop(interaction);
                                await client.distube.voices.leave(interaction.guild);

                                const memberVoice = interaction.member.voice.channel;

                                const embed = new EmbedBuilder()
                                    .setDescription(`\`🚫\` | **已離開：** | \`${memberVoice.name}\``)
                                    .setColor('#000001')

                                interaction.reply({ embeds: [embed] });
                                client.UpdateMusic(queue);
                            }
                        }
                        break;

                    case "spause":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else if (queue.paused) {
                                await client.distube.resume(interaction);

                                const embed = new EmbedBuilder()
                                    .setColor("#000001")
                                    .setDescription(`\`⏯\` | **歌曲已繼續播放**`);

                                interaction.reply({ embeds: [embed] });
                                client.UpdateQueueMsg(queue);
                            } else {
                                await client.distube.pause(interaction);

                                const embed = new EmbedBuilder()
                                    .setColor("#000001")
                                    .setDescription(`\`⏯\` | **歌曲已暫停播放**`);

                                interaction.reply({ embeds: [embed] });
                                client.UpdateQueueMsg(queue);
                            }
                        }
                        break;

                    case "sloop":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else if (queue.repeatMode === 2) {
                                await client.distube.setRepeatMode(interaction, 0);

                                const embed = new EmbedBuilder()
                                    .setColor("#000001")
                                    .setDescription(`\`🔁\` | **歌曲已取消循環播放**`);

                                interaction.reply({ embeds: [embed] });
                            } else {
                                await client.distube.setRepeatMode(interaction, 2);

                                const embed = new EmbedBuilder()
                                    .setColor("#000001")
                                    .setDescription(`\`🔁\` | **歌曲已設定為循環播放**`);

                                interaction.reply({ embeds: [embed] });
                            }
                        }
                        break;

                    case "sshuffle":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else {
                                await client.distube.shuffle(interaction);

                                const embed = new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`\`🔀\` | **歌曲已被打亂順序播放**`);

                                interaction.reply({ embeds: [embed] });
                                client.UpdateQueueMsg(queue);
                            }
                        }
                        break;

                    case "svoldown":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else {
                                await client.distube.setVolume(interaction, queue.volume - 10);

                                const embed = new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`\`🔊\` | **音量已減小至：** \`${queue.volume}\`%`);

                                interaction.reply({ embeds: [embed] });
                                client.UpdateQueueMsg(queue);
                            }
                        }
                        break;

                    case "sclear":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else {
                                await queue.songs.splice(1, queue.songs.length);

                                const embed = new EmbedBuilder()
                                    .setDescription(`\`📛\` | **播放列表已清空**`)
                                    .setColor(client.color);

                                interaction.reply({ embeds: [embed] });
                                client.UpdateQueueMsg(queue);
                            }
                        }
                        break;

                    case "svolup":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else {
                                await client.distube.setVolume(interaction, queue.volume + 10);

                                const embed = new EmbedBuilder()
                                    .setColor(client.color)
                                    .setDescription(`\`🔊\` | **音量已增加至：** \`${queue.volume}\`%`);

                                interaction.reply({ embeds: [embed] });
                                client.UpdateQueueMsg(queue);
                            }
                        }
                        break;

                    case "squeue":
                        {
                            if (!channel) {
                                return interaction.reply(`你需要加入語音頻道。`);
                            } else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) {
                                return interaction.reply(`你需要在相同的語音頻道中。`);
                            } else if (!queue) {
                                return interaction.reply(`目前播放列表中沒有任何歌曲！`);
                            } else {
                                const pagesNum = Math.ceil(queue.songs.length / 10);
                                if (pagesNum === 0) pagesNum = 1;

                                const songStrings = [];
                                for (let i = 1; i < queue.songs.length; i++) {
                                    const song = queue.songs[i];
                                    songStrings.push(
                                        `**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}
                                    `);
                                };

                                const pages = [];
                                for (let i = 0; i < pagesNum; i++) {
                                    const str = songStrings.slice(i * 10, i * 10 + 10).join('');
                                    const embed = new EmbedBuilder()
                                        .setAuthor({ name: `播放列表 - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setThumbnail(queue.songs[0].thumbnail)
                                        .setColor(client.color)
                                        .setDescription(`**正在播放：**\n**[${queue.songs[0].name}](${queue.songs[0].url})** \`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**播放列表其餘部分**${str == '' ? '  無' : '\n' + str}`)
                                        .setFooter({ text: `頁面 • ${i + 1}/${pagesNum} | ${queue.songs.length} • 首歌曲 | ${queue.formattedDuration} • 總時長` });

                                    pages.push(embed);
                                };

                                interaction.reply({ embeds: [pages[0]] });
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    } catch (e) {
        console.log(e);
    }

    client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;

        await client.createExSetup(message);

        const data = await db.get(message.guild.id);
        if (data.setup_enable === false) return;

        const channel = await message.guild.channels.cache.get(data.setup_ch);
        if (!channel) return;

        if (data.setup_ch != message.channel.id) return;

        if (message.author.id === client.user.id) {
            await delay(3000);
            message.delete();
        }

        if (message.author.bot) return;

        const song = message.cleanContent;
        await message.delete();

        const voiceChannel = await message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(`你必須在語音頻道`).then((msg) => {
            setTimeout(() => {
                msg.delete()
            }, 4000);
        });

        const options = {
            member: message.member,
            textChannel: message.channel,
            message,
        }

        await client.distube.play(message.member.voice.channel, song, options);
        await UpdateQueue(client, message);

    });
};

async function UpdateQueue(client, message) {
    const queue = client.distube.getQueue(message);
    if (queue) {
        await client.UpdateQueueMsg(queue);
    }
}