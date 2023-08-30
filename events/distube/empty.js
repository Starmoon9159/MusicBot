const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue) => {
    await client.UpdateMusic(queue);

    const embed = new EmbedBuilder()
        .setColor('#000001')
        .setDescription(`**頻道為空!**`)

    queue.textChannel.send({ embeds: [embed] })
}