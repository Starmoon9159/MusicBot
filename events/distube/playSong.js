const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, track) => {
  
  await client.UpdateQueueMsg(queue);
await client.addChart(track.id);

const db = await GSetup.get(queue.textChannel.guild.id);
if (db.setup_enable === true) return;

var newQueue = client.distube.getQueue(queue.id);
var data = disspace(newQueue, track);

const nowplay = await queue.textChannel.send(data);

const filter = (message) => {
  if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId === message.member.voice.channelId) return true;
  else {
    message.reply({ content: "你必須跟我在同個語音頻道", ephemeral: true });
  }
};
const collector = nowplay.createMessageComponentCollector({ filter, time: 120000 });

collector.on('collect', async (message) => {
  const id = message.customId;
  const queue = client.distube.getQueue(message.guild.id);
  if (id === "pause") {
    if (!queue) {
      collector.stop();
    }
    if (queue.paused) {
      await client.distube.resume(message.guild.id);
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`⏯\` | **歌曲已恢復播放**`);

      message.reply({ embeds: [embed], ephemeral: true });
    } else {
      await client.distube.pause(message.guild.id);
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`⏯\` | **歌曲已暫停**`);

      message.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (id === "skip") {
    if (!queue) {
      collector.stop();
    }
    if (queue.songs.length === 1 && queue.autoplay === false) {
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`🚨\` | **隊列中沒有更多歌曲**`);

      message.reply({ embeds: [embed], ephemeral: true });
    } else {
      await client.distube.skip(message);
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`⏭\` | **歌曲已跳過**`);

      nowplay.edit({ components: [] });
      message.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (id === "stop") {
    if (!queue) {
      collector.stop();
    }
    await client.distube.voices.leave(message.guild);
    const embed = new EmbedBuilder()
      .setDescription(`\`🚫\` | **歌曲已停止**`)
      .setColor('#000001');

    await nowplay.edit({ components: [] });
    message.reply({ embeds: [embed], ephemeral: true });
  } else if (id === "loop") {
    if (!queue) {
      collector.stop();
    }
    if (queue.repeatMode === 0) {
      client.distube.setRepeatMode(message.guild.id, 1);
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`🔁\` | **循環播放當前歌曲**`);

      message.reply({ embeds: [embed], ephemeral: true });
    } else {
      client.distube.setRepeatMode(message.guild.id, 0);
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`🔁\` | **取消循環播放當前歌曲**`);

      message.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (id === "previous") {
    if (!queue) {
      collector.stop();
    }
    if (queue.previousSongs.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`🚨\` | **沒有更多上一首歌曲**`);

      message.reply({ embeds: [embed], ephemeral: true });
    } else {
      await client.distube.previous(message);
      const embed = new EmbedBuilder()
        .setColor("#000001")
        .setDescription(`\`⏮\` | **回到上一首歌曲**`);

      await nowplay.edit({ components: [] });
      message.reply({ embeds: [embed], ephemeral: true });
    }
  } else if (id === "shuffle") {
    if (!queue) {
      collector.stop();
    }
    await client.distube.shuffle(message);
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`\`🔀\` | **已將歌曲隨機排序**`);

    message.reply({ embeds: [embed], ephemeral: true });
  } else if (id === "voldown") {
    if (!queue) {
      collector.stop();
    }
    await client.distube.setVolume(message, queue.volume - 5);
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`\`🔉\` | **音量降低到:** \`${queue.volume}\`%`);

    message.reply({ embeds: [embed], ephemeral: true });
  } else if (id === "clear") {
    if (!queue) {
      collector.stop();
    }
    await queue.songs.splice(1, queue.songs.length);
    await client.UpdateQueueMsg(queue);

    const embed = new EmbedBuilder()
      .setDescription(`\`📛\` | **隊列已清空**`)
      .setColor(client.color);

    message.reply({ embeds: [embed], ephemeral: true });
  } else if (id === "volup") {
    if (!queue) {
      collector.stop();
    }
    await client.distube.setVolume(message, queue.volume + 5);
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`\`🔊\` | **音量提高到:** \`${queue.volume}\`%`);

    message.reply({ embeds: [embed], ephemeral: true });
  } else if (id === "queue") {
    if (!queue) {
      collector.stop();
    }
    let pagesNum = Math.ceil(queue.songs.length / 10);
    if (pagesNum === 0) pagesNum = 1;

    const songStrings = [];
    for (let i = 1; i < queue.songs.length; i++) {
      const song = queue.songs[i];
      songStrings.push(
        `**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}\n`
      );
    }

    const pages = [];
    for (let i = 0; i < pagesNum; i++) {
      const str = songStrings.slice(i * 10, i * 10 + 10).join('');
      const embed = new EmbedBuilder()
        .setAuthor({ name: `隊列 - ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setThumbnail(queue.songs[0].thumbnail)
        .setColor(client.color)
        .setDescription(`**正在播放:**\n**[${queue.songs[0].name}](${queue.songs[0].url})** \`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**隊列其餘部分**${str === '' ? '  無' : '\n' + str}`)
        .setFooter({ text: `頁面 • ${i + 1}/${pagesNum} | ${queue.songs.length} • 首歌曲 | ${queue.formattedDuration} • 總時長` });

      pages.push(embed);
    }

    message.reply({ embeds: [pages[0]], ephemeral: true });
  }
});

collector.on('end', async (collected, reason) => {
  if (reason === "time") {
    nowplay.edit({ components: [] });
  }
});
}

function disspace(nowQueue, nowTrack) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: `開始播放...`, iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
    .setThumbnail(nowTrack.thumbnail)
    .setColor('#000001')
    .setDescription(`**[${nowTrack.name}](${nowTrack.url})**`)
    .addFields({ name: `上傳者:`, value: `**[${nowTrack.uploader.name}](${nowTrack.uploader.url})**`, inline: true })
    .addFields({ name: `請求者:`, value: `${nowTrack.user}`, inline: true })
    .addFields({ name: `當前音量:`, value: `${nowQueue.volume}%`, inline: true })
    .addFields({ name: `濾鏡:`, value: `${nowQueue.filters.names.join(", ") || "正常"}`, inline: true })
    .addFields({ name: `自動播放:`, value: `${nowQueue.autoplay ? "啟用" : "未啟用"}`, inline: true })
    .addFields({ name: `總時長:`, value: `${nowQueue.formattedDuration}`, inline: true })
    .addFields({ name: `當前時長: \`[0:00 / ${nowTrack.formattedDuration}]\``, value: `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``, inline: false })
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("pause")
        .setLabel(`暫停`)
        .setEmoji("⏯")
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel(`上一首`)
        .setEmoji("⬅")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel(`停止`)
        .setEmoji("✖")
        .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel(`跳過`)
        .setEmoji("➡")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("loop")
        .setLabel(`循環`)
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Success)
    );

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel(`洗牌`)
        .setEmoji(`🔀`)
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("voldown")
        .setLabel(`減少音量`)
        .setEmoji(`🔉`)
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("clear")
        .setLabel(`清空`)
        .setEmoji(`🗑`)
        .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("volup")
        .setLabel(`增加音加`)
        .setEmoji(`🔊`)
        .setStyle(ButtonStyle.Success)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("queue")
        .setLabel(`隊列`)
        .setEmoji(`📋`)
        .setStyle(ButtonStyle.Primary)
    );

  return {
    embeds: [embed],
    components: [row, row2]
  };
}

