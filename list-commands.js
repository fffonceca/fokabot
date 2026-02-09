const { REST, Routes } = require('discord.js');

// Load environment variables
require('dotenv').config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

async function listCommands() {
    try {
        console.log('📋 Listando comandos registrados...\n');

        if (process.env.GUILD_ID) {
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`🏠 COMANDOS DEL SERVIDOR`);
            console.log(`   Guild ID: ${process.env.GUILD_ID}`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            
            const guildCommands = await rest.get(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
            );
            
            if (guildCommands.length === 0) {
                console.log('   (Sin comandos registrados)');
            } else {
                guildCommands.forEach((cmd, index) => {
                    console.log(`   ${index + 1}. /${cmd.name} - ${cmd.description}`);
                    if (cmd.options && cmd.options.length > 0) {
                        cmd.options.forEach(opt => {
                            console.log(`      ├─ ${opt.name} (${opt.type === 1 ? 'subcommand' : 'option'})`);
                        });
                    }
                });
                console.log(`\n   Total: ${guildCommands.length} comandos`);
            }
            console.log('');
        }
        
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🌍 COMANDOS GLOBALES`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        
        const globalCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );
        
        if (globalCommands.length === 0) {
            console.log('   (Sin comandos globales registrados)');
        } else {
            globalCommands.forEach((cmd, index) => {
                console.log(`   ${index + 1}. /${cmd.name} - ${cmd.description}`);
                if (cmd.options && cmd.options.length > 0) {
                    cmd.options.forEach(opt => {
                        console.log(`      ├─ ${opt.name} (${opt.type === 1 ? 'subcommand' : 'option'})`);
                    });
                }
            });
            console.log(`\n   Total: ${globalCommands.length} comandos`);
        }
        
        console.log('');
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        
    } catch (error) {
        console.error('❌ Error al listar comandos:', error);
    }
}

listCommands();
