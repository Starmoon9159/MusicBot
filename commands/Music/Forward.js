const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["forward"],
    description: "快轉歌曲中的時間戳",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "要快轉的秒數",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const value = interaction.options.getInteger("seconds");
            
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply("目前播放列表中沒有任何歌曲!");
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道.");

        const song = queue.songs[0];

        if (!value) {
            if ((queue.currentTime + 10) < song.duration) {

                await queue.seek(queue.currentTime + 10);
                
                const embed = new EmbedBuilder()
                    .setDescription(`⏭️ | *快轉至：* \`${queue.formattedCurrentTime}\``)
                    .setColor(client.color);

                interaction.editReply({ embeds: [embed] });

            } else {
                interaction.editReply("無法快轉超過歌曲的播放時間.");
            }
        } else if ((queue.currentTime + value) < song.duration) {

            await queue.seek(queue.currentTime + value);
            
            const embed = new EmbedBuilder()
                .setDescription(`⏭️ | *快轉至：* \`${queue.formattedCurrentTime}\``)
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });

        } else { 
            interaction.editReply("無法快轉超過歌曲的播放時間.");
        }
    }
};
