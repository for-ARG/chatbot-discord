const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


const allowedChannelId = "1409818460099448832";



const motsCles = ["rituel", "animalOuPoule", "symboleOuEmoji", "montjuzet"];



let motsTrouves = new Set();

client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);

    const channel = client.channels.cache.get(allowedChannelId);
    if (!channel) return console.error("Salon introuvable !");
    channel.send("Avez-vous compris quelque chose ? Si oui, merci de me dire : ce que fait le groupe le vendredi midi. Qu'est-ce qu'ils utilisent ? Que doivent-ils graver ? Où se retrouvent-ils ? Merci de répondre en plusieurs messages.")
        .then(() => console.log("Message de démarrage envoyé !"))
        .catch(console.error);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.channel.id !== allowedChannelId) return;

    const contenu = message.content; // on garde la casse pour les symboles
    const contenuLower = contenu.toLowerCase(); // pour les mots normaux

    const reponses = {
        "rituel": "Bien vu, le groupe fait un rituel tous les vendredis midis.",
        "animal": "Oui, un animal est utilisé dans le rituel. Lequel est utilisé pour ce vendredi ?",
        "poulet": "🐔 Exact ! L’animal du rituel de ce vendredi est trouvé. Tu progresses.",
        "symbole": "※ Correct. Tu avances dans la compréhension du rituel.",
        "※": "Oui, le symbole à graver est ※.",
        "montjuzet": "Oui, le lieu de rendez-vous est le parc Montjuzet."
    };

    let motValide = false;


    if ((contenuLower.includes("animal") || contenuLower.includes("poulet")) && !motsTrouves.has("animalOuPoule")) {
        message.reply(contenuLower.includes("poulet") ? reponses["poulet"] : reponses["animal"]);
        motsTrouves.add("animalOuPoule");
        motValide = true;
    } 

    else if ((contenuLower.includes("symbole") || contenu.includes("※")) && !motsTrouves.has("symboleOuEmoji")) {
        message.reply(contenu.includes("※") ? reponses["※"] : reponses["symbole"]);
        motsTrouves.add("symboleOuEmoji");
        motValide = true;
    } 
    else {
        
        for (let mot in reponses) {
            if (!["animal", "poulet", "symbole", "※"].includes(mot) && contenuLower.includes(mot.toLowerCase()) && !motsTrouves.has(mot)) {
                message.reply(reponses[mot]);
                motsTrouves.add(mot);
                motValide = true;
                break;
            }
        }
    }

    if (!motValide) {
        message.reply("Merci pour votre réponse mais ça ne doit pas être précisément cela. Continuez à chercher des indices !");
    }

    if (motsTrouves.size === motsCles.length) {
        message.channel.send("🎉 Félicitations ! Vous avez trouvé tous les mots-clés et avez résolu cette enquête ! Maintenant à vous de faire ce qui vous semble être bon pour déjouer cette secte.");
        motsTrouves.clear(); 
    }
});


client.login('token_discord'); 
