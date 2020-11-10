const discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("sorry jij kan dit niet");

    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Geen perms");

    if (!args[0]) return message.reply(" Geen gebruiker opgegeven. *[Je kan iemand kicken door `!kick <user> <reden>`]*");

    if (!args[1]) return message.reply(" Gelieve een redenen op te geven. *[Je kan iemand kicken door `!kick <user> <reden>`]* ");

    var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

    var reason = args.slice(2).join(" ");

    if (!kickUser) return message.reply("Kan de gebruiker niet vinden.");

    var embed = new discord.MessageEmbed()
         .setColor("#ff0000")
         .setThumbnail(kickUser.user.displayAvatarURL)
         .setFooter(message.member.displayName, message.author.displayAvatarURL)
         .setTimestamp()
         .setDescription(`** Gekickt:** ${kickUser} ${kickUser.id}`)
         .setDescription(`**Gekickt door:** ${message.author}`)
        .setDescription(`**Redenen: ** ${reason}`);

     var embedPrompt = new discord.MessageEmbed()
         .setColor("GREEN")
         .setAuthor("Gelieve te reageren binnen 30 sec.")
         .setDescription(`Wil je ${kickUser} kicken?`);


    message.channel.send(embedPrompt).then(async msg => {

        var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);


        // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
         message.channel.awaitMessages(m => m.author.id == message.author.id,
         { max: 1, time: 30000 }).then(collected => {

         if (collected.first().content.toLowerCase() == 'yes') {
         message.reply('Kick speler.');
         }
         else
         message.reply('Geanuleerd');

         }).catch(() => {
         message.reply('Geen antwoord na 30 sec, geanuleerd.');
         });


         if (emoji === "✅") {
             msg.delete();

             kickUser.kick(reason).catch(err => {
                 if (err) return message.channel.send(`Er is iets foutgegaan.`);
             });

             message.reply("De gebruiker is succesvol gekickd! Laat de rust terugkeren!");

            } else if (emoji === "❌") {

             msg.delete();

             message.reply("Kick geanuleerd").then(m => m.delete(5000));

         }

        var logChannel = message.member.guild.channels.cache.find(channel => channel.name === "logs");

         if(emoji === "✅") {

             var embed = new discord.MessageEmbed()
             .setColor("#ff0000")
             .setThumbnail(kickUser.user.displayAvatarURL)
             .setFooter(message.member.displayName, message.author.displayAvatarURL)
             .setTimestamp()
             .setDescription(`** Gekickt:** ${kickUser} (${kickUser.id}`)
             .setDescription(`**Gekickt door:** ${message.author}`)
             .setDescription(`**Redenen:** ${reason}`);


            logChannel.send(embed);
         }

    
          });

    }

module.exports.help = {
    name: "kick"
}
