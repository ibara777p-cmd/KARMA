const axios = require("axios");

// ================= CADRE =================
function cadre(text) {
  return `╭── 🔎 GITHUB FORK SEARCH ──╮
${text}
╰────────────────────────────╯`;
}

// ================= RECHERCHE =================
async function searchFork(query) {
  try {
    const searchQuery = encodeURIComponent(`${query} fork:true`);
    const url = `https://api.github.com/search/repositories?q=${searchQuery}&sort=stars&order=desc&per_page=5`;

    const res = await axios.get(url, {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "GoatBot"
      },
      timeout: 15000
    });

    if (!res.data.items || res.data.items.length === 0)
      return null;

    return res.data.items[0]; // fork le plus populaire

  } catch (err) {
    if (err.response && err.response.status === 403)
      return "ratelimit";
    return "error";
  }
}

// ================= CMD =================
module.exports = {
  config: {
    name: "github",
    version: "5.0",
    author: "Octavio Wina + Upgrade",
    role: 0,
    category: "dev",
    shortDescription: {
      fr: "Recherche un fork populaire sur GitHub",
      en: "Search popular fork on GitHub"
    },
    guide: {
      fr: "{pn} <nom du projet>",
      en: "{pn} <project name>"
    }
  },

  onStart: async ({ message, args }) => {
    if (!args.length)
      return message.reply(cadre("❌ Indique le nom du projet à rechercher."));

    const query = args.join(" ");

    await message.reply(cadre(`⏳ octacode Recherche forks pour : ${query}...`));

    const fork = await searchFork(query);

    if (fork === "ratelimit")
      return message.reply(cadre("⚠️ Limite API GitHub atteinte. Réessaie plus tard."));

    if (fork === "error")
      return message.reply(cadre("❌ Erreur lors de la connexion à GitHub."));

    if (!fork)
      return message.reply(cadre("❌ Aucun fork trouvé sur GitHub."));

    const reply = `
📦 Nom : ${fork.full_name}
👤 Auteur : ${fork.owner.login}
⭐ Stars : ${fork.stargazers_count}
🍴 Forks : ${fork.forks_count}
🕒 Créé le : ${new Date(fork.created_at).toLocaleDateString()}

🌐 Lien GitHub :
${fork.html_url}

📥 Cloner :
git clone ${fork.clone_url}
`;

    return message.reply(cadre(reply));
  }
};
