import { _ } from "meteor/underscore";
import { MeteorCameraUI } from "meteor/okland:camera-ui";
import { Controller } from "angular-ecmascript/module-helpers";

export default class ProfileCtrl extends Controller {
	constructor() {
		super(...arguments);

		const profile = this.currentUser && this.currentUser.profile;
		this.name = profile ? profile.name : "";
		this.status = profile ? profile.status : "";
	}

	updatePicture() {
		MeteorCameraUI.getPicture({ width: 50, height: 50 }, (err, data) => {
			if (err) return this.handleError(err);

			this.$ionicLoading.show({
				template: "Updating picture..."
			});

			this.callMethod("updatePicture", data, err => {
				this.$ionicLoading.hide();
				this.handleError(err);
			});
		});
	}

	updateName() {
		if (_.isEmpty(this.name)) return;

		this.callMethod("updateName", this.name, err => {
			if (err) return this.handleError(err);
			this.$state.go("tab.chats");
		});
	}

	updateStatus() {
		if (_.isEmpty(this.status)) return;

		this.callMethod("updateStatus", this.status, err => {
			if (err) return this.handleError(err);
			this.$state.go("tab.chats");
		});
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

ProfileCtrl.$name = "ProfileCtrl";
ProfileCtrl.$inject = ["$state", "$ionicLoading", "$ionicPopup", "$log"];
