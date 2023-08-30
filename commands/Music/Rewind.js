const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: ["rewind"],
    description: "倒退歌曲時間戳記",
    category: "Music",
    options: [
        {
            name: "seconds",
            description: "倒退的秒數",
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
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道");

        if (!value) {
            if ((queue.currentTime - 10) > 0) {
                await queue.seek(queue.currentTime - 10);
                
                const embed = new EmbedBuilder()
                    .setDescription(`\`⏮\` | *倒退至:* \`${queue.formattedCurrentTime}\``)
                    .setColor(client.color);

                interaction.editReply({ embeds: [embed] });
            } else {
                interaction.editReply("不能倒退超過歌曲的長度.");
            }
        } else if ((queue.currentTime - value) > 0) {
            await queue.seek(queue.currentTime - value);
            
            const embed = new EmbedBuilder()
                .setDescription(`\`⏮\` | *倒退至:* \`${queue.formattedCurrentTime}\``)
                .setColor(client.color);

            interaction.editReply({ embeds: [embed] });
        } else { 
            interaction.editReply("不能倒退超過歌曲的長度.");
        }
    }
}
