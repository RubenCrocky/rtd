const discord = require("discord.js");
const fs = require("fs");
const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (client, message, args) => {

    // !warn spelerNaam redenen hier.

    if(!message.member.roles.cache.find(r =>r.name === "Support team" || r.name === "Co Creator" || r.name === "Game Creator" )) return message.channel.send("> Je hebt hiervoor geen rechten!");

    if (args[0] == null) {

    var embed = new discord.MessageEmbed()
        .setTitle("Gebruik")
        .setColor("#00ee00")
        .setDescription(`Warn een persoon door: \n !warn <user> <reden>`);

    return message.reply(embed);

}
    if (!args[0]) return message.reply("Geen gebruiker opgegeven.");

    if (!args[1]) return message.reply("Gelieve een redenen op te geven.");

    var warnUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    var reason = args.slice(1).join(" ");

    if (!warnUser) return message.reply("Kan de gebruiker niet vinden.");

    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    };

    warns[warnUser.id].warns++;

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
    });

    
    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`**Gewarnd:** ${warnUser} (${warnUser.id})
        **Warning door:** ${message.author}
        **Redenen: ** ${reason}`)
        .addField("Aantal warns", warns[warnUser.id].warns);

     var channel = message.member.guild.channels.cache.get("logs");

     if (!channel) return;

     client.channels.cache.find(c => c.name == "logs").send(embed);


}

module.exports.help = {
    name: "warn"
}