# 🎵 Discord Music Bot

Un bot de música completo para Discord con control total de reproducción y cola.

## 📋 Características

- ✅ Reproducción de música desde YouTube
- ✅ Sistema de cola completo
- ✅ 20 comandos de música
- ✅ Controles de reproducción (play, pause, skip, back, jump)
- ✅ Gestión de cola (agregar, remover, shuffle, purge)
- ✅ Control de volumen (0-200%)
- ✅ Modos de repetición (off, one, all)
- ✅ Información de pista actual

## 🎮 Comandos Disponibles

### Página 1/2
1. `/music join` - Unirse a un canal de voz
2. `/music leave` - Salir del canal de voz
3. `/music nowplaying` - Mostrar la pista actual
4. `/music queue <canción>` - Agregar pistas a la cola
5. `/music remove <posición>` - Remover pistas de la cola
6. `/music removerange <inicio> <fin>` - Remover pistas entre dos posiciones
7. `/music purge` - Remover todas las canciones de la cola
8. `/music shuffle` - Mezclar la cola
9. `/music play` - Reproducir la cola
10. `/music stop` - Detener la reproducción

### Página 2/2
11. `/music pause` - Pausar/reanudar
12. `/music skip` - Saltar a la siguiente pista
13. `/music back` - Volver a la pista anterior
14. `/music jump <posición>` - Saltar a una canción específica
15. `/music volume <nivel>` - Ajustar el volumen (0-200)
16. `/music repeat <modo>` - Gestionar modo de repetición (off/one/all)
17. `/music reset` - Resetear el reproductor

### Otros
- `/help` - Mostrar todos los comandos

## 🚀 Instalación Local

### Requisitos Previos
- Node.js 16.9.0 o superior
- npm o yarn
- Una cuenta de Discord
- FFmpeg instalado en tu sistema

### Paso 1: Crear la Aplicación de Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en "New Application"
3. Dale un nombre a tu bot
4. Ve a la sección "Bot"
5. Haz clic en "Add Bot"
6. Copia el **Token** (lo necesitarás después)
7. Activa estos "Privileged Gateway Intents":
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT

### Paso 2: Obtener el Client ID

1. En la misma aplicación, ve a "General Information"
2. Copia el **Application ID** (este es tu CLIENT_ID)

### Paso 3: Invitar el Bot a tu Servidor

1. Ve a la sección "OAuth2" → "URL Generator"
2. Selecciona los scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Selecciona los permisos del bot:
   - ✅ Send Messages
   - ✅ Connect
   - ✅ Speak
   - ✅ Use Voice Activity
4. Copia la URL generada y ábrela en tu navegador
5. Selecciona tu servidor e invita al bot

### Paso 4: Configurar el Proyecto

```bash
# Clonar o descargar los archivos del proyecto
# Navegar a la carpeta del proyecto
cd discord-music-bot

# Instalar dependencias
npm install

# Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env
```

### Paso 5: Configurar Variables de Entorno

Edita el archivo `.env` con tus datos:

```env
DISCORD_TOKEN=tu_token_del_bot_aquí
CLIENT_ID=tu_client_id_aquí
GUILD_ID=tu_guild_id_aquí  # Opcional: ID de tu servidor para comandos más rápidos
```

**Para obtener el GUILD_ID:**
1. En Discord, activa el "Modo Desarrollador" (Configuración → Avanzado → Modo Desarrollador)
2. Haz clic derecho en tu servidor
3. Clic en "Copiar ID"

### Paso 6: Desplegar los Comandos

```bash
node deploy-commands.js
```

### Paso 7: Iniciar el Bot

```bash
npm start
```

¡Tu bot debería estar en línea! 🎉

## ☁️ Despliegue en Hosting Gratuito

### Opción 1: Railway.app (Recomendado)

Railway ofrece hosting gratuito con $5 de crédito mensual.

1. **Crear cuenta en Railway:**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Crear nuevo proyecto:**
   - Clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Configurar variables de entorno:**
   - En tu proyecto, ve a "Variables"
   - Agrega:
     - `DISCORD_TOKEN`
     - `CLIENT_ID`
     - `GUILD_ID` (opcional)

4. **Desplegar:**
   - Railway automáticamente detectará tu proyecto Node.js
   - El bot se desplegará automáticamente

5. **Mantener el bot activo:**
   - Railway mantiene el bot ejecutándose 24/7
   - Puedes ver los logs en tiempo real

### Opción 2: Render.com

Render ofrece hosting gratuito con algunas limitaciones.

1. **Crear cuenta:**
   - Ve a [render.com](https://render.com)
   - Regístrate

2. **Crear Web Service:**
   - Clic en "New +"
   - Selecciona "Web Service"
   - Conecta tu repositorio de GitHub

3. **Configuración:**
   - Name: `discord-music-bot`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Variables de entorno:**
   - Agrega las variables de entorno necesarias

5. **Desplegar:**
   - Clic en "Create Web Service"

**Nota:** En el plan gratuito de Render, el servicio se duerme después de 15 minutos de inactividad.

### Opción 3: Replit

1. **Crear cuenta:**
   - Ve a [replit.com](https://replit.com)

2. **Crear nuevo Repl:**
   - Clic en "+ Create"
   - Selecciona "Import from GitHub"
   - O sube tus archivos manualmente

3. **Configurar Secrets:**
   - En el panel izquierdo, ve a "Secrets" (ícono de candado)
   - Agrega tus variables de entorno

4. **Mantener activo:**
   - Usa un servicio como [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos
   - O usa Replit Hacker plan para always-on

### Opción 4: Heroku (Ya no gratuito)

Heroku eliminó su plan gratuito, pero si tienes créditos:

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create tu-bot-nombre

# Configurar variables
heroku config:set DISCORD_TOKEN=tu_token
heroku config:set CLIENT_ID=tu_client_id

# Desplegar
git push heroku main
```

## 📁 Estructura del Proyecto

```
discord-music-bot/
├── commands/
│   ├── music.js       # Comandos de música
│   └── help.js        # Comando de ayuda
├── MusicPlayer.js     # Clase del reproductor
├── index.js           # Archivo principal
├── deploy-commands.js # Script para registrar comandos
├── package.json       # Dependencias
├── .env.example       # Ejemplo de variables de entorno
└── README.md          # Este archivo
```

## 🔧 Solución de Problemas

### El bot no responde a comandos
- Verifica que hayas ejecutado `deploy-commands.js`
- Asegúrate de que el bot tenga los permisos correctos en tu servidor
- Revisa los logs para errores

### Error de conexión de voz
- Verifica que FFmpeg esté instalado
- Asegúrate de que el bot tenga permisos de "Connect" y "Speak"

### El bot se desconecta solo
- Esto puede ser normal en planes gratuitos de hosting
- Considera usar Railway o un servicio de always-on

## 📝 Notas Importantes

- **FFmpeg:** Algunos servicios de hosting pueden requerir configuración adicional para FFmpeg
- **Límites de hosting gratuito:** Los planes gratuitos pueden tener limitaciones de tiempo de actividad
- **Actualizaciones de Discord.js:** Mantén las dependencias actualizadas

## 🆘 Soporte

Si encuentras problemas:
1. Verifica los logs del bot
2. Asegúrate de que todas las variables de entorno estén configuradas
3. Revisa que el bot tenga los permisos necesarios en Discord

## 📜 Licencia

MIT License - Siéntete libre de usar y modificar este bot.

## 🎉 ¡Disfruta tu bot de música!

Creado con ❤️ para la comunidad de Discord.
