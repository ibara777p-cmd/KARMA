 module.exports = {
	config: {
		name: "topmoney",
		aliases: ["rich", "toprich"],
		version: "1.0",
		author: "Octavio Wina",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Top richest users",
			fr: "Top des plus riches"
		},
		longDescription: {
			en: "Show the 10 richest users",
			fr: "Affiche les 10 utilisateurs les plus riches"
		},
		category: "economy",
		guide: {
			en: "{pn}",
			fr: "{pn}"
		}
	},

	langs: {
		fr: {
			title: "🏆 ━━━ TOP 10 RICHES ━━━ 🏆",
			noData: "❌ | Aucune donnée trouvée."
		},

		en: {
			title: "🏆 ━━━ TOP 10 RICHEST ━━━ 🏆",
			noData: "❌ | No data found."
		}
	},

	onStart: async function ({
		message,
		usersData,
		getLang
	}) {
		try {

			// Récupère tous les utilisateurs
			const allUsers = await usersData.getAll();

			if (!allUsers || allUsers.length === 0) {
				return message.reply(getLang("noData"));
			}

			// Trie par argent
			const sortedUsers = allUsers
				.sort((a, b) => (b.money || 0) - (a.money || 0))
				.slice(0, 10);

			// Message
			let msg = `${getLang("title")}\n\n`;

			for (let i = 0; i < sortedUsers.length; i++) {

				const user = sortedUsers[i];

				const name = user.name || "Utilisateur";
				const money = (user.money || 0).toLocaleString();

				msg += `${i + 1}. 👑 ${name}\n`;
				msg += `💰 Argent: ${money}$\n\n`;
			}

			return message.reply(msg);

		} catch (err) {

			console.error(err);

			return message.reply("❌ Error");
		}
	}
};
