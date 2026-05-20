 module.exports = {
	config: {
		name: "addmoney",
		aliases: ["givemoney"],
		version: "4.0",
		author: "Octavio Wina",
		countDown: 5,
		role: 2,
		shortDescription: {
			en: "Add money",
			fr: "Ajouter de l'argent"
		},
		longDescription: {
			en: "Add money to a user",
			fr: "Ajouter de l'argent à un utilisateur"
		},
		category: "admin",
		guide: {
			en: "{pn} @user amount OR reply + {pn} amount",
			fr:
				"{pn} @utilisateur montant\n" +
				"ou répondre au message :\n" +
				"{pn} montant"
		}
	},

	langs: {
		fr: {
			noTarget: "❌ | Mentionne ou réponds à un utilisateur.",
			invalidAmount: "❌ | Montant invalide.",
			success:
				"✅ | %1$ ajoutés à %2\n💰 Nouveau solde: %3$",
			error: "❌ | Une erreur est survenue."
		},

		en: {
			noTarget: "❌ | Mention or reply to a user.",
			invalidAmount: "❌ | Invalid amount.",
			success:
				"✅ | %1$ added to %2\n💰 New balance: %3$",
			error: "❌ | An error occurred."
		}
	},

	onStart: async function ({
		message,
		event,
		usersData,
		args,
		getLang
	}) {
		try {

			let uid;

			// Si mention
			if (Object.keys(event.mentions).length > 0) {
				uid = Object.keys(event.mentions)[0];
			}

			// Si reply
			else if (event.messageReply) {
				uid = event.messageReply.senderID;
			}

			// Aucun utilisateur
			else {
				return message.reply(getLang("noTarget"));
			}

			// Montant
			const amount = parseInt(args[args.length - 1]);

			if (isNaN(amount) || amount <= 0) {
				return message.reply(getLang("invalidAmount"));
			}

			// Données utilisateur
			const userData = await usersData.get(uid);

			// Nom utilisateur
			const name = userData.name || "Utilisateur";

			// Argent actuel
			const currentMoney = userData.money || 0;

			// Nouveau montant
			const newMoney = currentMoney + amount;

			// Sauvegarde
			await usersData.set(uid, {
				money: newMoney
			});

			// Message succès
			return message.reply(
				getLang(
					"success",
					amount.toLocaleString(),
					name,
					newMoney.toLocaleString()
				)
			);

		} catch (e) {

			console.error(e);

			return message.reply(
				getLang("error")
			);
		}
	}
};
