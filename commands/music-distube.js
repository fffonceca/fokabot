const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Music player commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Join a voice channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Leave the voice channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('Play a song or resume')
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('YouTube URL or search query')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('Add a track to the queue')
                .addStringOption(option =>
                    option.setName('song')
                        .setDescription('YouTube URL or search query')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nowplaying')
                .setDescription('Show the current track'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop playing and clear queue'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Toggle pause'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('Skip to next track'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('previous')
                .setDescription('Go back to previous track'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('jump')
                .setDescription('Jump to a specific track')
                .addIntegerOption(option =>
                    option.setName('position')
                        .setDescription('Queue position (starting from 1)')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a track from the queue')
                .addIntegerOption(option =>
                    option.setName('position')
                        .setDescription('Queue position (starting from 1)')
                        .setRequired(true)
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('shuffle')
                .setDescription('Shuffle the queue'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('volume')
                .setDescription('Adjust playback volume')
                .addIntegerOption(option =>
                    option.setName('level')
                        .setDescription('Volume level (0-200)')
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(200)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('repeat')
                .setDescription('Manage repeating mode')
                .addStringOption(option =>
                    option.setName('mode')
                        .setDescription('Repeat mode')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Off', value: 'off' },
                            { name: 'Song', value: 'song' },
                            { name: 'Queue', value: 'queue' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('autoplay')
                .setDescription('Toggle autoplay')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const distube = interaction.client.distube;
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        // Commands that don't require voice channel
        if (subcommand === 'nowplaying') {
            const queue = distube.getQueue(interaction.guildId);
            
            if (!queue || !queue.songs.length) {
                return interaction.reply('❌ Nothing is playing right now.');
            }

            const song = queue.songs[0];
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎵 Now Playing')
                .setDescription(`**${song.name}**`)
                .addFields(
                    { name: 'Duration', value: song.formattedDuration, inline: true },
                    { name: 'Requested by', value: song.user.toString(), inline: true },
                    { name: 'Status', value: queue.paused ? '⏸️ Paused' : '▶️ Playing', inline: true }
                )
                .setThumbnail(song.thumbnail);

            if (queue.songs.length > 1) {
                embed.addFields({
                    name: 'Up Next',
                    value: queue.songs.slice(1, 4).map((s, i) => `${i + 1}. ${s.name}`).join('\n')
                });
            }

            return interaction.reply({ embeds: [embed] });
        }

        // All other commands require voice channel
        if (!voiceChannel) {
            return interaction.reply('❌ You need to be in a voice channel!');
        }

        switch (subcommand) {
            case 'join':
                try {
                    await distube.voices.join(voiceChannel);
                    return interaction.reply(`✅ Joined **${voiceChannel.name}**`);
                } catch (error) {
                    console.error('[JOIN] Error:', error);
                    return interaction.reply('❌ Failed to join voice channel.');
                }

            case 'leave':
                distube.voices.leave(interaction.guildId);
                return interaction.reply('👋 Left the voice channel.');

            case 'play':
                const playSong = interaction.options.getString('song');
                
                if (!playSong) {
                    // Resume if paused
                    const queue = distube.getQueue(interaction.guildId);
                    if (queue && queue.paused) {
                        distube.resume(interaction.guildId);
                        return interaction.reply('▶️ Resumed playback!');
                    }
                    return interaction.reply('❌ Please provide a song to play.');
                }

                await interaction.deferReply();
                
                try {
                    await distube.play(voiceChannel, playSong, {
                        member: member,
                        textChannel: interaction.channel
                    });
                    return interaction.editReply('✅ Playing your song!');
                } catch (error) {
                    console.error('[PLAY] Error:', error);
                    return interaction.editReply('❌ Could not play that song. Try another one.');
                }

            case 'queue':
                const queueSong = interaction.options.getString('song');
                await interaction.deferReply();
                
                try {
                    await distube.play(voiceChannel, queueSong, {
                        member: member,
                        textChannel: interaction.channel
                    });
                    return interaction.editReply('✅ Added to queue!');
                } catch (error) {
                    console.error('[QUEUE] Error:', error);
                    return interaction.editReply('❌ Could not add that song.');
                }

            case 'stop':
                distube.stop(interaction.guildId);
                return interaction.reply('⏹️ Stopped and cleared queue.');

            case 'pause':
                const queue = distube.getQueue(interaction.guildId);
                if (!queue) return interaction.reply('❌ Nothing is playing.');
                
                if (queue.paused) {
                    distube.resume(interaction.guildId);
                    return interaction.reply('▶️ Resumed.');
                } else {
                    distube.pause(interaction.guildId);
                    return interaction.reply('⏸️ Paused.');
                }

            case 'skip':
                try {
                    await distube.skip(interaction.guildId);
                    return interaction.reply('⏭️ Skipped to next track.');
                } catch {
                    return interaction.reply('❌ No next track available.');
                }

            case 'previous':
                try {
                    await distube.previous(interaction.guildId);
                    return interaction.reply('⏮️ Playing previous track.');
                } catch {
                    return interaction.reply('❌ No previous track available.');
                }

            case 'jump':
                const jumpPos = interaction.options.getInteger('position') - 1;
                try {
                    await distube.jump(interaction.guildId, jumpPos);
                    return interaction.reply(`⏭️ Jumped to track ${jumpPos + 1}.`);
                } catch {
                    return interaction.reply('❌ Invalid position.');
                }

            case 'remove':
                const removePos = interaction.options.getInteger('position') - 1;
                const removeQueue = distube.getQueue(interaction.guildId);
                if (!removeQueue) return interaction.reply('❌ No queue found.');
                
                if (removePos >= removeQueue.songs.length) {
                    return interaction.reply('❌ Invalid position.');
                }
                
                const removed = removeQueue.songs.splice(removePos, 1)[0];
                return interaction.reply(`🗑️ Removed **${removed.name}**`);

            case 'shuffle':
                await distube.shuffle(interaction.guildId);
                return interaction.reply('🔀 Queue shuffled!');

            case 'volume':
                const volume = interaction.options.getInteger('level');
                distube.setVolume(interaction.guildId, volume);
                return interaction.reply(`🔊 Volume set to ${volume}%`);

            case 'repeat':
                const mode = interaction.options.getString('mode');
                const repeatMode = mode === 'off' ? 0 : mode === 'song' ? 1 : 2;
                distube.setRepeatMode(interaction.guildId, repeatMode);
                const modeText = { 'off': 'Off', 'song': 'Song', 'queue': 'Queue' };
                return interaction.reply(`🔁 Repeat mode: **${modeText[mode]}**`);

            case 'autoplay':
                const autoplayQueue = distube.getQueue(interaction.guildId);
                if (!autoplayQueue) return interaction.reply('❌ No queue found.');
                
                const newAutoplay = distube.toggleAutoplay(interaction.guildId);
                return interaction.reply(`🎵 Autoplay: **${newAutoplay ? 'ON' : 'OFF'}**`);

            default:
                return interaction.reply('❌ Unknown command.');
        }
    },
};
