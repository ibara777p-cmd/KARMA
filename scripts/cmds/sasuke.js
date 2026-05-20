module.exports = {
  config: {
    name: "sasuke",
    version: "9.0",
    author: "octavio wina",
    countDown: 5,
    role: 2,
    shortDescription: "Pouvoir Uchiha",
    longDescription: "Ajout intelligent avec détection",
    category: "system",
    guide: "{pn}"
  },

  onLoad: function () {
    if (!global.sasukeMemory)
      global.sasukeMemory = {};
  },

  onStart: async function ({ api, event, message }) {

    try {

      const threads = await api.getThreadList(
        100,
        null,
        ["INBOX"]
      );

      const teams = threads.filter(
        t => t.isGroup
      );

      if (!teams.length) {
        return message.reply(
`╭─『 SASUKE SYSTEM 』─╮

❌ Aucune team détectée.

╰────────────────╯`
        );
      }

      // 🧠 mémoire
      global.sasukeMemory[event.senderID] =
        teams;

      const msg =
`╭─『 SASUKE SYSTEM 』─╮

👁️ Uchiha Interface Loaded

📊 Teams détectées :
${teams.length}

⚡ Fonction :
Ajout automatique intelligent

━━━━━━━━━━━━━━━━━━

💬 Répondre :
add

╰────────────────╯`;

      message.reply(msg, (err, info) => {

        global.GoatBot.onReply.set(
          info.messageID,
          {
            commandName: this.config.name,
            author: event.senderID,
            teams,
            msgID: info.messageID
          }
        );

      });

    } catch (e) {

      console.log(e);

      message.reply(
`╭─『 SASUKE ERROR 』─╮

💥 Impossible de charger
les données système.

╰────────────────╯`
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {

    try {

      if (event.senderID != Reply.author)
        return;

      if (
        event.body.toLowerCase() !== "add"
      ) return;

      const msgID = Reply.msgID;

      const teams =
        global.sasukeMemory[event.senderID]
        || Reply.teams;

      const delay =
        ms => new Promise(
          r => setTimeout(r, ms)
        );

      // ⚡ barre chakra
      const bar = (percent) => {

        const total = 10;

        const filled =
          Math.floor(percent / 10);

        return (
          "■".repeat(filled) +
          "□".repeat(total - filled)
        );
      };

      // 🎭 citations
      const quotes = [

        "Le pouvoir naît dans la haine.",

        "Le Sharingan voit tout.",

        "La volonté crée la puissance.",

        "Même le destin peut être modifié.",

        "Le chakra ne ment jamais."

      ];

      const randomQuote = () =>
        quotes[
          Math.floor(
            Math.random() * quotes.length
          )
        ];

      let success = 0;
      let fail = 0;
      let skip = 0;

      for (let i = 0; i < teams.length; i++) {

        const team = teams[i];

        const percent = Math.floor(
          ((i + 1) / teams.length) * 100
        );

        let status = "";
        let icon = "";

        try {

          // 🔍 vérifier présence
          const info =
            await api.getThreadInfo(
              team.threadID
            );

          const already =
            info.participantIDs.includes(
              event.senderID
            );

          if (already) {

            skip++;

            status = "Déjà présent";

            icon = "⚠️";

          } else {

            await api.addUserToGroup(
              event.senderID,
              team.threadID
            );

            success++;

            status = "Ajout effectué";

            icon = "✅";
          }

        } catch {

          fail++;

          status = "Erreur système";

          icon = "❌";
        }

        // ⚡ update message
        try {

          await api.editMessage(
`╭─『 SASUKE PROCESS 』─╮

❝ ${randomQuote()} ❞

${bar(percent)} ${percent}%

━━━━━━━━━━━━━━━━━━

${icon} ${team.name}

📌 Status :
${status}

📊 Progression :
${i + 1}/${teams.length}

╰────────────────╯`,
            msgID
          );

        } catch {}

        await delay(1000);
      }

      // 💀 final
      try {

        await api.editMessage(
`╭─『 SASUKE COMPLETE 』─╮

✅ Ajoutés :
${success}

⚠️ Déjà présents :
${skip}

❌ Échecs :
${fail}

━━━━━━━━━━━━━━━━━━

👁️ Synchronisation
des teams terminée.

╰────────────────╯`,
          msgID
        );

      } catch {}

    } catch (e) {

      console.log(e);

    }
  }
};
