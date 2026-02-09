const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),
    
    async execute(interaction) {
        const embed1 = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎵 Music Bot Commands - Page 1/2')
            .setDescription('Here are all available music commands:')
            .addFields(
                { name: '1️⃣ /music join', value: 'Join a voice channel', inline: false },
                { name: '2️⃣ /music leave', value: 'Leave channels', inline: false },
                { name: '3️⃣ /music nowplaying', value: 'Show the current track', inline: false },
                { name: '4️⃣ /music queue <song>', value: 'Add tracks to the queue', inline: false },
                { name: '5️⃣ /music remove <position>', value: 'Remove tracks from the queue', inline: false },
                { name: '6️⃣ /music removerange <start> <end>', value: 'Remove tracks between two positions', inline: false },
                { name: '7️⃣ /music purge', value: 'Remove all songs from the queue', inline: false },
                { name: '8️⃣ /music shuffle', value: 'Shuffle the queue', inline: false },
                { name: '9️⃣ /music play', value: 'Play the queue', inline: false },
                { name: '🔟 /music stop', value: 'Stop playing', inline: false }
            )
            .setFooter({ text: 'Use the buttons below to navigate' });

        const embed2 = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎵 Music Bot Commands - Page 2/2')
            .setDescription('Here are all available music commands:')
            .addFields(
                { name: '1️⃣1️⃣ /music pause', value: 'Toggle pause', inline: false },
                { name: '1️⃣2️⃣ /music skip', value: 'Skip to next track', inline: false },
                { name: '1️⃣3️⃣ /music back', value: 'Backskip to previous track', inline: false },
                { name: '1️⃣4️⃣ /music jump <position>', value: 'Skip to a specific song', inline: false },
                { name: '1️⃣5️⃣ /music volume <level>', value: 'Adjust playback volume (0-200)', inline: false },
                { name: '1️⃣6️⃣ /music repeat <mode>', value: 'Manage repeating mode (off/one/all)', inline: false },
                { name: '1️⃣7️⃣ /music reset', value: 'Reset music player, use this if strange things happen', inline: false }
            )
            .addFields(
                { name: '\u200B', value: '**Other Commands**', inline: false },
                { name: '❓ /help', value: 'Show this help message', inline: false }
            )
            .setFooter({ text: 'Created with ❤️ for your server' });

        await interaction.reply({ embeds: [embed1] });
        
        // Send second page as follow-up
        setTimeout(() => {
            interaction.followUp({ embeds: [embed2] });
        }, 500);
    },
};
