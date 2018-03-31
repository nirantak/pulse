import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Chats, Messages } from "../lib/collections";

Meteor.methods({
	newMessage(message) {
		if (!this.userId) {
			throw new Meteor.Error(
				"not-logged-in",
				"Must be logged in to send message."
			);
		}

		check(
			message,
			Match.OneOf(
				{ text: String, type: String, chatId: String },
				{ picture: String, type: String, chatId: String }
			)
		);
		message.timestamp = new Date();
		message.userId = this.userId;

		const messageId = Messages.insert(message);
		Chats.update(message.chatId, { $set: { lastMessage: message } });

		return messageId;
	},
	newBroadcast(message) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-logged-in", "Must be logged in to send message.");
		}

		const isMod = Meteor.users.findOne({ _id: Meteor.userId() }, { fields: { moderator: 1 } });
		if (isMod.moderator !== true) {
			throw new Meteor.Error("not-authorized", "Must be a moderator to broadcast.");
		}

		check(
			message,
			Match.OneOf(
				{ text: String, type: String, chatId: String, broadcast: Boolean },
				{ picture: String, type: String, chatId: String, broadcast: Boolean }
			)
		);
		message.timestamp = new Date();
		message.userId = Meteor.userId();
		const messageId = Messages.insert(message);
		Chats.update(message.chatId, { $set: { lastMessage: message } });

		return messageId;
	},
	updateName(name) {
		if (!this.userId) {
			throw new Meteor.Error(
				"not-logged-in",
				"Must be logged in to update name."
			);
		}

		check(name, String);

		if (name.length === 0) {
			throw Meteor.Error("name-required", "Must provide a user name");
		}

		return Meteor.users.update(this.userId, {
			$set: { "profile.name": name }
		});
	},
	updateStatus(status) {
		if (!this.userId) {
			throw new Meteor.Error(
				"not-logged-in",
				"Must be logged in to update status."
			);
		}

		check(status, String);

		if (status.length === 0) {
			throw Meteor.Error("status-required", "Must provide a status");
		}

		return Meteor.users.update(this.userId, {
			$set: { "profile.status": status }
		});
	},
	newChat(otherId) {
		if (!this.userId) {
			throw new Meteor.Error(
				"not-logged-in",
				"Must be logged in to create a chat."
			);
		}

		check(otherId, String);
		const otherUser = Meteor.users.findOne(otherId);

		if (!otherUser) {
			throw new Meteor.Error(
				"user-not-exists",
				"Chat's user does not exist"
			);
		}

		const chat = {
			userIds: [this.userId, otherId],
			createdAt: new Date()
		};

		const chatId = Chats.insert(chat);

		return chatId;
	},
	removeChat(chatId) {
		if (!this.userId) {
			throw new Meteor.Error(
				"not-logged-in",
				"Must be logged in to remove a chat."
			);
		}

		check(chatId, String);

		const chat = Chats.findOne(chatId);

		if (!chat || !_.include(chat.userIds, this.userId)) {
			throw new Meteor.Error("chat-not-exists", "Chat does not exist");
		}

		Messages.remove({ chatId: chatId });

		return Chats.remove({ _id: chatId });
	},
	updatePicture(data) {
		if (!this.userId) {
			throw new Meteor.Error(
				"not-logged-in",
				"Must be logged in to update picture."
			);
		}

		check(data, String);

		return Meteor.users.update(this.userId, {
			$set: { "profile.picture": data }
		});
	}
});
