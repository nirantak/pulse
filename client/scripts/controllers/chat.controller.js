import Ionic from "ionic-scripts";
import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { MeteorCameraUI } from "meteor/okland:camera-ui";
import { Controller } from "angular-ecmascript/module-helpers";
import { Chats, Messages } from "../../../lib/collections";

export default class ChatCtrl extends Controller {
	constructor() {
		super(...arguments);

		this.chatId = this.$stateParams.chatId;
		this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
		this.isCordova = Meteor.isCordova;

		this.helpers({
			messages() {
				return Messages.find({ chatId: this.chatId });
			},
			data() {
				return Chats.findOne(this.chatId);
			},
			isMod() {
				const user_mod = Meteor.users.findOne({ _id: Meteor.userId() });
				return user_mod.profile.moderator;
			}
		});

		this.autoScroll();
	}

	sendPicture() {
		MeteorCameraUI.getPicture({}, (err, data) => {
			if (err) return this.handleError(err);

			this.callMethod("newMessage", {
				picture: data,
				type: "picture",
				chatId: this.chatId
			});
		});
	}

	sendMessage() {
		if (_.isEmpty(this.message)) return;

		this.callMethod("newMessage", {
			text: this.message,
			type: "text",
			chatId: this.chatId
		});

		delete this.message;
	}

	broadcastMessage() {
		bmessage = this.message;
		if (_.isEmpty(bmessage)) return;

		const users = Meteor.users.find();
		users.forEach(function(user) {
			if (Meteor.userId() != user._id) {
				let chat_id;
				let chat = Chats.findOne({
					userIds: {
						$all: [Meteor.userId(), user._id]
					}
				});

				if (chat) {
					chat_id = chat._id;
				} else {
					Meteor.call("newChat", user._id, (err, chatID) => {
						if (err) return this.handleError(err);
						chat_id = chatID;
					});
				}

				Meteor.call("newBroadcast", {
					text: bmessage,
					type: "text",
					chatId: chat_id,
					broadcast: true
				});
			}
		});

		delete this.message;
	}

	inputUp() {
		if (this.isIOS) {
			this.keyboardHeight = 216;
		}

		this.scrollBottom(true);
	}

	inputDown() {
		if (this.isIOS) {
			this.keyboardHeight = 0;
		}

		this.$ionicScrollDelegate.$getByHandle("chatScroll").resize();
	}

	closeKeyboard() {
		if (this.isCordova) {
			cordova.plugins.Keyboard.close();
		}
	}

	autoScroll() {
		let recentMessagesNum = this.messages.length;

		this.autorun(() => {
			const currMessagesNum = this.getCollectionReactively("messages")
				.length;
			const animate = recentMessagesNum != currMessagesNum;
			recentMessagesNum = currMessagesNum;
			this.scrollBottom(animate);
		});
	}

	scrollBottom(animate) {
		this.$timeout(() => {
			this.$ionicScrollDelegate
				.$getByHandle("chatScroll")
				.scrollBottom(animate);
		}, 300);
	}

	handleError(err) {
		if (err.error == "cancel") return;
		this.$log.error("Profile save error ", err);

		this.$ionicPopup.alert({
			title: err.reason || "Save failed",
			template: "Please try again",
			okType: "button-positive button-clear"
		});
	}
}

ChatCtrl.$name = "ChatCtrl";
ChatCtrl.$inject = [
	"$stateParams",
	"$timeout",
	"$ionicScrollDelegate",
	"$ionicPopup",
	"$log"
];
