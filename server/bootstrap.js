import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

Meteor.startup(function() {
	if (Meteor.users.find().count() != 0) return;

	Accounts.createUserWithPhone({
		phone: "+919876543210",
		profile: {
			name: "Pulse Support",
			status: "Contact for support."
		}
	});

});
