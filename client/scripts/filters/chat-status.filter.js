import { _ } from "meteor/underscore";
import { Meteor } from "meteor/meteor";
import { Filter } from "angular-ecmascript/module-helpers";

export default class ChatStatusFilter extends Filter {
	filter(chat) {
		if (!chat) return;

		let otherId = _.without(chat.userIds, Meteor.userId())[0];
		let otherUser = Meteor.users.findOne(otherId);
		let hasStatus = otherUser && otherUser.profile && otherUser.profile.status;

		return hasStatus ? otherUser.profile.status : chat.status || "Hey there, I'm using Pulse!";
	}
}

ChatStatusFilter.$status = "chatStatus";
