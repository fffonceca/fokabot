const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { DisTube } = require('distube');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
    ],
});

// Initialize DisTube
client.distube = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: true,
    savePreviousSongs: true,
    searchSongs: 5,
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        requestOptions: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        }
    }
});

// DisTube Events
client.distube
    .on('playSong', (queue, song) => {
        console.log(`[DISTUBE] Playing: ${song.name} - ${song.formattedDuration}`);
    })
    .on('addSong', (queue, song) => {
        console.log(`[DISTUBE] Added to queue: ${song.name}`);
    })
    .on('error', (channel, error) => {
        console.error('[DISTUBE] Error:', error);
    })
    .on('empty', queue => {
        console.log('[DISTUBE] Voice channel is empty, leaving...');
    })
    .on('finish', queue => {
        console.log('[DISTUBE] Queue finished');
    });

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[INFO] Loaded command: ${command.data.name}`);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute" property.`);
    }
}

// Event: Bot is ready
client.once('clientReady', () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Bot is online!`);
    console.log(`🤖 Logged in as: ${client.user.tag}`);
    console.log(`🎵 Music bot ready to play!`);
    console.log(`📊 Serving ${client.guilds.cache.size} server(s)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    client.user.setPresence({
        activities: [{ name: '🎵 /help for commands', type: 2 }],
        status: 'online'
    });
});

// Event: Interaction (slash command)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.log(`[WARNING] Unknown command attempted: ${interaction.commandName}`);
        return interaction.reply({ 
            content: '❌ Comando no encontrado. Usa `/help` para ver los comandos disponibles.', 
            ephemeral: true 
        });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`);
        console.error(error);
        
        const errorMessage = '❌ There was an error while executing this command!';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
