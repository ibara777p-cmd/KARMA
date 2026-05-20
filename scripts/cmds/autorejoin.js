module.exports = {
  config: {
    name: "autorejoin",
    version: "3.0",
    author: "OCTA",
    category: "events"
  },

  // ✅ obligatoire
  onStart: async function () {},

  onEvent: async function ({ api, event }) {
    try {

      // 🔍 détecter quitter
      if (event.logMessageType !== "log:unsubscribe")
        return;

      const leftUser = event.logMessageData.leftParticipantFbId;

      // ❌ éviter le bot
      if (leftUser == api.getCurrentUserID())
        return;

      // 👤 infos utilisateur
      const userInfo = await api.getUserInfo(leftUser);
      const userName = userInfo[leftUser]?.name || "Unknown";

      // 📌 infos team
      const threadInfo = await api.getThreadInfo(event.threadID);
      const threadName = threadInfo.threadName || "Unknown Team";

      // ⚡ PHASE 1
      const sent = await api.sendMessage(
`╭──────────────╮
 SYSTEM : UCHIHA-X
╰──────────────╯

> analyse des événements...
> utilisateur détecté...
> connexion interrompue...

👁️ USER : ${userName}

⚠️ une tentative de sortie a été détectée dans le système.

📡 synchronisation du chakra numérique...

⌛ lancement du protocole anti-exit...
`,
        event.threadID
      );

      // ⏱️ délai
      await new Promise(r => setTimeout(r, 2500));

      // ⚡ PHASE 2
      try {
        await api.editMessage(
`╭──────────────╮
 SHARINGAN v2.0
╰──────────────╯

✔ scan terminé...
✔ récupération des données...
✔ accès à la team autorisé...

📌 TEAM : ${threadName}

💀 impossible de quitter cette dimension.

⚡ réécriture du destin numérique...

🔄 préparation de la réinvocation...
`,
          sent.messageID
        );
      } catch {}

      await new Promise(r => setTimeout(r, 2500));

      // 🚀 ajout réel
      await api.addUserToGroup(leftUser, event.threadID);

      // ⚡ FINAL
      try {
        await api.editMessage(
`╭──────────────╮
 RINNEGAN CORE
╰──────────────╯

✅ utilisateur restauré avec succès.

👤 USER : ${userName}
📌 TEAM : ${threadName}

━━━━━━━━━━━━━━━━━━

> connexion rétablie
> chakra stabilisé
> accès restauré
> système sécurisé

👁️ "dans ce monde...
même la fuite obéit au code."

💻 powered by OCTA SYSTEM
`,
          sent.messageID
        );
      } catch {}

    } catch (e) {
      console.log(e);
    }
  }
};
