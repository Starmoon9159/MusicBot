const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const delay = require('delay');

module.exports = {
    name: ["custom"],
    description: "Select your own效果",
    category: "Filter",
    options: [
        {
            name: 'args',
            description: 'Type a filter.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getString('args');
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) return interaction.editReply(`目前播放列表中沒有任何歌曲!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply("你必須跟我在同個語音頻道")

        if (args === "off" && queue.filters.size) queue.filters.clear();
        else if (Object.keys(client.distube.filters).includes(args)) {
            if (queue.filters.has(args)) queue.filters.remove(args)
            else queue.filters.add(args)
        } else if (args[0]) interaction.editReply(`Invalid filter!`)

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Currently Filter`, iconURL: `https://cdn.discordapp.com/emojis/741605543046807626.gif`})
            .setDescription(`\🎲 **Filter:** \`${queue.filters.names.join(", ") || "Normal"}\``)
            .setFooter({ text: `🔩 **Example:** \`/filter 3d\``})
            .setTimestamp()
            .setColor(client.color);

        await delay(3000)
        interaction.editReply({ content: ' ', embeds: [embed] })
    } 
}; // testing version