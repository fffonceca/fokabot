const { REST, Routes } = require('discord.js');

// Load environment variables
require('dotenv').config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

async function deleteCommands() {
    try {
        console.log('🗑️  Iniciando eliminación de comandos...');

        if (process.env.GUILD_ID) {
            // Eliminar comandos del servidor específico (más rápido)
            console.log(`📍 Eliminando comandos del servidor (Guild ID: ${process.env.GUILD_ID})...`);
            
            // Obtener todos los comandos del servidor
            const guildCommands = await rest.get(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
            );
            
            console.log(`📋 Encontrados ${guildCommands.length} comandos en el servidor.`);
            
            // Eliminar cada comando
            for (const command of guildCommands) {
                await rest.delete(
                    Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, command.id)
                );
                console.log(`   ✅ Eliminado: /${command.name}`);
            }
            
            console.log('✨ Comandos del servidor eliminados exitosamente!');
        }
        
        // Eliminar comandos globales
        console.log('🌍 Eliminando comandos globales...');
        
        const globalCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );
        
        console.log(`📋 Encontrados ${globalCommands.length} comandos globales.`);
        
        for (const command of globalCommands) {
            await rest.delete(
                Routes.applicationCommand(process.env.CLIENT_ID, command.id)
            );
            console.log(`   ✅ Eliminado: /${command.name}`);
        }
        
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ ¡Todos los comandos han sido eliminados!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('💡 Ahora puedes registrar los comandos nuevos con:');
        console.log('   node deploy-commands.js');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error al eliminar comandos:', error);
    }
}

deleteCommands();
