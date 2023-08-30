const lyricsfinder = require('lyrics-finder');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["lyric"],
    description: "顯示歌曲的歌詞",
    category: "Music",
    options: [
        {
            name: "song",
            description: "您想查找歌詞的歌曲",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        let song = interaction.options.getString("song");

        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道.");

        let csong = queue.songs[0];
        if (!song && csong) song = csong.name;

        let lyrics = null;

        try {
            lyrics = await lyricsfinder(song, "");
            if (!lyrics) return interaction.editReply("找不到該歌曲的歌詞!");
        } catch (err) {
            console.log(err);
            interaction.editReply("找不到該歌曲的歌詞!");
        }
        let lyricsEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`歌詞`)
            .setDescription(`**${song}**\n${lyrics}`)
            .setFooter({ text: `由 ${interaction.author.username} 要求`})
            .setTimestamp();

        if (lyrics.length > 2048) {
            lyricsEmbed.setDescription("歌詞太長無法顯示!");
        }

        interaction.editReply({ embeds: [lyricsEmbed] }).then(n => {
            var total = queue.songs[0].duration * 1000;
            var current = queue.currentTime * 1000;
            let time = total - current;
            setTimeout(() => { 
                n.delete(); 
            }, time);
        });
    }
};
