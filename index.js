require('dotenv').config()

const Discord = require('discord.js')
const debug = require('debug')('rolebot')

const roles = require('./conf')

const client = new Discord.Client({})

client.on('raw', ev => {
  if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(ev.t)) {
    const guild = roles.find(e => e.id === ev.d.guild_id)
    if (!guild) return;

    const role = guild.messages.find(e => e.message === ev.d.message_id)
    if (!role) return

    if (ev.t === 'MESSAGE_REACTION_ADD') {
      client.guilds.get(guild.id)
            .members.get(ev.d.user_id)
            .addRole(role.role)
            .catch(debug)
    }
    else if (ev.t === 'MESSAGE_REACTION_REMOVE') {
      client.guilds.get(guild.id)
            .members.get(ev.d.user_id)
            .removeRole(role.role)
            .catch(debug)
    }
  }
})

client.on('ready', ev => {
  client.guilds.forEach(guild => {
    debug('guild:', guild.id)
    guild.roles.forEach(role => {
      debug('role:', role.id, '->', role.name)
    })
  })
})

;(async () => {
  await client.login(process.env.DISCORD_TOKEN)
})()
