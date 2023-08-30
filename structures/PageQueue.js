const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const QueuePage = async (client, message, pages, timeout, queueLength, queueDuration) => {
    if (!message || !message.channel) throw new Error('無法訪問頻道.');
    if (!pages) throw new Error('未提供分頁內容.');

    // 創建左右翻頁按鈕
    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle(ButtonStyle.Secondary)
    const row2 = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle(ButtonStyle.Secondary)
    
    // 將按鈕添加到 ActionRow 中
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;

    // 編輯訊息回覆，顯示當前分頁和按鈕
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: `分頁 • ${page + 1}/${pages.length} | ${queueLength} • 首歌 | ${queueDuration} • 總時長`})], components: [row], allowedMentions: { repliedUser: false } });
    
    // 如果播放列表為空，則直接返回
    if (pages.length == 0) return;

    // 創建訊息組件收集器，監聽按鈕交互事件
    const filter = (m) => m.user.id === message.author.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
        // 確保交互回覆為暫擱的
        if (!interaction.deferred) await interaction.deferUpdate();

        // 根據按鈕交互改變當前分頁
        if (interaction.customId === 'back') {
            page = page > 0 ? --page : pages.length - 1;
        } else if (interaction.customId === 'next') {
            page = page + 1 < pages.length ? ++page : 0;
        }

        // 編輯訊息回覆，顯示新的當前分頁和按鈕
        curPage.edit({ embeds: [pages[page].setFooter({ text: `分頁 • ${page + 1}/${pages.length} | ${queueLength} • 首歌 | ${queueDuration} • 總時長`})], components: [row] });
    });

    // 監聽收集器結束事件，禁用按鈕
    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))

        // 編輯訊息回覆，將按鈕設置為禁用狀態
        curPage.edit({ embeds: [pages[page].setFooter({ text: `分頁 • ${page + 1}/${pages.length} | ${queueLength} • 首歌 | ${queueDuration} • 總時長`})], components: [disabled] });
    });

    return curPage;
};

// 將 QueuePage 函數導出，以便在其他文件中使用
module.exports = { QueuePage };
