module.exports = {
    name: 'example',
    description: 'Example cmd',
    usage: '<prefix>example [example]',
    examples: ['example'],
    aliases: ['eg'],
    dir: "_directoryName",
    cooldown: 1,
    permissions: [],
    
    run :async (client, message, args) => {   
        if(args[0] === 'ping') {
            message.reply(`Hello world !\n> Bot's latency : **${Math.round(client.ws.ping)}ms**`)
        } else {
            message.reply("Hello world !")
        }
    }
}