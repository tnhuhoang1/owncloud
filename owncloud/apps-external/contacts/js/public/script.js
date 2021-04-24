/**
 * ownCloud - contacts
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Hendrik Leppelsack <hendrik@leppelsack.de>
 * @copyright Hendrik Leppelsack 2015
 */

angular.module('contactsApp', ['uuid4', 'angular-cache', 'ngRoute', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngclipboard'])
.config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/:gid', {
		template: '<contactdetails></contactdetails>'
	});

	$routeProvider.when('/:gid/:uid', {
		template: '<contactdetails></contactdetails>'
	});

	$routeProvider.otherwise('/' + t('contacts', 'All contacts'));

}]);

angular.module('contactsApp')
.directive('onToggleShow', ['$document', function($document) {
	'use strict';

	return {
		restrict: 'A',
		scope: {
			'onToggleShow': '@'
		},
		link: function link(scope, elem) {
			elem.click(function () {
				var target = $(scope.onToggleShow);
				target.toggle();
			});

			$document.click(function (event) {
				var target = $(scope.onToggleShow);

				if (event.target !== elem[0]) {
					target.hide();
				}
			});
		}
	};
}]);

angular.module('contactsApp')
.directive('datepicker', function() {
	return {
		restrict: 'A',
		require : 'ngModel',
		link : function (scope, element, attrs, ngModelCtrl) {
			$(function() {
				element.datepicker({
					dateFormat:'yy-mm-dd',
					minDate: null,
					maxDate: null,
					constrainInput: false,
					onSelect:function (date, dp) {
						if (dp.selectedYear < 1000) {
							date = '0' + date;
						}
						if (dp.selectedYear < 100) {
							date = '0' + date;
						}
						if (dp.selectedYear < 10) {
							date = '0' + date;
						}
						ngModelCtrl.$setViewValue(date);
						scope.$apply();
					}
				});
			});
		}
	};
});

angular.module('contactsApp')
.directive('focusExpression', ['$timeout', function ($timeout) {
	return {
		restrict: 'A',
		link: {
			post: function postLink(scope, element, attrs) {
				scope.$watch(attrs.focusExpression, function () {
					if (attrs.focusExpression) {
						if (scope.$eval(attrs.focusExpression)) {
							$timeout(function () {
								if (element.is('input')) {
									element.focus();
								} else {
									element.find('input').focus();
								}
							}, 100); //need some delay to work with ng-disabled
						}
					}
				});
			}
		}
	};
}]);

angular.module('contactsApp')
.directive('inputresize', function() {
	return {
		restrict: 'A',
		link : function (scope, element) {
			var elInput = element.val();
			element.bind('keydown keyup load focus', function() {
				elInput = element.val();
				// If set to 0, the min-width css data is ignored
				var length = elInput.length > 1 ? elInput.length : 1;
				element.attr('size', length);
			});
		}
	};
});

angular.module('contactsApp')
.controller('optionsCtrl', ['SettingsService', function(SettingsService) {
	var ctrl = this;

	ctrl.t = {
		phoneticText: t('contacts', 'Enable phonetic'),
		reverseNameOrderText: t('contacts', 'Reverse name order'),
	};

	ctrl.phoneticEnable = SettingsService.get('phoneticEnable');
	ctrl.reverseNameOrder = SettingsService.get('reverseNameOrder');

	ctrl.updateOptions = function() {
		SettingsService.set('phoneticEnable', ctrl.phoneticEnable);
		SettingsService.set('reverseNameOrder', ctrl.reverseNameOrder);
	};
}]);

angular.module('contactsApp')
.directive('options', function() {
	return {
		priority: 1,
		scope: {},
		controller: 'optionsCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('contacts', 'templates/Options.html')
	};
});

angular.module('contactsApp')
.controller('addressbookCtrl', ['$scope', 'AddressBookService', function($scope, AddressBookService) {
	var ctrl = this;

	ctrl.t = {
		copyUrlTitle : t('contacts', 'Copy Url to clipboard'),
		edit: t('contacts', 'Rename'),
		download: t('contacts', 'Download'),
		showURL:t('contacts', 'Link'),
		shareAddressbook: t('contacts', 'Share'),
		deleteAddressbook: t('contacts', 'Delete'),
		shareInputPlaceHolder: t('contacts', 'Share with users or groups'),
		delete: t('contacts', 'Delete'),
		more: t('contacts', 'More'),
		canEdit: t('contacts', 'can edit')
	};

	ctrl.showUrl = false;
	ctrl.editing = false;
	/* globals oc_config */
	/* eslint-disable camelcase */
	ctrl.canExport = oc_config.version.split('.')[0] >= 9 || oc_config.version.split('.') >= [9, 0, 2, 0];
	/* eslint-enable camelcase */

	ctrl.openNameEditor = function () {
		ctrl.displayName = ctrl.addressBook.displayName;

		ctrl.editing = true;
	};

	ctrl.cancelNameEditor = function () {
		ctrl.displayName = '';

		ctrl.editing = false;
	};

	ctrl.saveNameEditor = function() {
		AddressBookService.rename(ctrl.addressBook, ctrl.displayName).then(function() {
			ctrl.addressBook.displayName = ctrl.displayName;
			ctrl.displayname = '';

			ctrl.editing = false;
			$scope.$apply();
		});
	};

	ctrl.toggleShowUrl = function() {
		ctrl.showUrl = !ctrl.showUrl;
	};

	ctrl.toggleSharesEditor = function() {
		ctrl.editingShares = !ctrl.editingShares;
		ctrl.selectedSharee = null;
	};

	/* From Calendar-Rework - js/app/controllers/calendarlistcontroller.js */
	ctrl.findSharee = function (val) {
		return $.get(
			OC.linkToOCS('apps/files_sharing/api/v1') + 'sharees',
			{
				format: 'json',
				search: val.trim(),
				perPage: 200,
				itemType: 'principals'
			}
		).then(function(result) {
			// Todo - filter out current user, existing sharees
			var users   = result.ocs.data.exact.users.concat(result.ocs.data.users);
			var groups  = result.ocs.data.exact.groups.concat(result.ocs.data.groups);

			var userShares = ctrl.addressBook.sharedWith.users;
			var userSharesLength = userShares.length;
			var i, j;

			// Filter out current user
			var usersLength = users.length;
			for (i = 0 ; i < usersLength; i++) {
				if (users[i].value.shareWith === OC.currentUser) {
					users.splice(i, 1);
					break;
				}
			}

			// Now filter out all sharees that are already shared with
			for (i = 0; i < userSharesLength; i++) {
				var share = userShares[i];
				usersLength = users.length;
				for (j = 0; j < usersLength; j++) {
					if (users[j].value.shareWith === share.id) {
						users.splice(j, 1);
						break;
					}
				}
			}

			// Combine users and groups
			users = users.map(function(item) {
				return {
					display: _.escape(item.value.shareWith),
					type: OC.Share.SHARE_TYPE_USER,
					identifier: item.value.shareWith
				};
			});

			groups = groups.map(function(item) {
				return {
					display: _.escape(item.value.shareWith) + ' (group)',
					type: OC.Share.SHARE_TYPE_GROUP,
					identifier: item.value.shareWith
				};
			});

			return groups.concat(users);
		});
	};

	ctrl.onSelectSharee = function (item) {
		ctrl.selectedSharee = null;
		AddressBookService.share(ctrl.addressBook, item.type, item.identifier, false, false).then(function() {
			$scope.$apply();
		});

	};

	ctrl.updateExistingUserShare = function(userId, writable) {
		AddressBookService.share(ctrl.addressBook, OC.Share.SHARE_TYPE_USER, userId, writable, true).then(function() {
			$scope.$apply();
		});
	};

	ctrl.updateExistingGroupShare = function(groupId, writable) {
		AddressBookService.share(ctrl.addressBook, OC.Share.SHARE_TYPE_GROUP, groupId, writable, true).then(function() {
			$scope.$apply();
		});
	};

	ctrl.unshareFromUser = function(userId) {
		AddressBookService.unshare(ctrl.addressBook, OC.Share.SHARE_TYPE_USER, userId).then(function() {
			$scope.$apply();
		});
	};

	ctrl.unshareFromGroup = function(groupId) {
		AddressBookService.unshare(ctrl.addressBook, OC.Share.SHARE_TYPE_GROUP, groupId).then(function() {
			$scope.$apply();
		});
	};

	ctrl.deleteAddressBook = function() {
		AddressBookService.delete(ctrl.addressBook).then(function() {
			$scope.$apply();
		});
	};

	ctrl.download = function() {
		window.open(ctrl.addressBook.url + '?export');
	};

}]);

angular.module('contactsApp')
.directive('addressbook', function() {
	return {
		restrict: 'A', // has to be an attribute to work with core css
		scope: {
			index: '@'
		},
		controller: 'addressbookCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			addressBook: '=data',
			list: '='
		},
		templateUrl: OC.linkTo('contacts', 'templates/addressBook.html')
	};
});

angular.module('contactsApp')
.controller('addressbooklistCtrl', ['$scope', 'AddressBookService', function($scope, AddressBookService) {
	var ctrl = this;

	ctrl.loading = true;

	AddressBookService.getAll().then(function(addressBooks) {
		ctrl.addressBooks = addressBooks;
		ctrl.loading = false;
		if(ctrl.addressBooks.length === 0) {
			AddressBookService.create(t('contacts', 'Contacts')).then(function() {
				AddressBookService.getAddressBook(t('contacts', 'Contacts')).then(function(addressBook) {
					ctrl.addressBooks.push(addressBook);
					$scope.$apply();
				});
			});
		}
	});

	ctrl.t = {
		addressBookName : t('contacts', 'Address book name')
	};

	ctrl.createAddressBook = function() {
		if(ctrl.newAddressBookName) {
			AddressBookService.create(ctrl.newAddressBookName).then(function() {
				AddressBookService.getAddressBook(ctrl.newAddressBookName).then(function(addressBook) {
					ctrl.addressBooks.push(addressBook);
					ctrl.newAddressBookName = '';
					$scope.$apply();
				});
			});
		}
	};
}]);

angular.module('contactsApp')
.directive('addressbooklist', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'addressbooklistCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('contacts', 'templates/addressBookList.html')
	};
});

angular.module('contactsApp')
.controller('avatarCtrl', ['ContactService', function(ContactService) {
	var ctrl = this;

	ctrl.import = ContactService.import.bind(ContactService);

}]);

angular.module('contactsApp')
.directive('avatar', ['ContactService', function(ContactService) {
	return {
		scope: {
			contact: '=data'
		},
		link: function(scope, element) {
			var importText = t('contacts', 'Import');
			scope.importText = importText;

			var input = element.find('input');
			input.bind('change', function() {
				var file = input.get(0).files[0];
				if (file.size > 1024*1024) { // 1 MB
					OC.Notification.showTemporary(t('contacts', 'The selected image is too big (max 1MB)'));
				} else {
					var reader = new FileReader();

					reader.addEventListener('load', function () {
						scope.$apply(function() {
							scope.contact.photo(reader.result);
							ContactService.update(scope.contact);
						});
					}, false);

					if (file) {
						reader.readAsDataURL(file);
					}
				}
			});
		},
		templateUrl: OC.linkTo('contacts', 'templates/avatar.html')
	};
}]);

angular.module('contactsApp')
.controller('contactCtrl', ['$route', '$routeParams', 'SortByService', function($route, $routeParams, SortByService) {
	var ctrl = this;

	ctrl.openContact = function() {
		$route.updateParams({
			gid: $routeParams.gid,
			uid: ctrl.contact.uid()});
	};

	ctrl.getName = function() {
		// If lastName equals to firstName then none of them is set
		if (ctrl.contact.lastName() === ctrl.contact.firstName()) {
			return ctrl.contact.displayName();
		}

		if (SortByService.getSortBy() === 'sortLastName') {
			return (
				ctrl.contact.lastName() + ', '
				+ ctrl.contact.firstName() + ' '
				+ ctrl.contact.additionalNames()
			).trim();
		}

		if (SortByService.getSortBy() === 'sortFirstName') {
			return (
				ctrl.contact.firstName() + ' '
				+ ctrl.contact.additionalNames() + ' '
				+ ctrl.contact.lastName()
			).trim();
		}

		return ctrl.contact.displayName();
	};
}]);

angular.module('contactsApp')
.directive('contact', function() {
	return {
		scope: {},
		controller: 'contactCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			contact: '=data'
		},
		templateUrl: OC.linkTo('contacts', 'templates/contact.html')
	};
});

angular.module('contactsApp')
.controller('contactdetailsCtrl', ['ContactService', 'AddressBookService', 'vCardPropertiesService', '$route', '$routeParams', '$scope', function(ContactService, AddressBookService, vCardPropertiesService, $route, $routeParams, $scope) {

	var ctrl = this;

	ctrl.loading = true;
	ctrl.show = false;

	ctrl.clearContact = function() {
		$route.updateParams({
			gid: $routeParams.gid,
			uid: undefined
		});
		ctrl.show = false;
		ctrl.contact = undefined;
	};

	ctrl.uid = $routeParams.uid;
	ctrl.t = {
		noContacts : t('contacts', 'No contacts in here'),
		placeholderName : t('contacts', 'Name'),
		placeholderOrg : t('contacts', 'Organization'),
		placeholderTitle : t('contacts', 'Title'),
		selectField : t('contacts', 'Add field ...'),
		download : t('contacts', 'Download'),
		delete : t('contacts', 'Delete'),
		save : t('contacts', 'Save changes'),
		addressBook : t('contacts', 'Address book')
	};

	ctrl.fieldDefinitions = vCardPropertiesService.fieldDefinitions;
	ctrl.focus = undefined;
	ctrl.field = undefined;
	ctrl.addressBooks = [];

	AddressBookService.getAll().then(function(addressBooks) {
		ctrl.addressBooks = addressBooks;

		if (!_.isUndefined(ctrl.contact)) {
			ctrl.addressBook = _.find(ctrl.addressBooks, function(book) {
				return book.displayName === ctrl.contact.addressBookId;
			});
		}
		ctrl.loading = false;
	});

	$scope.$watch('ctrl.uid', function(newValue) {
		ctrl.changeContact(newValue);
	});

	ctrl.changeContact = function(uid) {
		if (typeof uid === 'undefined') {
			ctrl.show = false;
			$('#app-navigation-toggle').removeClass('showdetails');
			return;
		}
		ContactService.getById(uid).then(function(contact) {
			if (angular.isUndefined(contact)) {
				ctrl.clearContact();
				return;
			}
			ctrl.contact = contact;
			ctrl.show = true;
			$('#app-navigation-toggle').addClass('showdetails');

			ctrl.addressBook = _.find(ctrl.addressBooks, function(book) {
				return book.displayName === ctrl.contact.addressBookId;
			});
		});
	};

	ctrl.updateContact = function() {
		ContactService.update(ctrl.contact);
	};

	ctrl.deleteContact = function() {
		ContactService.delete(ctrl.contact);
	};

	ctrl.addField = function(field) {
		var defaultValue = vCardPropertiesService.getMeta(field).defaultValue || {value: ''};
		ctrl.contact.addProperty(field, defaultValue);
		ctrl.focus = field;
		ctrl.field = '';
	};

	ctrl.deleteField = function (field, prop) {
		ctrl.contact.removeProperty(field, prop);
		ctrl.focus = undefined;
	};

	ctrl.changeAddressBook = function (addressBook) {
		ContactService.moveContact(ctrl.contact, addressBook);
	};
}]);

angular.module('contactsApp')
.directive('contactdetails', function() {
	return {
		priority: 1,
		scope: {},
		controller: 'contactdetailsCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('contacts', 'templates/contactDetails.html')
	};
});

angular.module('contactsApp')
.controller('contactimportCtrl', ['ContactService', function(ContactService) {
	var ctrl = this;

	ctrl.import = ContactService.import.bind(ContactService);

}]);

angular.module('contactsApp')
.directive('contactimport', ['ContactService', function(ContactService) {
	return {
		link: function(scope, element) {
			var importText = t('contacts', 'Import');
			scope.importText = importText;

			var input = element.find('input');
			input.bind('change', function() {
				angular.forEach(input.get(0).files, function(file) {
					var reader = new FileReader();

					reader.addEventListener('load', function () {
						scope.$apply(function () {
							ContactService.import.call(ContactService, reader.result, file.type, null, function (progress) {
								if (progress === 1) {
									scope.importText = importText;
								} else {
									scope.importText = parseInt(Math.floor(progress * 100)) + '%';
								}
							});
						});
					}, false);

					if (file) {
						reader.readAsText(file);
					}
				});
				input.get(0).value = '';
			});
		},
		templateUrl: OC.linkTo('contacts', 'templates/contactImport.html')
	};
}]);

angular.module('contactsApp')
.controller('contactlistCtrl', ['$scope', '$filter', '$route', '$routeParams', 'ContactService', 'SortByService', 'vCardPropertiesService', 'SearchService', function($scope, $filter, $route, $routeParams, ContactService, SortByService, vCardPropertiesService, SearchService) {
	var ctrl = this;

	ctrl.routeParams = $routeParams;

	ctrl.contactList = [];
	ctrl.searchTerm = '';
	ctrl.show = true;
	ctrl.invalid = false;

	ctrl.sortBy = SortByService.getSortBy();

	ctrl.t = {
		emptySearch : t('contacts', 'No search result for {query}', {query: ctrl.searchTerm})
	};

	$scope.getCountString = function(contacts) {
		return n('contacts', '%n contact', '%n contacts', contacts.length);
	};

	$scope.query = function(contact) {
		return contact.matches(SearchService.getSearchTerm());
	};

	SortByService.subscribe(function(newValue) {
		ctrl.sortBy = newValue;
	});

	SearchService.registerObserverCallback(function(ev) {
		if (ev.event === 'submitSearch') {
			var uid = !_.isEmpty(ctrl.contactList) ? ctrl.contactList[0].uid() : undefined;
			ctrl.setSelectedId(uid);
			$scope.$apply();
		}
		if (ev.event === 'changeSearch') {
			ctrl.searchTerm = ev.searchTerm;
			ctrl.t.emptySearch = t('contacts',
								   'No search result for {query}',
								   {query: ctrl.searchTerm}
								  );
			$scope.$apply();
		}
	});

	ctrl.loading = true;

	ContactService.registerObserverCallback(function(ev) {
		$scope.$apply(function() {
			if (ev.event === 'delete') {
				if (ctrl.contactList.length === 1) {
					$route.updateParams({
						gid: $routeParams.gid,
						uid: undefined
					});
				} else {
					for (var i = 0, length = ctrl.contactList.length; i < length; i++) {
						if (ctrl.contactList[i].uid() === ev.uid) {
							$route.updateParams({
								gid: $routeParams.gid,
								uid: (ctrl.contactList[i+1]) ? ctrl.contactList[i+1].uid() : ctrl.contactList[i-1].uid()
							});
							break;
						}
					}
				}
			}
			else if (ev.event === 'create') {
				$route.updateParams({
					gid: $routeParams.gid,
					uid: ev.uid
				});
			}
			ctrl.contacts = ev.contacts;
		});
	});

	// Get contacts
	ContactService.getAll().then(function(contacts) {
		if(contacts.length>0) {
			$scope.$apply(function() {
				ctrl.contacts = contacts;
			});
		} else {
			ctrl.loading = false;
		}
	});

	// Wait for ctrl.contactList to be updated, load the first contact and kill the watch
	var unbindListWatch = $scope.$watch('ctrl.contactList', function() {
		if(ctrl.contactList && ctrl.contactList.length > 0) {
			// Check if a specific uid is requested
			if($routeParams.uid && $routeParams.gid) {
				ctrl.contactList.forEach(function(contact) {
					if(contact.uid() === $routeParams.uid) {
						ctrl.setSelectedId($routeParams.uid);
						ctrl.loading = false;
					}
				});
			}
			// No contact previously loaded, let's load the first of the list if not in mobile mode
			if(ctrl.loading && $(window).width() > 768) {
				ctrl.setSelectedId(ctrl.contactList[0].uid());
			}
			ctrl.loading = false;
			unbindListWatch();
		}
	});

	$scope.$watch('ctrl.routeParams.uid', function(newValue, oldValue) {
		// Used for mobile view to clear the url
		if(typeof oldValue != 'undefined' && typeof newValue == 'undefined' && $(window).width() <= 768) {
			// no contact selected
			ctrl.show = true;
			return;
		}
		if(newValue === undefined) {
			// we might have to wait until ng-repeat filled the contactList
			if(ctrl.contactList && ctrl.contactList.length > 0) {
				$route.updateParams({
					gid: $routeParams.gid,
					uid: ctrl.contactList[0].uid()
				});
			} else {
				// watch for next contactList update
				var unbindWatch = $scope.$watch('ctrl.contactList', function() {
					if(ctrl.contactList && ctrl.contactList.length > 0) {
						$route.updateParams({
							gid: $routeParams.gid,
							uid: ctrl.contactList[0].uid()
						});
					}
					unbindWatch(); // unbind as we only want one update
				});
			}
		} else {
			// displaying contact details
			ctrl.show = false;
		}
	});

	$scope.$watch('ctrl.routeParams.gid', function() {
		// we might have to wait until ng-repeat filled the contactList
		ctrl.contactList = [];
		// not in mobile mode
		if($(window).width() > 768) {
			// watch for next contactList update
			var unbindWatch = $scope.$watch('ctrl.contactList', function() {
				if(ctrl.contactList && ctrl.contactList.length > 0) {
					$route.updateParams({
						gid: $routeParams.gid,
						uid: ctrl.contactList[0].uid()
					});
				}
				unbindWatch(); // unbind as we only want one update
			});
		}
	});

	// Watch if we have an invalid contact
	$scope.$watch('ctrl.contactList[0].displayName()', function(displayName) {
		ctrl.invalid = (displayName === '');
	});

	ctrl.hasContacts = function () {
		if (!ctrl.contacts) {
			return false;
		}
		return ctrl.contacts.length > 0;
	};

	ctrl.setSelectedId = function (contactId) {
		$route.updateParams({
			uid: contactId
		});
	};

	ctrl.getSelectedId = function() {
		return $routeParams.uid;
	};

}]);

angular.module('contactsApp')
.directive('contactlist', function() {
	return {
		priority: 1,
		scope: {},
		controller: 'contactlistCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			addressbook: '=adrbook'
		},
		templateUrl: OC.linkTo('contacts', 'templates/contactList.html')
	};
});

angular.module('contactsApp')
.controller('detailsItemCtrl', ['$templateRequest', 'vCardPropertiesService', 'ContactService', 'SettingsService', function($templateRequest, vCardPropertiesService, ContactService, SettingsService) {
	var ctrl = this;

	ctrl.meta = vCardPropertiesService.getMeta(ctrl.name);
	ctrl.type = undefined;
	ctrl.isPreferred = false;
	ctrl.t = {
		poBox : t('contacts', 'Post office box'),
		postalCode : t('contacts', 'Postal code'),
		city : t('contacts', 'City'),
		state : t('contacts', 'State or province'),
		country : t('contacts', 'Country'),
		address: t('contacts', 'Address'),
		newGroup: t('contacts', '(new group)'),
		familyName: t('contacts', 'Last name'),
		firstName: t('contacts', 'First name'),
		phoneticFirstName: t('contacts', 'Phonetic first name'),
		phoneticLastName: t('contacts', 'Phonetic last name'),
		additionalNames: t('contacts', 'Additional names'),
		honorificPrefix: t('contacts', 'Prefix'),
		honorificSuffix: t('contacts', 'Suffix'),
		delete: t('contacts', 'Delete')
	};

	function updateOptions() {
		ctrl.phoneticEnable = SettingsService.get('phoneticEnable');
		ctrl.reverseNameOrder = SettingsService.get('reverseNameOrder');
	}
	SettingsService.subscribe(updateOptions);
	updateOptions();

	ctrl.availableOptions = ctrl.meta.options || [];
	if (!_.isUndefined(ctrl.data) && !_.isUndefined(ctrl.data.meta) && !_.isUndefined(ctrl.data.meta.type)) {
		// parse type of the property
		var array = ctrl.data.meta.type[0].split(',');
		array = array.map(function (elem) {
			return elem.trim().replace(/\/+$/, '').replace(/\\+$/, '').trim().toUpperCase();
		});
		// the pref value is handled on its own so that we can add some favorite icon to the ui if we want
		if (array.indexOf('PREF') >= 0) {
			ctrl.isPreferred = true;
			array.splice(array.indexOf('PREF'), 1);
		}
		// simply join the upper cased types together as key
		ctrl.type = array.join(',');
		var displayName = array.map(function (element) {
			return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
		}).join(' ');

		// in case the type is not yet in the default list of available options we add it
		if (!ctrl.availableOptions.some(function(e) { return e.id === ctrl.type; } )) {
			ctrl.availableOptions = ctrl.availableOptions.concat([{id: ctrl.type, name: displayName}]);
		}
	}
	if (!_.isUndefined(ctrl.data) && !_.isUndefined(ctrl.data.namespace)) {
		if (!_.isUndefined(ctrl.model.contact.props['X-ABLABEL'])) {
			var val = _.find(this.model.contact.props['X-ABLABEL'], function(x) { return x.namespace === ctrl.data.namespace; });
			ctrl.type = val.value;
			if (!_.isUndefined(val)) {
				// in case the type is not yet in the default list of available options we add it
				if (!ctrl.availableOptions.some(function(e) { return e.id === val.value; } )) {
					ctrl.availableOptions = ctrl.availableOptions.concat([{id: val.value, name: val.value}]);
				}
			}
		}
	}
	ctrl.availableGroups = [];

	ContactService.getGroups().then(function(groups) {
		ctrl.availableGroups = _.unique(groups);
	});

	ctrl.data.phoneticFirstName = ctrl.model.contact.phoneticFirstName();
	ctrl.data.phoneticLastName = ctrl.model.contact.phoneticLastName();

	ctrl.changeType = function (val) {
		if (ctrl.isPreferred) {
			val += ',PREF';
		}
		ctrl.data.meta = ctrl.data.meta || {};
		ctrl.data.meta.type = ctrl.data.meta.type || [];
		ctrl.data.meta.type[0] = val;
		ctrl.model.updateContact();
	};

	ctrl.dateInputChanged = function () {
		ctrl.data.meta = ctrl.data.meta || {};

		var match = ctrl.data.value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (match) {
			ctrl.data.meta.value = [];
		} else {
			ctrl.data.meta.value = ctrl.data.meta.value || [];
			ctrl.data.meta.value[0] = 'text';
		}
		ctrl.model.updateContact();
	};

	ctrl.updateDetailedName = function () {
		var fn = '';
		var order;
		var fnItem = [];
		if (ctrl.reverseNameOrder) {
			order = [ 3, 0, 2, 1, 4 ];
		} else {
			order = [ 3, 1, 2, 0, 4 ];
		}
		angular.forEach(order, function(index) {
			if (ctrl.data.value[index]) {
				fnItem.push(ctrl.data.value[index]);
			}
		});
		fn = fnItem.join(' ');

		ctrl.model.contact.fullName(fn);
		ctrl.model.updateContact();
	};

	ctrl.updatePhoneticFirstName = function () {
		ctrl.model.contact.phoneticFirstName(ctrl.data.phoneticFirstName);
		ctrl.model.updateContact();
	};

	ctrl.updatePhoneticLastName = function () {
		ctrl.model.contact.phoneticLastName(ctrl.data.phoneticLastName);
		ctrl.model.updateContact();
	};

	ctrl.getTemplate = function() {
		var templateUrl = OC.linkTo('contacts', 'templates/detailItems/' + ctrl.meta.template + '.html');
		return $templateRequest(templateUrl);
	};

	ctrl.deleteField = function () {
		ctrl.model.deleteField(ctrl.name, ctrl.data);
		ctrl.model.updateContact();
	};
}]);

angular.module('contactsApp')
.directive('detailsitem', ['$compile', function($compile) {
	return {
		scope: {},
		controller: 'detailsItemCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			name: '=',
			data: '=',
			model: '='
		},
		link: function(scope, element, attrs, ctrl) {
			ctrl.getTemplate().then(function(html) {
				var template = angular.element(html);
				element.append(template);
				$compile(template)(scope);
			});
		}
	};
}]);

angular.module('contactsApp')
.controller('groupCtrl', function() {
	// eslint-disable-next-line no-unused-vars
	var ctrl = this;
});

angular.module('contactsApp')
.directive('group', function() {
	return {
		restrict: 'A', // has to be an attribute to work with core css
		scope: {},
		controller: 'groupCtrl',
		controllerAs: 'ctrl',
		bindToController: {
			group: '=data'
		},
		templateUrl: OC.linkTo('contacts', 'templates/group.html')
	};
});

angular.module('contactsApp')
.controller('grouplistCtrl', ['$scope', 'ContactService', 'SearchService', '$routeParams', function($scope, ContactService, SearchService, $routeParams) {
	var ctrl = this;

	var initialGroups = [t('contacts', 'All contacts'), t('contacts', 'Not grouped')];

	ctrl.groups = initialGroups;

	ContactService.getGroups().then(function(groups) {
		ctrl.groups = _.unique(initialGroups.concat(groups));
	});

	ctrl.getSelected = function() {
		return $routeParams.gid;
	};

	// Update groupList on contact add/delete/update
	ContactService.registerObserverCallback(function() {
		$scope.$apply(function() {
			ContactService.getGroups().then(function(groups) {
				ctrl.groups = _.unique(initialGroups.concat(groups));
			});
		});
	});

	ctrl.setSelected = function (selectedGroup) {
		SearchService.cleanSearch();
		$routeParams.gid = selectedGroup;
	};
}]);

angular.module('contactsApp')
.directive('grouplist', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'grouplistCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('contacts', 'templates/groupList.html')
	};
});

angular.module('contactsApp')
.controller('newContactButtonCtrl', ['$scope', 'ContactService', '$routeParams', 'vCardPropertiesService', function($scope, ContactService, $routeParams, vCardPropertiesService) {
	var ctrl = this;

	ctrl.t = {
		addContact : t('contacts', 'New contact')
	};

	ctrl.createContact = function() {
		ContactService.create().then(function(contact) {
			['tel', 'adr', 'email'].forEach(function(field) {
				var defaultValue = vCardPropertiesService.getMeta(field).defaultValue || {value: ''};
				contact.addProperty(field, defaultValue);
			} );
			if ([t('contacts', 'All contacts'), t('contacts', 'Not grouped')].indexOf($routeParams.gid) === -1) {
				contact.categories($routeParams.gid);
			} else {
				contact.categories('');
			}
			$('#details-fullName').focus();
		});
	};
}]);

angular.module('contactsApp')
.directive('newcontactbutton', function() {
	return {
		restrict: 'EA', // has to be an attribute to work with core css
		scope: {},
		controller: 'newContactButtonCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('contacts', 'templates/newContactButton.html')
	};
});

angular.module('contactsApp')
.directive('telModel', function() {
	return{
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			ngModel.$formatters.push(function(value) {
				return value;
			});
			ngModel.$parsers.push(function(value) {
				return value;
			});
		}
	};
});

angular.module('contactsApp')
.controller('sortbyCtrl', ['SortByService', function(SortByService) {
	var ctrl = this;

	var sortText = t('contacts', 'Sort by');
	ctrl.sortText = sortText;

	var sortList = SortByService.getSortByList();
	ctrl.sortList = sortList;

	ctrl.defaultOrder = SortByService.getSortBy();

	ctrl.updateSortBy = function() {
		SortByService.setSortBy(ctrl.defaultOrder);
	};
}]);

angular.module('contactsApp')
.directive('sortby', function() {
	return {
		priority: 1,
		scope: {},
		controller: 'sortbyCtrl',
		controllerAs: 'ctrl',
		bindToController: {},
		templateUrl: OC.linkTo('contacts', 'templates/sortBy.html')
	};
});

angular.module('contactsApp')
.factory('AddressBook', function()
{
	return function AddressBook(data) {
		angular.extend(this, {

			displayName: '',
			contacts: [],
			groups: data.data.props.groups,

			getContact: function(uid) {
				for(var i in this.contacts) {
					if(this.contacts[i].uid() === uid) {
						return this.contacts[i];
					}
				}
				return undefined;
			},

			sharedWith: {
				users: [],
				groups: []
			}

		});
		angular.extend(this, data);
		angular.extend(this, {
			owner: data.url.split('/').slice(-3, -2)[0]
		});

		var shares = this.data.props.invite;
		if (typeof shares !== 'undefined') {
			for (var j = 0; j < shares.length; j++) {
				var href = shares[j].href;
				if (href.length === 0) {
					continue;
				}
				var access = shares[j].access;
				if (access.length === 0) {
					continue;
				}

				var readWrite = (typeof access.readWrite !== 'undefined');

				if (href.startsWith('principal:principals/users/')) {
					this.sharedWith.users.push({
						id: href.substr(27),
						displayname: href.substr(27),
						writable: readWrite
					});
				} else if (href.startsWith('principal:principals/groups/')) {
					this.sharedWith.groups.push({
						id: href.substr(28),
						displayname: href.substr(28),
						writable: readWrite
					});
				}
			}
		}

		//var owner = this.data.props.owner;
		//if (typeof owner !== 'undefined' && owner.length !== 0) {
		//	owner = owner.trim();
		//	if (owner.startsWith('/remote.php/dav/principals/users/')) {
		//		this._properties.owner = owner.substr(33);
		//	}
		//}

	};
});

angular.module('contactsApp')
.factory('Contact', ['$filter', function($filter) {
	return function Contact(addressBook, vCard) {
		angular.extend(this, {

			data: {},
			props: {},
			// Allow addresses & non-address props to be displayed in separate columns
			addresses: {},
			nonAddresses: {},

			dateProperties: ['bday', 'anniversary', 'deathdate'],

			addressBookId: addressBook.displayName,

			version: function() {
				var property = this.getProperty('version');
				if(property) {
					return property.value;
				}

				return undefined;
			},

			uid: function(value) {
				var model = this;
				if (angular.isDefined(value)) {
					// setter
					return model.setProperty('uid', { value: value });
				} else {
					// getter
					return model.getProperty('uid').value;
				}
			},

			sortFirstName: function() {
				return [this.firstName(), this.lastName()];
			},

			sortLastName: function() {
				return [this.lastName(), this.firstName()];
			},

			sortPhoneticFirstName: function() {
				return [this.phoneticFirstName() ? this.phoneticFirstName() : this.firstName(),
					this.phoneticLastName() ? this.phoneticLastName() : this.lastName()];
			},

			sortPhoneticLastName: function() {
				return [this.phoneticLastName() ? this.phoneticLastName() : this.lastName(),
					this.phoneticFirstName() ? this.phoneticFirstName() : this.firstName()];
			},

			sortDisplayName: function() {
				return this.displayName();
			},

			displayName: function() {
				return this.fullName() || this.org() || '';
			},

			firstName: function() {
				var property = this.getProperty('n');
				if (property) {
					return property.value[1];
				} else {
					return this.displayName();
				}
			},

			lastName: function() {
				var property = this.getProperty('n');
				if (property) {
					return property.value[0];
				} else {
					return this.displayName();
				}
			},

			phoneticFirstName: function(value) {
				var model = this;
				if (angular.isDefined(value)) {
					// setter
					return this.setProperty('X-PHONETIC-FIRST-NAME', { value: value });
				} else {
					// getter
					var property = model.getProperty('X-PHONETIC-FIRST-NAME');
					if(property) {
						return property.value;
					}
					return undefined;
				}
			},

			phoneticLastName: function(value) {
				var model = this;
				if (angular.isDefined(value)) {
					// setter
					return this.setProperty('X-PHONETIC-LAST-NAME', { value: value });
				} else {
					// getter
					var property = model.getProperty('X-PHONETIC-LAST-NAME');
					if(property) {
						return property.value;
					}
					return undefined;
				}
			},

			additionalNames: function() {
				var property = this.getProperty('n');
				if (property) {
					return property.value[2];
				} else {
					return '';
				}
			},

			fullName: function(value) {
				var model = this;
				if (angular.isDefined(value)) {
					// setter
					return this.setProperty('fn', { value: value });
				} else {
					// getter
					var property = model.getProperty('fn');
					if(property) {
						return property.value;
					}
					property = model.getProperty('n');
					if(property) {
						return property.value.filter(function(elem) {
							return elem;
						}).join(' ');
					}
					return undefined;
				}
			},

			title: function(value) {
				if (angular.isDefined(value)) {
					// setter
					return this.setProperty('title', { value: value });
				} else {
					// getter
					var property = this.getProperty('title');
					if(property) {
						return property.value;
					} else {
						return undefined;
					}
				}
			},

			org: function(value) {
				var property = this.getProperty('org');
				if (angular.isDefined(value)) {
					var val = value;
					// setter
					if(property && Array.isArray(property.value)) {
						val = property.value;
						val[0] = value;
					}
					return this.setProperty('org', { value: val });
				} else {
					// getter
					if(property) {
						if (Array.isArray(property.value)) {
							return property.value[0];
						}
						return property.value;
					} else {
						return undefined;
					}
				}
			},

			email: function() {
				// getter
				var property = this.getProperty('email');
				if(property) {
					return property.value;
				} else {
					return undefined;
				}
			},

			photo: function(value) {
				if (angular.isDefined(value)) {
					// setter
					// splits image data into "data:image/jpeg" and base 64 encoded image
					var imageData = value.split(';base64,');
					var imageType = imageData[0].slice('data:'.length);
					if (!imageType.startsWith('image/')) {
						return;
					}
					imageType = imageType.substring(6).toUpperCase();

					return this.setProperty('photo', { value: imageData[1], meta: {type: [imageType], encoding: ['b']} });
				} else {
					var property = this.getProperty('photo');
					if(property) {
						var type = property.meta.type;
						if (angular.isUndefined(type)) {
							return undefined;
						}
						if (angular.isArray(type)) {
							type = type[0];
						}
						if (!type.startsWith('image/')) {
							type = 'image/' + type.toLowerCase();
						}
						return 'data:' + type + ';base64,' + property.value;
					} else {
						return undefined;
					}
				}
			},

			categories: function(value) {
				if (angular.isDefined(value)) {
					// setter
					if (angular.isString(value)) {
						/* check for empty string */
						this.setProperty('categories', { value: !value.length ? [] : [value] });
					} else if (angular.isArray(value)) {
						this.setProperty('categories', { value: value });
					}
				} else {
					// getter
					var property = this.getProperty('categories');
					if(!property) {
						return [];
					}
					if (angular.isArray(property.value)) {
						return property.value;
					}
					return [property.value];
				}
			},

			formatDateAsRFC6350: function(name, data) {
				if (_.isUndefined(data) || _.isUndefined(data.value)) {
					return data;
				}
				if (this.dateProperties.indexOf(name) !== -1) {
					var match = data.value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
					if (match) {
						data.value = match[1] + match[2] + match[3];
					}
				}

				return data;
			},

			formatDateForDisplay: function(name, data) {
				if (_.isUndefined(data) || _.isUndefined(data.value)) {
					return data;
				}
				if (this.dateProperties.indexOf(name) !== -1) {
					var match = data.value.match(/^(\d{4})(\d{2})(\d{2})$/);
					if (match) {
						data.value = match[1] + '-' + match[2] + '-' + match[3];
					}
				}

				return data;
			},

			getProperty: function(name) {
				if (this.props[name]) {
					return this.formatDateForDisplay(name, this.props[name][0]);
				} else {
					return undefined;
				}
			},
			addProperty: function(name, data) {
				data = angular.copy(data);
				data = this.formatDateAsRFC6350(name, data);
				if(!this.props[name]) {
					this.props[name] = [];
				}
				var idx = this.props[name].length;
				this.props[name][idx] = data;

				this.setPropsForDisplay();

				// keep vCard in sync
				this.data.addressData = $filter('JSON2vCard')(this.props);
				return idx;
			},
			setProperty: function(name, data) {
				if(!this.props[name]) {
					this.props[name] = [];
				}
				data = this.formatDateAsRFC6350(name, data);
				this.props[name][0] = data;

				// keep vCard in sync
				this.data.addressData = $filter('JSON2vCard')(this.props);
			},
			removeProperty: function (name, prop) {
				angular.copy(_.without(this.props[name], prop), this.props[name]);
				this.data.addressData = $filter('JSON2vCard')(this.props);
				this.setPropsForDisplay();
			},
			setETag: function(etag) {
				this.data.etag = etag;
			},
			setUrl: function(addressBook, uid) {
				this.data.url = addressBook.url + uid + '.vcf';
			},

			getISODate: function(date) {
				function pad(number) {
					if (number < 10) {
						return '0' + number;
					}
					return '' + number;
				}

				return date.getUTCFullYear() + '' +
						pad(date.getUTCMonth() + 1) +
						pad(date.getUTCDate()) +
						'T' + pad(date.getUTCHours()) +
						pad(date.getUTCMinutes()) +
						pad(date.getUTCSeconds()) + 'Z';
			},

			syncVCard: function() {

				this.setProperty('rev', { value: this.getISODate(new Date()) });
				var self = this;

				_.each(this.dateProperties, function(name) {
					if (!_.isUndefined(self.props[name]) && !_.isUndefined(self.props[name][0])) {
						// Set dates again to make sure they are in RFC-6350 format
						self.setProperty(name, self.props[name][0]);
					}
				});
				// force fn to be set
				this.fullName(this.fullName());

				// keep vCard in sync
				self.data.addressData = $filter('JSON2vCard')(self.props);
			},

			matches: function(pattern) {
				if (_.isUndefined(pattern) || pattern.length === 0) {
					return true;
				}
				var model = this;
				var matchingProps = ['fn', 'title', 'org', 'email', 'nickname', 'note', 'url', 'cloud', 'adr', 'impp', 'tel'].filter(function (propName) {
					if (model.props[propName]) {
						return model.props[propName].filter(function (property) {
							if (!property.value) {
								return false;
							}
							if (_.isString(property.value)) {
								return property.value.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
							}
							if (_.isArray(property.value)) {
								return property.value.filter(function(v) {
									return v.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
								}).length > 0;
							}
							return false;
						}).length > 0;
					}
					return false;
				});
				return matchingProps.length > 0;
			},

			setPropsForDisplay: function() {
				angular.extend(this.nonAddresses, this.props);
				delete(this.nonAddresses.adr);
				this.addresses.adr = this.props.adr;
			}

		});

		if(angular.isDefined(vCard)) {
			angular.extend(this.data, vCard);
			angular.extend(this.props, $filter('vCard2JSON')(this.data.addressData));
		} else {
			angular.extend(this.props, {
				version: [{value: '3.0'}],
				fn: [{value: ''}]
			});
			this.data.addressData = $filter('JSON2vCard')(this.props);
		}

		var property = this.getProperty('categories');
		if(!property) {
			this.categories('');
		} else {
			if (angular.isString(property.value)) {
				this.categories([property.value]);
			}
		}

		this.setPropsForDisplay();

	};
}]);

angular.module('contactsApp')
.factory('AddressBookService', ['DavClient', 'DavService', 'SettingsService', 'AddressBook', '$q', function(DavClient, DavService, SettingsService, AddressBook, $q) {

	var addressBooks = [];
	var loadPromise = undefined;

	var loadAll = function() {
		if (addressBooks.length > 0) {
			return $q.when(addressBooks);
		}
		if (_.isUndefined(loadPromise)) {
			loadPromise = DavService.then(function(account) {
				loadPromise = undefined;
				addressBooks = account.addressBooks.map(function(addressBook) {
					return new AddressBook(addressBook);
				});
			});
		}
		return loadPromise;
	};

	return {
		getAll: function() {
			return loadAll().then(function() {
				return addressBooks;
			});
		},

		getGroups: function () {
			return this.getAll().then(function(addressBooks) {
				return addressBooks.map(function (element) {
					return element.groups;
				}).reduce(function(a, b) {
					return a.concat(b);
				});
			});
		},

		getDefaultAddressBook: function() {
			return addressBooks[0];
		},

		getAddressBook: function(displayName) {
			return DavService.then(function(account) {
				return DavClient.getAddressBook({displayName:displayName, url:account.homeUrl}).then(function(addressBook) {
					addressBook = new AddressBook({
						url: account.homeUrl+displayName+'/',
						data: addressBook[0]
					});
					addressBook.displayName = displayName;
					return addressBook;
				});
			});
		},

		create: function(displayName) {
			return DavService.then(function(account) {
				return DavClient.createAddressBook({displayName:displayName, url:account.homeUrl});
			});
		},

		delete: function(addressBook) {
			return DavService.then(function() {
				return DavClient.deleteAddressBook(addressBook).then(function() {
					var index = addressBooks.indexOf(addressBook);
					addressBooks.splice(index, 1);
				});
			});
		},

		rename: function(addressBook, displayName) {
			return DavService.then(function(account) {
				return DavClient.renameAddressBook(addressBook, {displayName:displayName, url:account.homeUrl});
			});
		},

		get: function(displayName) {
			return this.getAll().then(function(addressBooks) {
				return addressBooks.filter(function (element) {
					return element.displayName === displayName;
				})[0];
			});
		},

		sync: function(addressBook) {
			return DavClient.syncAddressBook(addressBook);
		},

		share: function(addressBook, shareType, shareWith, writable, existingShare) {
			var xmlDoc = document.implementation.createDocument('', '', null);
			var oShare = xmlDoc.createElement('o:share');
			oShare.setAttribute('xmlns:d', 'DAV:');
			oShare.setAttribute('xmlns:o', 'http://owncloud.org/ns');
			xmlDoc.appendChild(oShare);

			var oSet = xmlDoc.createElement('o:set');
			oShare.appendChild(oSet);

			var dHref = xmlDoc.createElement('d:href');
			if (shareType === OC.Share.SHARE_TYPE_USER) {
				dHref.textContent = 'principal:principals/users/';
			} else if (shareType === OC.Share.SHARE_TYPE_GROUP) {
				dHref.textContent = 'principal:principals/groups/';
			}
			dHref.textContent += shareWith;
			oSet.appendChild(dHref);

			var oSummary = xmlDoc.createElement('o:summary');
			oSummary.textContent = t('contacts', '{addressbook} shared by {owner}', {
				addressbook: addressBook.displayName,
				owner: addressBook.owner
			});
			oSet.appendChild(oSummary);

			if (writable) {
				var oRW = xmlDoc.createElement('o:read-write');
				oSet.appendChild(oRW);
			}

			var body = oShare.outerHTML;

			return DavClient.xhr.send(
				dav.request.basic({method: 'POST', data: body}),
				addressBook.url
			).then(function(response) {
				if (response.status === 200) {
					if (!existingShare) {
						if (shareType === OC.Share.SHARE_TYPE_USER) {
							addressBook.sharedWith.users.push({
								id: shareWith,
								displayname: shareWith,
								writable: writable
							});
						} else if (shareType === OC.Share.SHARE_TYPE_GROUP) {
							addressBook.sharedWith.groups.push({
								id: shareWith,
								displayname: shareWith,
								writable: writable
							});
						}
					}
				}
			});

		},

		unshare: function(addressBook, shareType, shareWith) {
			var xmlDoc = document.implementation.createDocument('', '', null);
			var oShare = xmlDoc.createElement('o:share');
			oShare.setAttribute('xmlns:d', 'DAV:');
			oShare.setAttribute('xmlns:o', 'http://owncloud.org/ns');
			xmlDoc.appendChild(oShare);

			var oRemove = xmlDoc.createElement('o:remove');
			oShare.appendChild(oRemove);

			var dHref = xmlDoc.createElement('d:href');
			if (shareType === OC.Share.SHARE_TYPE_USER) {
				dHref.textContent = 'principal:principals/users/';
			} else if (shareType === OC.Share.SHARE_TYPE_GROUP) {
				dHref.textContent = 'principal:principals/groups/';
			}
			dHref.textContent += shareWith;
			oRemove.appendChild(dHref);
			var body = oShare.outerHTML;


			return DavClient.xhr.send(
				dav.request.basic({method: 'POST', data: body}),
				addressBook.url
			).then(function(response) {
				if (response.status === 200) {
					if (shareType === OC.Share.SHARE_TYPE_USER) {
						addressBook.sharedWith.users = addressBook.sharedWith.users.filter(function(user) {
							return user.id !== shareWith;
						});
					} else if (shareType === OC.Share.SHARE_TYPE_GROUP) {
						addressBook.sharedWith.groups = addressBook.sharedWith.groups.filter(function(groups) {
							return groups.id !== shareWith;
						});
					}
					//todo - remove entry from addressbook object
					return true;
				} else {
					return false;
				}
			});

		}


	};

}]);

angular.module('contactsApp')
.service('ContactService', ['DavClient', 'AddressBookService', 'Contact', '$q', 'CacheFactory', 'uuid4', function(DavClient, AddressBookService, Contact, $q, CacheFactory, uuid4) {

	var cacheFilled = false;

	var contacts = CacheFactory('contacts');

	var observerCallbacks = [];

	var loadPromise = undefined;

	this.registerObserverCallback = function(callback) {
		observerCallbacks.push(callback);
	};

	var notifyObservers = function(eventName, uid) {
		var ev = {
			event: eventName,
			uid: uid,
			contacts: contacts.values()
		};
		angular.forEach(observerCallbacks, function(callback) {
			callback(ev);
		});
	};

	this.fillCache = function() {
		if (_.isUndefined(loadPromise)) {
			loadPromise = AddressBookService.getAll().then(function (enabledAddressBooks) {
				var promises = [];
				enabledAddressBooks.forEach(function (addressBook) {
					promises.push(
						AddressBookService.sync(addressBook).then(function (addressBook) {
							for (var i in addressBook.objects) {
								if (addressBook.objects[i].addressData) {
									var contact = new Contact(addressBook, addressBook.objects[i]);
									contacts.put(contact.uid(), contact);
								} else {
									// custom console
									console.log('Invalid contact received: ' + addressBook.objects[i].url);
								}
							}
						})
					);
				});
				return $q.all(promises).then(function () {
					cacheFilled = true;
				});
			});
		}
		return loadPromise;
	};

	this.getAll = function() {
		if(cacheFilled === false) {
			return this.fillCache().then(function() {
				return contacts.values();
			});
		} else {
			return $q.when(contacts.values());
		}
	};

	this.getGroups = function () {
		return this.getAll().then(function(contacts) {
			return _.uniq(contacts.map(function (element) {
				return element.categories();
			}).reduce(function(a, b) {
				return a.concat(b);
			}, []).sort(), true);
		});
	};

	this.getById = function(uid) {
		if(cacheFilled === false) {
			return this.fillCache().then(function() {
				return contacts.get(uid);
			});
		} else {
			return $q.when(contacts.get(uid));
		}
	};

	this.create = function(newContact, addressBook, uid) {
		addressBook = addressBook || AddressBookService.getDefaultAddressBook();
		newContact = newContact || new Contact(addressBook);
		var newUid = '';
		if(uuid4.validate(uid)) {
			newUid = uid;
		} else {
			newUid = uuid4.generate();
		}
		newContact.uid(newUid);
		newContact.setUrl(addressBook, newUid);
		newContact.addressBookId = addressBook.displayName;
		if (_.isUndefined(newContact.fullName()) || newContact.fullName() === '') {
			newContact.fullName(t('contacts', 'New contact'));
		}

		return DavClient.createCard(
			addressBook,
			{
				data: newContact.data.addressData,
				filename: newUid + '.vcf'
			}
		).then(function(xhr) {
			newContact.setETag(xhr.getResponseHeader('ETag'));
			contacts.put(newUid, newContact);
			notifyObservers('create', newUid);
			$('#details-fullName').select();
			return newContact;
		}).catch(function(xhr) {
			var msg = t('contacts', 'Contact could not be created.');
			if (!angular.isUndefined(xhr) && !angular.isUndefined(xhr.responseXML) && !angular.isUndefined(xhr.responseXML.getElementsByTagNameNS('http://sabredav.org/ns', 'message'))) {
				if ($(xhr.responseXML.getElementsByTagNameNS('http://sabredav.org/ns', 'message')).text()) {
					msg = $(xhr.responseXML.getElementsByTagNameNS('http://sabredav.org/ns', 'message')).text();
				}
			}

			OC.Notification.showTemporary(msg);
		});
	};

	this.import = function(data, type, addressBook, progressCallback) {
		addressBook = addressBook || AddressBookService.getDefaultAddressBook();

		var regexp = /BEGIN:VCARD[\s\S]*?END:VCARD/mgi;
		var singleVCards = data.match(regexp);

		if (!singleVCards) {
			OC.Notification.showTemporary(t('contacts', 'No contacts in file. Only vCard files are allowed.'));
			if (progressCallback) {
				progressCallback(1);
			}
			return;
		}
		var num = 1;
		for(var i in singleVCards) {
			var newContact = new Contact(addressBook, {addressData: singleVCards[i]});
			if (['3.0', '4.0'].indexOf(newContact.version()) < 0) {
				if (progressCallback) {
					progressCallback(num / singleVCards.length);
				}
				OC.Notification.showTemporary(t('contacts', 'Only vCard version 4.0 (RFC6350) or version 3.0 (RFC2426) are supported.'));
				num++;
				continue;
			}
			this.create(newContact, addressBook).then(function() {
				// Update the progress indicator
				if (progressCallback) {
					progressCallback(num / singleVCards.length);
				}
				num++;
			});
		}
	};

	this.moveContact = function (contact, addressbook) {
		if (contact.addressBookId === addressbook.displayName) {
			return;
		}
		contact.syncVCard();
		var clone = angular.copy(contact);
		var uid = contact.uid();

		// delete the old one before to avoid conflict
		this.delete(contact);

		// create the contact in the new target addressbook
		this.create(clone, addressbook, uid);
	};

	this.update = function(contact) {
		// update rev field
		contact.syncVCard();

		// update contact on server
		return DavClient.updateCard(contact.data, {json: true}).then(function(xhr) {
			var newEtag = xhr.getResponseHeader('ETag');
			contact.setETag(newEtag);
			notifyObservers('update', contact.uid());
		});
	};

	this.delete = function(contact) {
		// delete contact from server
		return DavClient.deleteCard(contact.data).then(function() {
			contacts.remove(contact.uid());
			notifyObservers('delete', contact.uid());
		});
	};
}]);

angular.module('contactsApp')
.service('DavClient', function() {
	var xhr = new dav.transport.Basic(
		new dav.Credentials()
	);
	return new dav.Client(xhr);
});

angular.module('contactsApp')
.service('DavService', ['DavClient', function(DavClient) {
	return DavClient.createAccount({
		server: OC.linkToRemote('dav/addressbooks'),
		accountType: 'carddav',
		useProvidedPath: true
	});
}]);

angular.module('contactsApp')
.service('SearchService', function() {
	var searchTerm = '';

	var observerCallbacks = [];

	this.registerObserverCallback = function(callback) {
		observerCallbacks.push(callback);
	};

	var notifyObservers = function(eventName) {
		var ev = {
			event:eventName,
			searchTerm:searchTerm
		};
		angular.forEach(observerCallbacks, function(callback) {
			callback(ev);
		});
	};

	var SearchProxy = {
		attach: function(search) {
			search.setFilter('contacts', this.filterProxy);
		},
		filterProxy: function(query) {
			searchTerm = query;
			notifyObservers('changeSearch');
		}
	};

	this.getSearchTerm = function() {
		return searchTerm;
	};

	this.cleanSearch = function() {
		if (!_.isUndefined($('.searchbox'))) {
			$('.searchbox')[0].reset();
		}
		searchTerm = '';
	};

	if (!_.isUndefined(OC.Plugins)) {
		OC.Plugins.register('OCA.Search', SearchProxy);
		if (!_.isUndefined(OCA.Search)) {
			OC.Search = new OCA.Search($('#searchbox'), $('#searchresults'));
			$('#searchbox').show();
		}
	}

	if (!_.isUndefined($('.searchbox'))) {
		$('.searchbox')[0].addEventListener('keypress', function(e) {
			if(e.keyCode === 13) {
				notifyObservers('submitSearch');
			}
		});
	}
});

angular.module('contactsApp')
.service('SettingsService', function() {
	var subscriptions = [];
	var settings = {
		addressBooks: [
			'testAddr'
		],
		phoneticEnable: false,
		reverseNameOrder: false,
	};

	Object.assign(settings, JSON.parse(window.localStorage.getItem('contacts_settings')));

	function notifyObservers () {
		angular.forEach(subscriptions, function (subscription) {
			if (typeof subscription === 'function') {
				subscription();
			}
		});
	}

	this.set = function(key, value) {
		settings[key] = value;
		window.localStorage.setItem('contacts_settings', JSON.stringify(settings));
		notifyObservers();
	};

	this.get = function(key) {
		return settings[key];
	};

	this.getAll = function() {
		return settings;
	};

	this.subscribe = function (callback) {
		subscriptions.push (callback);
	};
});

angular.module('contactsApp')
.service('SortByService', function () {
	var subscriptions = [];
	var sortBy = 'sortDisplayName';

	var defaultOrder = window.localStorage.getItem('contacts_default_order');
	if (defaultOrder) {
		sortBy = defaultOrder;
	}

	function notifyObservers () {
		angular.forEach(subscriptions, function (subscription) {
			if (typeof subscription === 'function') {
				subscription(sortBy);
			}
		});
	}

	return {
		subscribe: function (callback) {
			subscriptions.push (callback);
		},
		setSortBy: function (value) {
			sortBy = value;
			window.localStorage.setItem ('contacts_default_order', value);
			notifyObservers ();
		},
		getSortBy: function () {
			return sortBy;
		},
		getSortByList: function () {
			return {
				sortDisplayName: t('contacts', 'Display name'),
				sortFirstName: t('contacts', 'First name'),
				sortLastName: t('contacts', 'Last name'),
				sortPhoneticFirstName: t('contacts', 'Phonetic first name'),
				sortPhoneticLastName: t('contacts', 'Phonetic last name'),
			};
		}
	};
});

angular.module('contactsApp')
.service('vCardPropertiesService', function() {
	/**
	 * map vCard attributes to internal attributes
	 *
	 * propName: {
	 * 		multiple: [Boolean], // is this prop allowed more than once? (default = false)
	 * 		readableName: [String], // internationalized readable name of prop
	 * 		template: [String], // template name found in /templates/detailItems
	 * 		[...] // optional additional information which might get used by the template
	 * }
	 */
	this.vCardMeta = {
		nickname: {
			readableName: t('contacts', 'Nickname'),
			template: 'text'
		},
		n: {
			readableName: t('contacts', 'Detailed name'),
			defaultValue: {
				value:['', '', '', '', '']
			},
			template: 'n'
		},
		note: {
			readableName: t('contacts', 'Notes'),
			template: 'textarea'
		},
		url: {
			multiple: true,
			readableName: t('contacts', 'Website'),
			template: 'url'
		},
		cloud: {
			multiple: true,
			readableName: t('contacts', 'Federated Cloud ID'),
			template: 'text',
			defaultValue: {
				value:[''],
				meta:{type:['HOME']}
			},
			options: [
				{id: 'HOME', name: t('contacts', 'Home')},
				{id: 'WORK', name: t('contacts', 'Work')},
				{id: 'OTHER', name: t('contacts', 'Other')}
			]		},
		adr: {
			multiple: true,
			readableName: t('contacts', 'Address'),
			template: 'adr',
			defaultValue: {
				value:['', '', '', '', '', '', ''],
				meta:{type:['HOME']}
			},
			options: [
				{id: 'HOME', name: t('contacts', 'Home')},
				{id: 'WORK', name: t('contacts', 'Work')},
				{id: 'OTHER', name: t('contacts', 'Other')}
			]
		},
		categories: {
			readableName: t('contacts', 'Groups'),
			template: 'groups'
		},
		bday: {
			readableName: t('contacts', 'Birthday'),
			template: 'date'
		},
		anniversary: {
			readableName: t('contacts', 'Anniversary'),
			template: 'date'
		},
		deathdate: {
			readableName: t('contacts', 'Date of death'),
			template: 'date'
		},
		email: {
			multiple: true,
			readableName: t('contacts', 'Email'),
			template: 'email',
			defaultValue: {
				value:'',
				meta:{type:['HOME']}
			},
			options: [
				{id: 'HOME', name: t('contacts', 'Home')},
				{id: 'WORK', name: t('contacts', 'Work')},
				{id: 'OTHER', name: t('contacts', 'Other')}
			]
		},
		impp: {
			multiple: true,
			readableName: t('contacts', 'Instant messaging'),
			template: 'username',
			defaultValue: {
				value:[''],
				meta:{type:['SKYPE']}
			},
			options: [
				{id: 'IRC', name:  'IRC'},
				{id: 'SKYPE', name:'Skype'},
				{id: 'TELEGRAM', name:'Telegram'}
			]
		},
		tel: {
			multiple: true,
			readableName: t('contacts', 'Phone'),
			template: 'tel',
			defaultValue: {
				value:[''],
				meta:{type:['HOME,VOICE']}
			},
			options: [
				{id: 'HOME,VOICE', name: t('contacts', 'Home')},
				{id: 'WORK,VOICE', name: t('contacts', 'Work')},
				{id: 'CELL', name: t('contacts', 'Mobile')},
				{id: 'FAX', name: t('contacts', 'Fax')},
				{id: 'HOME,FAX', name: t('contacts', 'Fax home')},
				{id: 'WORK,FAX', name: t('contacts', 'Fax work')},
				{id: 'PAGER', name: t('contacts', 'Pager')},
				{id: 'VOICE', name: t('contacts', 'Voice')}
			]
		},
		'X-SOCIALPROFILE': {
			multiple: true,
			readableName: t('contacts', 'Social network'),
			template: 'username',
			defaultValue: {
				value:[''],
				meta:{type:['facebook']}
			},
			options: [
				{id: 'FACEBOOK', name: 'Facebook'},
				{id: 'GOOGLEPLUS', name: 'Google+'},
				{id: 'INSTAGRAM', name: 'Instagram'},
				{id: 'LINKEDIN', name: 'LinkedIn'},
				{id: 'PINTEREST', name: 'Pinterest'},
				{id: 'TWITTER', name: 'Twitter'}

			]

		}
	};

	this.fieldOrder = [
		'org',
		'title',
		'tel',
		'email',
		'adr',
		'impp',
		'nick',
		'bday',
		'anniversary',
		'deathdate',
		'url',
		'X-SOCIALPROFILE',
		'note',
		'categories',
		'role'
	];

	this.fieldDefinitions = [];
	for (var prop in this.vCardMeta) {
		this.fieldDefinitions.push({id: prop, name: this.vCardMeta[prop].readableName, multiple: !!this.vCardMeta[prop].multiple});
	}

	this.fallbackMeta = function(property) {
		function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
		return {
			name: 'unknown-' + property,
			readableName: capitalize(property),
			template: 'hidden',
			necessity: 'optional'
		};
	};

	this.getMeta = function(property) {
		return this.vCardMeta[property] || this.fallbackMeta(property);
	};

});

angular.module('contactsApp')
.filter('JSON2vCard', function() {
	return function(input) {
		return vCard.generate(input);
	};
});

angular.module('contactsApp')
.filter('contactColor', function() {
	return function(input) {
		// Check if core has the new color generator
		if(typeof input.toHsl === 'function') {
			var hsl = input.toHsl();
			return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';
		} else {
			// If not, we use the old one
			/* global md5 */
			var hash = md5(input).substring(0, 4),
				maxRange = parseInt('ffff', 16),
				hue = parseInt(hash, 16) / maxRange * 256;
			return 'hsl(' + hue + ', 90%, 65%)';
		}
	};
});
angular.module('contactsApp')
.filter('contactGroupFilter', function() {
	'use strict';
	return function (contacts, group) {
		if (typeof contacts === 'undefined') {
			return contacts;
		}
		if (typeof group === 'undefined' || group.toLowerCase() === t('contacts', 'All contacts').toLowerCase()) {
			return contacts;
		}
		var filter = [];
		if (contacts.length > 0) {
			for (var i = 0; i < contacts.length; i++) {
				if (group.toLowerCase() === t('contacts', 'Not grouped').toLowerCase()) {
					if (contacts[i].categories().length === 0) {
						filter.push(contacts[i]);
					}
				} else {
					if (contacts[i].categories().indexOf(group) >= 0) {
						filter.push(contacts[i]);
					}
				}
			}
		}
		return filter;
	};
});

angular.module('contactsApp')
.filter('fieldFilter', function() {
	'use strict';
	return function (fields, contact) {
		if (typeof fields === 'undefined') {
			return fields;
		}
		if (typeof contact === 'undefined') {
			return fields;
		}
		var filter = [];
		if (fields.length > 0) {
			for (var i = 0; i < fields.length; i++) {
				if (fields[i].multiple ) {
					filter.push(fields[i]);
					continue;
				}
				if (_.isUndefined(contact.getProperty(fields[i].id))) {
					filter.push(fields[i]);
				}
			}
		}
		return filter;
	};
});

angular.module('contactsApp')
.filter('firstCharacter', function() {
	return function(input) {
		return input.charAt(0);
	};
});

angular.module('contactsApp')
.filter('localeOrderBy', [function () {
	return function (array, sortPredicate, reverseOrder) {
		if (!Array.isArray(array)) return array;
		if (!sortPredicate) return array;

		var arrayCopy = [];
		angular.forEach(array, function (item) {
			arrayCopy.push(item);
		});

		arrayCopy.sort(function (a, b) {
			var valueA = a[sortPredicate];
			if (angular.isFunction(valueA)) {
				valueA = a[sortPredicate]();
			}
			var valueB = b[sortPredicate];
			if (angular.isFunction(valueB)) {
				valueB = b[sortPredicate]();
			}

			if (angular.isString(valueA)) {
				return !reverseOrder ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
			}

			if (angular.isNumber(valueA) || typeof valueA === 'boolean') {
				return !reverseOrder ? valueA - valueB : valueB - valueA;
			}

			if (angular.isArray(valueA)) {
				if (valueA[0] === valueB[0]) {
					return !reverseOrder ? valueA[1].localeCompare(valueB[1]) : valueB[1].localeCompare(valueA[1]);
				}
				return !reverseOrder ? valueA[0].localeCompare(valueB[0]) : valueB[0].localeCompare(valueA[0]);
			}

			return 0;
		});

		return arrayCopy;
	};
}]);

angular.module('contactsApp')
.filter('newContact', function() {
	return function(input) {
		return input !== '' ? input : t('contacts', 'New contact');
	};
});

angular.module('contactsApp')
.filter('orderDetailItems', ['vCardPropertiesService', function(vCardPropertiesService) {
	'use strict';
	return function(items, field, reverse) {

		var filtered = [];
		angular.forEach(items, function(item) {
			filtered.push(item);
		});

		var fieldOrder = angular.copy(vCardPropertiesService.fieldOrder);
		// reverse to move custom items to the end (indexOf == -1)
		fieldOrder.reverse();

		filtered.sort(function (a, b) {
			if(fieldOrder.indexOf(a[field]) < fieldOrder.indexOf(b[field])) {
				return 1;
			}
			if(fieldOrder.indexOf(a[field]) > fieldOrder.indexOf(b[field])) {
				return -1;
			}
			return 0;
		});

		if(reverse) filtered.reverse();
		return filtered;
	};
}]);

angular.module('contactsApp')
.filter('toArray', function() {
	return function(obj) {
		if (!(obj instanceof Object)) return obj;
		return _.map(obj, function(val, key) {
			if (angular.isUndefined(val)) return val;
			return Object.defineProperty(val, '$key', {value: key});
		});
	};
});

angular.module('contactsApp')
.filter('vCard2JSON', function() {
	return function(input) {
		return vCard.parse(input);
	};
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJkYXRlcGlja2VyX2RpcmVjdGl2ZS5qcyIsImZvY3VzX2RpcmVjdGl2ZS5qcyIsImlucHV0cmVzaXplX2RpcmVjdGl2ZS5qcyIsIk9wdGlvbnMvT3B0aW9uc19jb250cm9sbGVyLmpzIiwiT3B0aW9ucy9PcHRpb25zX2RpcmVjdGl2ZS5qcyIsImFkZHJlc3NCb29rL2FkZHJlc3NCb29rX2NvbnRyb2xsZXIuanMiLCJhZGRyZXNzQm9vay9hZGRyZXNzQm9va19kaXJlY3RpdmUuanMiLCJhZGRyZXNzQm9va0xpc3QvYWRkcmVzc0Jvb2tMaXN0X2NvbnRyb2xsZXIuanMiLCJhZGRyZXNzQm9va0xpc3QvYWRkcmVzc0Jvb2tMaXN0X2RpcmVjdGl2ZS5qcyIsImF2YXRhci9hdmF0YXJfY29udHJvbGxlci5qcyIsImF2YXRhci9hdmF0YXJfZGlyZWN0aXZlLmpzIiwiY29udGFjdC9jb250YWN0X2NvbnRyb2xsZXIuanMiLCJjb250YWN0L2NvbnRhY3RfZGlyZWN0aXZlLmpzIiwiY29udGFjdERldGFpbHMvY29udGFjdERldGFpbHNfY29udHJvbGxlci5qcyIsImNvbnRhY3REZXRhaWxzL2NvbnRhY3REZXRhaWxzX2RpcmVjdGl2ZS5qcyIsImNvbnRhY3RJbXBvcnQvY29udGFjdEltcG9ydF9jb250cm9sbGVyLmpzIiwiY29udGFjdEltcG9ydC9jb250YWN0SW1wb3J0X2RpcmVjdGl2ZS5qcyIsImNvbnRhY3RMaXN0L2NvbnRhY3RMaXN0X2NvbnRyb2xsZXIuanMiLCJjb250YWN0TGlzdC9jb250YWN0TGlzdF9kaXJlY3RpdmUuanMiLCJkZXRhaWxzSXRlbS9kZXRhaWxzSXRlbV9jb250cm9sbGVyLmpzIiwiZGV0YWlsc0l0ZW0vZGV0YWlsc0l0ZW1fZGlyZWN0aXZlLmpzIiwiZ3JvdXAvZ3JvdXBfY29udHJvbGxlci5qcyIsImdyb3VwL2dyb3VwX2RpcmVjdGl2ZS5qcyIsImdyb3VwTGlzdC9ncm91cExpc3RfY29udHJvbGxlci5qcyIsImdyb3VwTGlzdC9ncm91cExpc3RfZGlyZWN0aXZlLmpzIiwibmV3Q29udGFjdEJ1dHRvbi9uZXdDb250YWN0QnV0dG9uX2NvbnRyb2xsZXIuanMiLCJuZXdDb250YWN0QnV0dG9uL25ld0NvbnRhY3RCdXR0b25fZGlyZWN0aXZlLmpzIiwicGFyc2Vycy90ZWxNb2RlbF9kaXJlY3RpdmUuanMiLCJzb3J0Qnkvc29ydEJ5X2NvbnRyb2xsZXIuanMiLCJzb3J0Qnkvc29ydEJ5X2RpcmVjdGl2ZS5qcyIsImFkZHJlc3NCb29rX21vZGVsLmpzIiwiY29udGFjdF9tb2RlbC5qcyIsImFkZHJlc3NCb29rX3NlcnZpY2UuanMiLCJjb250YWN0X3NlcnZpY2UuanMiLCJkYXZDbGllbnRfc2VydmljZS5qcyIsImRhdl9zZXJ2aWNlLmpzIiwic2VhcmNoX3NlcnZpY2UuanMiLCJzZXR0aW5nc19zZXJ2aWNlLmpzIiwic29ydEJ5X3NlcnZpY2UuanMiLCJ2Q2FyZFByb3BlcnRpZXMuanMiLCJKU09OMnZDYXJkX2ZpbHRlci5qcyIsImNvbnRhY3RDb2xvcl9maWx0ZXIuanMiLCJjb250YWN0R3JvdXBfZmlsdGVyLmpzIiwiZmllbGRfZmlsdGVyLmpzIiwiZmlyc3RDaGFyYWN0ZXJfZmlsdGVyLmpzIiwibG9jYWxlT3JkZXJCeV9maWx0ZXIuanMiLCJuZXdDb250YWN0X2ZpbHRlci5qcyIsIm9yZGVyRGV0YWlsSXRlbXNfZmlsdGVyLmpzIiwidG9BcnJheV9maWx0ZXIuanMiLCJ2Q2FyZDJKU09OX2ZpbHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQVVBLFFBQVEsT0FBTyxlQUFlLENBQUMsU0FBUyxpQkFBaUIsV0FBVyxnQkFBZ0IsYUFBYSxjQUFjO0NBQzlHLDBCQUFPLFNBQVMsZ0JBQWdCOztDQUVoQyxlQUFlLEtBQUssU0FBUztFQUM1QixVQUFVOzs7Q0FHWCxlQUFlLEtBQUssY0FBYztFQUNqQyxVQUFVOzs7Q0FHWCxlQUFlLFVBQVUsTUFBTSxFQUFFLFlBQVk7Ozs7QUFJOUMsUUFB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S0FBSzs7O0VBR2YsSUFBSSxhQUFhLFFBQVEsS0FBSyx1QkFBdUI7O0VBRXJELFdBQVc7O0VBRVgsU0FBUyxLQUFLLFVBQVUsR0FBRyxHQUFHO0dBQzdCLEdBQUcsV0FBVyxRQUFRLEVBQUUsVUFBVSxXQUFXLFFBQVEsRUFBRSxTQUFTO0lBQy9ELE9BQU87O0dBRVIsR0FBRyxXQUFXLFFBQVEsRUFBRSxVQUFVLFdBQVcsUUFBUSxFQUFFLFNBQVM7SUFDL0QsT0FBTyxDQUFDOztHQUVULE9BQU87OztFQUdSLEdBQUcsU0FBUyxTQUFTO0VBQ3JCLE9BQU87OztBQUdUO0FDNUJBLFFBQVEsT0FBTztDQUNkLE9BQU8sV0FBVyxXQUFXO0NBQzdCLE9BQU8sU0FBUyxLQUFLO0VBQ3BCLElBQUksRUFBRSxlQUFlLFNBQVMsT0FBTztFQUNyQyxPQUFPLEVBQUUsSUFBSSxLQUFLLFNBQVMsS0FBSyxLQUFLO0dBQ3BDLElBQUksUUFBUSxZQUFZLE1BQU0sT0FBTztHQUNyQyxPQUFPLE9BQU8sZUFBZSxLQUFLLFFBQVEsQ0FBQyxPQUFPOzs7O0FBSXJEO0FDVkEsUUFBUSxPQUFPO0NBQ2QsT0FBTyxjQUFjLFdBQVc7Q0FDaEMsT0FBTyxTQUFTLE9BQU87RUFDdEIsT0FBTyxNQUFNLE1BQU07OztBQUdyQiIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIG93bkNsb3VkIC0gY29udGFjdHNcbiAqXG4gKiBUaGlzIGZpbGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBvclxuICogbGF0ZXIuIFNlZSB0aGUgQ09QWUlORyBmaWxlLlxuICpcbiAqIEBhdXRob3IgSGVuZHJpayBMZXBwZWxzYWNrIDxoZW5kcmlrQGxlcHBlbHNhY2suZGU+XG4gKiBAY29weXJpZ2h0IEhlbmRyaWsgTGVwcGVsc2FjayAyMDE1XG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJywgWyd1dWlkNCcsICdhbmd1bGFyLWNhY2hlJywgJ25nUm91dGUnLCAndWkuYm9vdHN0cmFwJywgJ3VpLnNlbGVjdCcsICduZ1Nhbml0aXplJywgJ25nY2xpcGJvYXJkJ10pXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG5cblx0JHJvdXRlUHJvdmlkZXIud2hlbignLzpnaWQnLCB7XG5cdFx0dGVtcGxhdGU6ICc8Y29udGFjdGRldGFpbHM+PC9jb250YWN0ZGV0YWlscz4nXG5cdH0pO1xuXG5cdCRyb3V0ZVByb3ZpZGVyLndoZW4oJy86Z2lkLzp1aWQnLCB7XG5cdFx0dGVtcGxhdGU6ICc8Y29udGFjdGRldGFpbHM+PC9jb250YWN0ZGV0YWlscz4nXG5cdH0pO1xuXG5cdCRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSgnLycgKyB0KCdjb250YWN0cycsICdBbGwgY29udGFjdHMnKSk7XG5cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnb25Ub2dnbGVTaG93JywgWyckZG9jdW1lbnQnLCBmdW5jdGlvbigkZG9jdW1lbnQpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdBJyxcblx0XHRzY29wZToge1xuXHRcdFx0J29uVG9nZ2xlU2hvdyc6ICdAJ1xuXHRcdH0sXG5cdFx0bGluazogZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbSkge1xuXHRcdFx0ZWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSAkKHNjb3BlLm9uVG9nZ2xlU2hvdyk7XG5cdFx0XHRcdHRhcmdldC50b2dnbGUoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkZG9jdW1lbnQuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdHZhciB0YXJnZXQgPSAkKHNjb3BlLm9uVG9nZ2xlU2hvdyk7XG5cblx0XHRcdFx0aWYgKGV2ZW50LnRhcmdldCAhPT0gZWxlbVswXSkge1xuXHRcdFx0XHRcdHRhcmdldC5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZGlyZWN0aXZlKCdkYXRlcGlja2VyJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdBJyxcblx0XHRyZXF1aXJlIDogJ25nTW9kZWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXHRcdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdFx0ZWxlbWVudC5kYXRlcGlja2VyKHtcblx0XHRcdFx0XHRkYXRlRm9ybWF0Oid5eS1tbS1kZCcsXG5cdFx0XHRcdFx0bWluRGF0ZTogbnVsbCxcblx0XHRcdFx0XHRtYXhEYXRlOiBudWxsLFxuXHRcdFx0XHRcdGNvbnN0cmFpbklucHV0OiBmYWxzZSxcblx0XHRcdFx0XHRvblNlbGVjdDpmdW5jdGlvbiAoZGF0ZSwgZHApIHtcblx0XHRcdFx0XHRcdGlmIChkcC5zZWxlY3RlZFllYXIgPCAxMDAwKSB7XG5cdFx0XHRcdFx0XHRcdGRhdGUgPSAnMCcgKyBkYXRlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGRwLnNlbGVjdGVkWWVhciA8IDEwMCkge1xuXHRcdFx0XHRcdFx0XHRkYXRlID0gJzAnICsgZGF0ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChkcC5zZWxlY3RlZFllYXIgPCAxMCkge1xuXHRcdFx0XHRcdFx0XHRkYXRlID0gJzAnICsgZGF0ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoZGF0ZSk7XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnZm9jdXNFeHByZXNzaW9uJywgZnVuY3Rpb24gKCR0aW1lb3V0KSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdBJyxcblx0XHRsaW5rOiB7XG5cdFx0XHRwb3N0OiBmdW5jdGlvbiBwb3N0TGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRcdFx0c2NvcGUuJHdhdGNoKGF0dHJzLmZvY3VzRXhwcmVzc2lvbiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChhdHRycy5mb2N1c0V4cHJlc3Npb24pIHtcblx0XHRcdFx0XHRcdGlmIChzY29wZS4kZXZhbChhdHRycy5mb2N1c0V4cHJlc3Npb24pKSB7XG5cdFx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZWxlbWVudC5pcygnaW5wdXQnKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmZpbmQoJ2lucHV0JykuZm9jdXMoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sIDEwMCk7IC8vbmVlZCBzb21lIGRlbGF5IHRvIHdvcmsgd2l0aCBuZy1kaXNhYmxlZFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnaW5wdXRyZXNpemUnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0EnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdHZhciBlbElucHV0ID0gZWxlbWVudC52YWwoKTtcblx0XHRcdGVsZW1lbnQuYmluZCgna2V5ZG93biBrZXl1cCBsb2FkIGZvY3VzJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGVsSW5wdXQgPSBlbGVtZW50LnZhbCgpO1xuXHRcdFx0XHQvLyBJZiBzZXQgdG8gMCwgdGhlIG1pbi13aWR0aCBjc3MgZGF0YSBpcyBpZ25vcmVkXG5cdFx0XHRcdHZhciBsZW5ndGggPSBlbElucHV0Lmxlbmd0aCA+IDEgPyBlbElucHV0Lmxlbmd0aCA6IDE7XG5cdFx0XHRcdGVsZW1lbnQuYXR0cignc2l6ZScsIGxlbmd0aCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uY29udHJvbGxlcignb3B0aW9uc0N0cmwnLCBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2UpIHtcblx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdGN0cmwudCA9IHtcblx0XHRwaG9uZXRpY1RleHQ6IHQoJ2NvbnRhY3RzJywgJ0VuYWJsZSBwaG9uZXRpYycpLFxuXHRcdHJldmVyc2VOYW1lT3JkZXJUZXh0OiB0KCdjb250YWN0cycsICdSZXZlcnNlIG5hbWUgb3JkZXInKSxcblx0fTtcblxuXHRjdHJsLnBob25ldGljRW5hYmxlID0gU2V0dGluZ3NTZXJ2aWNlLmdldCgncGhvbmV0aWNFbmFibGUnKTtcblx0Y3RybC5yZXZlcnNlTmFtZU9yZGVyID0gU2V0dGluZ3NTZXJ2aWNlLmdldCgncmV2ZXJzZU5hbWVPcmRlcicpO1xuXG5cdGN0cmwudXBkYXRlT3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdFNldHRpbmdzU2VydmljZS5zZXQoJ3Bob25ldGljRW5hYmxlJywgY3RybC5waG9uZXRpY0VuYWJsZSk7XG5cdFx0U2V0dGluZ3NTZXJ2aWNlLnNldCgncmV2ZXJzZU5hbWVPcmRlcicsIGN0cmwucmV2ZXJzZU5hbWVPcmRlcik7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZGlyZWN0aXZlKCdvcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cHJpb3JpdHk6IDEsXG5cdFx0c2NvcGU6IHt9LFxuXHRcdGNvbnRyb2xsZXI6ICdvcHRpb25zQ3RybCcsXG5cdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0YmluZFRvQ29udHJvbGxlcjoge30sXG5cdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnY29udGFjdHMnLCAndGVtcGxhdGVzL09wdGlvbnMuaHRtbCcpXG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uY29udHJvbGxlcignYWRkcmVzc2Jvb2tDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBBZGRyZXNzQm9va1NlcnZpY2UpIHtcblx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdGN0cmwudCA9IHtcblx0XHRjb3B5VXJsVGl0bGUgOiB0KCdjb250YWN0cycsICdDb3B5IFVybCB0byBjbGlwYm9hcmQnKSxcblx0XHRlZGl0OiB0KCdjb250YWN0cycsICdSZW5hbWUnKSxcblx0XHRkb3dubG9hZDogdCgnY29udGFjdHMnLCAnRG93bmxvYWQnKSxcblx0XHRzaG93VVJMOnQoJ2NvbnRhY3RzJywgJ0xpbmsnKSxcblx0XHRzaGFyZUFkZHJlc3Nib29rOiB0KCdjb250YWN0cycsICdTaGFyZScpLFxuXHRcdGRlbGV0ZUFkZHJlc3Nib29rOiB0KCdjb250YWN0cycsICdEZWxldGUnKSxcblx0XHRzaGFyZUlucHV0UGxhY2VIb2xkZXI6IHQoJ2NvbnRhY3RzJywgJ1NoYXJlIHdpdGggdXNlcnMgb3IgZ3JvdXBzJyksXG5cdFx0ZGVsZXRlOiB0KCdjb250YWN0cycsICdEZWxldGUnKSxcblx0XHRtb3JlOiB0KCdjb250YWN0cycsICdNb3JlJyksXG5cdFx0Y2FuRWRpdDogdCgnY29udGFjdHMnLCAnY2FuIGVkaXQnKVxuXHR9O1xuXG5cdGN0cmwuc2hvd1VybCA9IGZhbHNlO1xuXHRjdHJsLmVkaXRpbmcgPSBmYWxzZTtcblx0LyogZ2xvYmFscyBvY19jb25maWcgKi9cblx0LyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5cdGN0cmwuY2FuRXhwb3J0ID0gb2NfY29uZmlnLnZlcnNpb24uc3BsaXQoJy4nKVswXSA+PSA5IHx8IG9jX2NvbmZpZy52ZXJzaW9uLnNwbGl0KCcuJykgPj0gWzksIDAsIDIsIDBdO1xuXHQvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuXG5cdGN0cmwub3Blbk5hbWVFZGl0b3IgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y3RybC5kaXNwbGF5TmFtZSA9IGN0cmwuYWRkcmVzc0Jvb2suZGlzcGxheU5hbWU7XG5cblx0XHRjdHJsLmVkaXRpbmcgPSB0cnVlO1xuXHR9O1xuXG5cdGN0cmwuY2FuY2VsTmFtZUVkaXRvciA9IGZ1bmN0aW9uICgpIHtcblx0XHRjdHJsLmRpc3BsYXlOYW1lID0gJyc7XG5cblx0XHRjdHJsLmVkaXRpbmcgPSBmYWxzZTtcblx0fTtcblxuXHRjdHJsLnNhdmVOYW1lRWRpdG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0QWRkcmVzc0Jvb2tTZXJ2aWNlLnJlbmFtZShjdHJsLmFkZHJlc3NCb29rLCBjdHJsLmRpc3BsYXlOYW1lKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y3RybC5hZGRyZXNzQm9vay5kaXNwbGF5TmFtZSA9IGN0cmwuZGlzcGxheU5hbWU7XG5cdFx0XHRjdHJsLmRpc3BsYXluYW1lID0gJyc7XG5cblx0XHRcdGN0cmwuZWRpdGluZyA9IGZhbHNlO1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGN0cmwudG9nZ2xlU2hvd1VybCA9IGZ1bmN0aW9uKCkge1xuXHRcdGN0cmwuc2hvd1VybCA9ICFjdHJsLnNob3dVcmw7XG5cdH07XG5cblx0Y3RybC50b2dnbGVTaGFyZXNFZGl0b3IgPSBmdW5jdGlvbigpIHtcblx0XHRjdHJsLmVkaXRpbmdTaGFyZXMgPSAhY3RybC5lZGl0aW5nU2hhcmVzO1xuXHRcdGN0cmwuc2VsZWN0ZWRTaGFyZWUgPSBudWxsO1xuXHR9O1xuXG5cdC8qIEZyb20gQ2FsZW5kYXItUmV3b3JrIC0ganMvYXBwL2NvbnRyb2xsZXJzL2NhbGVuZGFybGlzdGNvbnRyb2xsZXIuanMgKi9cblx0Y3RybC5maW5kU2hhcmVlID0gZnVuY3Rpb24gKHZhbCkge1xuXHRcdHJldHVybiAkLmdldChcblx0XHRcdE9DLmxpbmtUb09DUygnYXBwcy9maWxlc19zaGFyaW5nL2FwaS92MScpICsgJ3NoYXJlZXMnLFxuXHRcdFx0e1xuXHRcdFx0XHRmb3JtYXQ6ICdqc29uJyxcblx0XHRcdFx0c2VhcmNoOiB2YWwudHJpbSgpLFxuXHRcdFx0XHRwZXJQYWdlOiAyMDAsXG5cdFx0XHRcdGl0ZW1UeXBlOiAncHJpbmNpcGFscydcblx0XHRcdH1cblx0XHQpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0XHQvLyBUb2RvIC0gZmlsdGVyIG91dCBjdXJyZW50IHVzZXIsIGV4aXN0aW5nIHNoYXJlZXNcblx0XHRcdHZhciB1c2VycyAgID0gcmVzdWx0Lm9jcy5kYXRhLmV4YWN0LnVzZXJzLmNvbmNhdChyZXN1bHQub2NzLmRhdGEudXNlcnMpO1xuXHRcdFx0dmFyIGdyb3VwcyAgPSByZXN1bHQub2NzLmRhdGEuZXhhY3QuZ3JvdXBzLmNvbmNhdChyZXN1bHQub2NzLmRhdGEuZ3JvdXBzKTtcblxuXHRcdFx0dmFyIHVzZXJTaGFyZXMgPSBjdHJsLmFkZHJlc3NCb29rLnNoYXJlZFdpdGgudXNlcnM7XG5cdFx0XHR2YXIgdXNlclNoYXJlc0xlbmd0aCA9IHVzZXJTaGFyZXMubGVuZ3RoO1xuXHRcdFx0dmFyIGksIGo7XG5cblx0XHRcdC8vIEZpbHRlciBvdXQgY3VycmVudCB1c2VyXG5cdFx0XHR2YXIgdXNlcnNMZW5ndGggPSB1c2Vycy5sZW5ndGg7XG5cdFx0XHRmb3IgKGkgPSAwIDsgaSA8IHVzZXJzTGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHVzZXJzW2ldLnZhbHVlLnNoYXJlV2l0aCA9PT0gT0MuY3VycmVudFVzZXIpIHtcblx0XHRcdFx0XHR1c2Vycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTm93IGZpbHRlciBvdXQgYWxsIHNoYXJlZXMgdGhhdCBhcmUgYWxyZWFkeSBzaGFyZWQgd2l0aFxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHVzZXJTaGFyZXNMZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgc2hhcmUgPSB1c2VyU2hhcmVzW2ldO1xuXHRcdFx0XHR1c2Vyc0xlbmd0aCA9IHVzZXJzLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IHVzZXJzTGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRpZiAodXNlcnNbal0udmFsdWUuc2hhcmVXaXRoID09PSBzaGFyZS5pZCkge1xuXHRcdFx0XHRcdFx0dXNlcnMuc3BsaWNlKGosIDEpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbWJpbmUgdXNlcnMgYW5kIGdyb3Vwc1xuXHRcdFx0dXNlcnMgPSB1c2Vycy5tYXAoZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGRpc3BsYXk6IF8uZXNjYXBlKGl0ZW0udmFsdWUuc2hhcmVXaXRoKSxcblx0XHRcdFx0XHR0eXBlOiBPQy5TaGFyZS5TSEFSRV9UWVBFX1VTRVIsXG5cdFx0XHRcdFx0aWRlbnRpZmllcjogaXRlbS52YWx1ZS5zaGFyZVdpdGhcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXG5cdFx0XHRncm91cHMgPSBncm91cHMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRkaXNwbGF5OiBfLmVzY2FwZShpdGVtLnZhbHVlLnNoYXJlV2l0aCkgKyAnIChncm91cCknLFxuXHRcdFx0XHRcdHR5cGU6IE9DLlNoYXJlLlNIQVJFX1RZUEVfR1JPVVAsXG5cdFx0XHRcdFx0aWRlbnRpZmllcjogaXRlbS52YWx1ZS5zaGFyZVdpdGhcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gZ3JvdXBzLmNvbmNhdCh1c2Vycyk7XG5cdFx0fSk7XG5cdH07XG5cblx0Y3RybC5vblNlbGVjdFNoYXJlZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0Y3RybC5zZWxlY3RlZFNoYXJlZSA9IG51bGw7XG5cdFx0QWRkcmVzc0Jvb2tTZXJ2aWNlLnNoYXJlKGN0cmwuYWRkcmVzc0Jvb2ssIGl0ZW0udHlwZSwgaXRlbS5pZGVudGlmaWVyLCBmYWxzZSwgZmFsc2UpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fSk7XG5cblx0fTtcblxuXHRjdHJsLnVwZGF0ZUV4aXN0aW5nVXNlclNoYXJlID0gZnVuY3Rpb24odXNlcklkLCB3cml0YWJsZSkge1xuXHRcdEFkZHJlc3NCb29rU2VydmljZS5zaGFyZShjdHJsLmFkZHJlc3NCb29rLCBPQy5TaGFyZS5TSEFSRV9UWVBFX1VTRVIsIHVzZXJJZCwgd3JpdGFibGUsIHRydWUpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fSk7XG5cdH07XG5cblx0Y3RybC51cGRhdGVFeGlzdGluZ0dyb3VwU2hhcmUgPSBmdW5jdGlvbihncm91cElkLCB3cml0YWJsZSkge1xuXHRcdEFkZHJlc3NCb29rU2VydmljZS5zaGFyZShjdHJsLmFkZHJlc3NCb29rLCBPQy5TaGFyZS5TSEFSRV9UWVBFX0dST1VQLCBncm91cElkLCB3cml0YWJsZSwgdHJ1ZSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdCRzY29wZS4kYXBwbHkoKTtcblx0XHR9KTtcblx0fTtcblxuXHRjdHJsLnVuc2hhcmVGcm9tVXNlciA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuXHRcdEFkZHJlc3NCb29rU2VydmljZS51bnNoYXJlKGN0cmwuYWRkcmVzc0Jvb2ssIE9DLlNoYXJlLlNIQVJFX1RZUEVfVVNFUiwgdXNlcklkKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGN0cmwudW5zaGFyZUZyb21Hcm91cCA9IGZ1bmN0aW9uKGdyb3VwSWQpIHtcblx0XHRBZGRyZXNzQm9va1NlcnZpY2UudW5zaGFyZShjdHJsLmFkZHJlc3NCb29rLCBPQy5TaGFyZS5TSEFSRV9UWVBFX0dST1VQLCBncm91cElkKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGN0cmwuZGVsZXRlQWRkcmVzc0Jvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRBZGRyZXNzQm9va1NlcnZpY2UuZGVsZXRlKGN0cmwuYWRkcmVzc0Jvb2spLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fSk7XG5cdH07XG5cblx0Y3RybC5kb3dubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5vcGVuKGN0cmwuYWRkcmVzc0Jvb2sudXJsICsgJz9leHBvcnQnKTtcblx0fTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnYWRkcmVzc2Jvb2snLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0EnLCAvLyBoYXMgdG8gYmUgYW4gYXR0cmlidXRlIHRvIHdvcmsgd2l0aCBjb3JlIGNzc1xuXHRcdHNjb3BlOiB7XG5cdFx0XHRpbmRleDogJ0AnXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiAnYWRkcmVzc2Jvb2tDdHJsJyxcblx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRhZGRyZXNzQm9vazogJz1kYXRhJyxcblx0XHRcdGxpc3Q6ICc9J1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnY29udGFjdHMnLCAndGVtcGxhdGVzL2FkZHJlc3NCb29rLmh0bWwnKVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmNvbnRyb2xsZXIoJ2FkZHJlc3Nib29rbGlzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEFkZHJlc3NCb29rU2VydmljZSkge1xuXHR2YXIgY3RybCA9IHRoaXM7XG5cblx0Y3RybC5sb2FkaW5nID0gdHJ1ZTtcblxuXHRBZGRyZXNzQm9va1NlcnZpY2UuZ2V0QWxsKCkudGhlbihmdW5jdGlvbihhZGRyZXNzQm9va3MpIHtcblx0XHRjdHJsLmFkZHJlc3NCb29rcyA9IGFkZHJlc3NCb29rcztcblx0XHRjdHJsLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRpZihjdHJsLmFkZHJlc3NCb29rcy5sZW5ndGggPT09IDApIHtcblx0XHRcdEFkZHJlc3NCb29rU2VydmljZS5jcmVhdGUodCgnY29udGFjdHMnLCAnQ29udGFjdHMnKSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0QWRkcmVzc0Jvb2tTZXJ2aWNlLmdldEFkZHJlc3NCb29rKHQoJ2NvbnRhY3RzJywgJ0NvbnRhY3RzJykpLnRoZW4oZnVuY3Rpb24oYWRkcmVzc0Jvb2spIHtcblx0XHRcdFx0XHRjdHJsLmFkZHJlc3NCb29rcy5wdXNoKGFkZHJlc3NCb29rKTtcblx0XHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxuXHRjdHJsLnQgPSB7XG5cdFx0YWRkcmVzc0Jvb2tOYW1lIDogdCgnY29udGFjdHMnLCAnQWRkcmVzcyBib29rIG5hbWUnKVxuXHR9O1xuXG5cdGN0cmwuY3JlYXRlQWRkcmVzc0Jvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRpZihjdHJsLm5ld0FkZHJlc3NCb29rTmFtZSkge1xuXHRcdFx0QWRkcmVzc0Jvb2tTZXJ2aWNlLmNyZWF0ZShjdHJsLm5ld0FkZHJlc3NCb29rTmFtZSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0QWRkcmVzc0Jvb2tTZXJ2aWNlLmdldEFkZHJlc3NCb29rKGN0cmwubmV3QWRkcmVzc0Jvb2tOYW1lKS50aGVuKGZ1bmN0aW9uKGFkZHJlc3NCb29rKSB7XG5cdFx0XHRcdFx0Y3RybC5hZGRyZXNzQm9va3MucHVzaChhZGRyZXNzQm9vayk7XG5cdFx0XHRcdFx0Y3RybC5uZXdBZGRyZXNzQm9va05hbWUgPSAnJztcblx0XHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnYWRkcmVzc2Jvb2tsaXN0JywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFQScsIC8vIGhhcyB0byBiZSBhbiBhdHRyaWJ1dGUgdG8gd29yayB3aXRoIGNvcmUgY3NzXG5cdFx0c2NvcGU6IHt9LFxuXHRcdGNvbnRyb2xsZXI6ICdhZGRyZXNzYm9va2xpc3RDdHJsJyxcblx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB7fSxcblx0XHR0ZW1wbGF0ZVVybDogT0MubGlua1RvKCdjb250YWN0cycsICd0ZW1wbGF0ZXMvYWRkcmVzc0Jvb2tMaXN0Lmh0bWwnKVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmNvbnRyb2xsZXIoJ2F2YXRhckN0cmwnLCBmdW5jdGlvbihDb250YWN0U2VydmljZSkge1xuXHR2YXIgY3RybCA9IHRoaXM7XG5cblx0Y3RybC5pbXBvcnQgPSBDb250YWN0U2VydmljZS5pbXBvcnQuYmluZChDb250YWN0U2VydmljZSk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5kaXJlY3RpdmUoJ2F2YXRhcicsIGZ1bmN0aW9uKENvbnRhY3RTZXJ2aWNlKSB7XG5cdHJldHVybiB7XG5cdFx0c2NvcGU6IHtcblx0XHRcdGNvbnRhY3Q6ICc9ZGF0YSdcblx0XHR9LFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG5cdFx0XHR2YXIgaW1wb3J0VGV4dCA9IHQoJ2NvbnRhY3RzJywgJ0ltcG9ydCcpO1xuXHRcdFx0c2NvcGUuaW1wb3J0VGV4dCA9IGltcG9ydFRleHQ7XG5cblx0XHRcdHZhciBpbnB1dCA9IGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHRcdGlucHV0LmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgZmlsZSA9IGlucHV0LmdldCgwKS5maWxlc1swXTtcblx0XHRcdFx0aWYgKGZpbGUuc2l6ZSA+IDEwMjQqMTAyNCkgeyAvLyAxIE1CXG5cdFx0XHRcdFx0T0MuTm90aWZpY2F0aW9uLnNob3dUZW1wb3JhcnkodCgnY29udGFjdHMnLCAnVGhlIHNlbGVjdGVkIGltYWdlIGlzIHRvbyBiaWcgKG1heCAxTUIpJykpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG5cdFx0XHRcdFx0cmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdHNjb3BlLmNvbnRhY3QucGhvdG8ocmVhZGVyLnJlc3VsdCk7XG5cdFx0XHRcdFx0XHRcdENvbnRhY3RTZXJ2aWNlLnVwZGF0ZShzY29wZS5jb250YWN0KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0sIGZhbHNlKTtcblxuXHRcdFx0XHRcdGlmIChmaWxlKSB7XG5cdFx0XHRcdFx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnY29udGFjdHMnLCAndGVtcGxhdGVzL2F2YXRhci5odG1sJylcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5jb250cm9sbGVyKCdjb250YWN0Q3RybCcsIGZ1bmN0aW9uKCRyb3V0ZSwgJHJvdXRlUGFyYW1zLCBTb3J0QnlTZXJ2aWNlKSB7XG5cdHZhciBjdHJsID0gdGhpcztcblxuXHRjdHJsLm9wZW5Db250YWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0JHJvdXRlLnVwZGF0ZVBhcmFtcyh7XG5cdFx0XHRnaWQ6ICRyb3V0ZVBhcmFtcy5naWQsXG5cdFx0XHR1aWQ6IGN0cmwuY29udGFjdC51aWQoKX0pO1xuXHR9O1xuXG5cdGN0cmwuZ2V0TmFtZSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIElmIGxhc3ROYW1lIGVxdWFscyB0byBmaXJzdE5hbWUgdGhlbiBub25lIG9mIHRoZW0gaXMgc2V0XG5cdFx0aWYgKGN0cmwuY29udGFjdC5sYXN0TmFtZSgpID09PSBjdHJsLmNvbnRhY3QuZmlyc3ROYW1lKCkpIHtcblx0XHRcdHJldHVybiBjdHJsLmNvbnRhY3QuZGlzcGxheU5hbWUoKTtcblx0XHR9XG5cblx0XHRpZiAoU29ydEJ5U2VydmljZS5nZXRTb3J0QnkoKSA9PT0gJ3NvcnRMYXN0TmFtZScpIHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGN0cmwuY29udGFjdC5sYXN0TmFtZSgpICsgJywgJ1xuXHRcdFx0XHQrIGN0cmwuY29udGFjdC5maXJzdE5hbWUoKSArICcgJ1xuXHRcdFx0XHQrIGN0cmwuY29udGFjdC5hZGRpdGlvbmFsTmFtZXMoKVxuXHRcdFx0KS50cmltKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFNvcnRCeVNlcnZpY2UuZ2V0U29ydEJ5KCkgPT09ICdzb3J0Rmlyc3ROYW1lJykge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0Y3RybC5jb250YWN0LmZpcnN0TmFtZSgpICsgJyAnXG5cdFx0XHRcdCsgY3RybC5jb250YWN0LmFkZGl0aW9uYWxOYW1lcygpICsgJyAnXG5cdFx0XHRcdCsgY3RybC5jb250YWN0Lmxhc3ROYW1lKClcblx0XHRcdCkudHJpbSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjdHJsLmNvbnRhY3QuZGlzcGxheU5hbWUoKTtcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5kaXJlY3RpdmUoJ2NvbnRhY3QnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRzY29wZToge30sXG5cdFx0Y29udHJvbGxlcjogJ2NvbnRhY3RDdHJsJyxcblx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRjb250YWN0OiAnPWRhdGEnXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybDogT0MubGlua1RvKCdjb250YWN0cycsICd0ZW1wbGF0ZXMvY29udGFjdC5odG1sJylcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5jb250cm9sbGVyKCdjb250YWN0ZGV0YWlsc0N0cmwnLCBmdW5jdGlvbihDb250YWN0U2VydmljZSwgQWRkcmVzc0Jvb2tTZXJ2aWNlLCB2Q2FyZFByb3BlcnRpZXNTZXJ2aWNlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJHNjb3BlKSB7XG5cblx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdGN0cmwubG9hZGluZyA9IHRydWU7XG5cdGN0cmwuc2hvdyA9IGZhbHNlO1xuXG5cdGN0cmwuY2xlYXJDb250YWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0JHJvdXRlLnVwZGF0ZVBhcmFtcyh7XG5cdFx0XHRnaWQ6ICRyb3V0ZVBhcmFtcy5naWQsXG5cdFx0XHR1aWQ6IHVuZGVmaW5lZFxuXHRcdH0pO1xuXHRcdGN0cmwuc2hvdyA9IGZhbHNlO1xuXHRcdGN0cmwuY29udGFjdCA9IHVuZGVmaW5lZDtcblx0fTtcblxuXHRjdHJsLnVpZCA9ICRyb3V0ZVBhcmFtcy51aWQ7XG5cdGN0cmwudCA9IHtcblx0XHRub0NvbnRhY3RzIDogdCgnY29udGFjdHMnLCAnTm8gY29udGFjdHMgaW4gaGVyZScpLFxuXHRcdHBsYWNlaG9sZGVyTmFtZSA6IHQoJ2NvbnRhY3RzJywgJ05hbWUnKSxcblx0XHRwbGFjZWhvbGRlck9yZyA6IHQoJ2NvbnRhY3RzJywgJ09yZ2FuaXphdGlvbicpLFxuXHRcdHBsYWNlaG9sZGVyVGl0bGUgOiB0KCdjb250YWN0cycsICdUaXRsZScpLFxuXHRcdHNlbGVjdEZpZWxkIDogdCgnY29udGFjdHMnLCAnQWRkIGZpZWxkIC4uLicpLFxuXHRcdGRvd25sb2FkIDogdCgnY29udGFjdHMnLCAnRG93bmxvYWQnKSxcblx0XHRkZWxldGUgOiB0KCdjb250YWN0cycsICdEZWxldGUnKSxcblx0XHRzYXZlIDogdCgnY29udGFjdHMnLCAnU2F2ZSBjaGFuZ2VzJyksXG5cdFx0YWRkcmVzc0Jvb2sgOiB0KCdjb250YWN0cycsICdBZGRyZXNzIGJvb2snKVxuXHR9O1xuXG5cdGN0cmwuZmllbGREZWZpbml0aW9ucyA9IHZDYXJkUHJvcGVydGllc1NlcnZpY2UuZmllbGREZWZpbml0aW9ucztcblx0Y3RybC5mb2N1cyA9IHVuZGVmaW5lZDtcblx0Y3RybC5maWVsZCA9IHVuZGVmaW5lZDtcblx0Y3RybC5hZGRyZXNzQm9va3MgPSBbXTtcblxuXHRBZGRyZXNzQm9va1NlcnZpY2UuZ2V0QWxsKCkudGhlbihmdW5jdGlvbihhZGRyZXNzQm9va3MpIHtcblx0XHRjdHJsLmFkZHJlc3NCb29rcyA9IGFkZHJlc3NCb29rcztcblxuXHRcdGlmICghXy5pc1VuZGVmaW5lZChjdHJsLmNvbnRhY3QpKSB7XG5cdFx0XHRjdHJsLmFkZHJlc3NCb29rID0gXy5maW5kKGN0cmwuYWRkcmVzc0Jvb2tzLCBmdW5jdGlvbihib29rKSB7XG5cdFx0XHRcdHJldHVybiBib29rLmRpc3BsYXlOYW1lID09PSBjdHJsLmNvbnRhY3QuYWRkcmVzc0Jvb2tJZDtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRjdHJsLmxvYWRpbmcgPSBmYWxzZTtcblx0fSk7XG5cblx0JHNjb3BlLiR3YXRjaCgnY3RybC51aWQnLCBmdW5jdGlvbihuZXdWYWx1ZSkge1xuXHRcdGN0cmwuY2hhbmdlQ29udGFjdChuZXdWYWx1ZSk7XG5cdH0pO1xuXG5cdGN0cmwuY2hhbmdlQ29udGFjdCA9IGZ1bmN0aW9uKHVpZCkge1xuXHRcdGlmICh0eXBlb2YgdWlkID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0Y3RybC5zaG93ID0gZmFsc2U7XG5cdFx0XHQkKCcjYXBwLW5hdmlnYXRpb24tdG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ3Nob3dkZXRhaWxzJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdENvbnRhY3RTZXJ2aWNlLmdldEJ5SWQodWlkKS50aGVuKGZ1bmN0aW9uKGNvbnRhY3QpIHtcblx0XHRcdGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGNvbnRhY3QpKSB7XG5cdFx0XHRcdGN0cmwuY2xlYXJDb250YWN0KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGN0cmwuY29udGFjdCA9IGNvbnRhY3Q7XG5cdFx0XHRjdHJsLnNob3cgPSB0cnVlO1xuXHRcdFx0JCgnI2FwcC1uYXZpZ2F0aW9uLXRvZ2dsZScpLmFkZENsYXNzKCdzaG93ZGV0YWlscycpO1xuXG5cdFx0XHRjdHJsLmFkZHJlc3NCb29rID0gXy5maW5kKGN0cmwuYWRkcmVzc0Jvb2tzLCBmdW5jdGlvbihib29rKSB7XG5cdFx0XHRcdHJldHVybiBib29rLmRpc3BsYXlOYW1lID09PSBjdHJsLmNvbnRhY3QuYWRkcmVzc0Jvb2tJZDtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGN0cmwudXBkYXRlQ29udGFjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdENvbnRhY3RTZXJ2aWNlLnVwZGF0ZShjdHJsLmNvbnRhY3QpO1xuXHR9O1xuXG5cdGN0cmwuZGVsZXRlQ29udGFjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdENvbnRhY3RTZXJ2aWNlLmRlbGV0ZShjdHJsLmNvbnRhY3QpO1xuXHR9O1xuXG5cdGN0cmwuYWRkRmllbGQgPSBmdW5jdGlvbihmaWVsZCkge1xuXHRcdHZhciBkZWZhdWx0VmFsdWUgPSB2Q2FyZFByb3BlcnRpZXNTZXJ2aWNlLmdldE1ldGEoZmllbGQpLmRlZmF1bHRWYWx1ZSB8fCB7dmFsdWU6ICcnfTtcblx0XHRjdHJsLmNvbnRhY3QuYWRkUHJvcGVydHkoZmllbGQsIGRlZmF1bHRWYWx1ZSk7XG5cdFx0Y3RybC5mb2N1cyA9IGZpZWxkO1xuXHRcdGN0cmwuZmllbGQgPSAnJztcblx0fTtcblxuXHRjdHJsLmRlbGV0ZUZpZWxkID0gZnVuY3Rpb24gKGZpZWxkLCBwcm9wKSB7XG5cdFx0Y3RybC5jb250YWN0LnJlbW92ZVByb3BlcnR5KGZpZWxkLCBwcm9wKTtcblx0XHRjdHJsLmZvY3VzID0gdW5kZWZpbmVkO1xuXHR9O1xuXG5cdGN0cmwuY2hhbmdlQWRkcmVzc0Jvb2sgPSBmdW5jdGlvbiAoYWRkcmVzc0Jvb2spIHtcblx0XHRDb250YWN0U2VydmljZS5tb3ZlQ29udGFjdChjdHJsLmNvbnRhY3QsIGFkZHJlc3NCb29rKTtcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5kaXJlY3RpdmUoJ2NvbnRhY3RkZXRhaWxzJywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cHJpb3JpdHk6IDEsXG5cdFx0c2NvcGU6IHt9LFxuXHRcdGNvbnRyb2xsZXI6ICdjb250YWN0ZGV0YWlsc0N0cmwnLFxuXHRcdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2NvbnRhY3RzJywgJ3RlbXBsYXRlcy9jb250YWN0RGV0YWlscy5odG1sJylcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5jb250cm9sbGVyKCdjb250YWN0aW1wb3J0Q3RybCcsIGZ1bmN0aW9uKENvbnRhY3RTZXJ2aWNlKSB7XG5cdHZhciBjdHJsID0gdGhpcztcblxuXHRjdHJsLmltcG9ydCA9IENvbnRhY3RTZXJ2aWNlLmltcG9ydC5iaW5kKENvbnRhY3RTZXJ2aWNlKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnY29udGFjdGltcG9ydCcsIGZ1bmN0aW9uKENvbnRhY3RTZXJ2aWNlKSB7XG5cdHJldHVybiB7XG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQpIHtcblx0XHRcdHZhciBpbXBvcnRUZXh0ID0gdCgnY29udGFjdHMnLCAnSW1wb3J0Jyk7XG5cdFx0XHRzY29wZS5pbXBvcnRUZXh0ID0gaW1wb3J0VGV4dDtcblxuXHRcdFx0dmFyIGlucHV0ID0gZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuXHRcdFx0aW5wdXQuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpbnB1dC5nZXQoMCkuZmlsZXMsIGZ1bmN0aW9uKGZpbGUpIHtcblx0XHRcdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuXHRcdFx0XHRcdHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0Q29udGFjdFNlcnZpY2UuaW1wb3J0LmNhbGwoQ29udGFjdFNlcnZpY2UsIHJlYWRlci5yZXN1bHQsIGZpbGUudHlwZSwgbnVsbCwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHByb2dyZXNzID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzY29wZS5pbXBvcnRUZXh0ID0gaW1wb3J0VGV4dDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2NvcGUuaW1wb3J0VGV4dCA9IHBhcnNlSW50KE1hdGguZmxvb3IocHJvZ3Jlc3MgKiAxMDApKSArICclJztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0aWYgKGZpbGUpIHtcblx0XHRcdFx0XHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlucHV0LmdldCgwKS52YWx1ZSA9ICcnO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybDogT0MubGlua1RvKCdjb250YWN0cycsICd0ZW1wbGF0ZXMvY29udGFjdEltcG9ydC5odG1sJylcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5jb250cm9sbGVyKCdjb250YWN0bGlzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRmaWx0ZXIsICRyb3V0ZSwgJHJvdXRlUGFyYW1zLCBDb250YWN0U2VydmljZSwgU29ydEJ5U2VydmljZSwgdkNhcmRQcm9wZXJ0aWVzU2VydmljZSwgU2VhcmNoU2VydmljZSkge1xuXHR2YXIgY3RybCA9IHRoaXM7XG5cblx0Y3RybC5yb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcblxuXHRjdHJsLmNvbnRhY3RMaXN0ID0gW107XG5cdGN0cmwuc2VhcmNoVGVybSA9ICcnO1xuXHRjdHJsLnNob3cgPSB0cnVlO1xuXHRjdHJsLmludmFsaWQgPSBmYWxzZTtcblxuXHRjdHJsLnNvcnRCeSA9IFNvcnRCeVNlcnZpY2UuZ2V0U29ydEJ5KCk7XG5cblx0Y3RybC50ID0ge1xuXHRcdGVtcHR5U2VhcmNoIDogdCgnY29udGFjdHMnLCAnTm8gc2VhcmNoIHJlc3VsdCBmb3Ige3F1ZXJ5fScsIHtxdWVyeTogY3RybC5zZWFyY2hUZXJtfSlcblx0fTtcblxuXHQkc2NvcGUuZ2V0Q291bnRTdHJpbmcgPSBmdW5jdGlvbihjb250YWN0cykge1xuXHRcdHJldHVybiBuKCdjb250YWN0cycsICclbiBjb250YWN0JywgJyVuIGNvbnRhY3RzJywgY29udGFjdHMubGVuZ3RoKTtcblx0fTtcblxuXHQkc2NvcGUucXVlcnkgPSBmdW5jdGlvbihjb250YWN0KSB7XG5cdFx0cmV0dXJuIGNvbnRhY3QubWF0Y2hlcyhTZWFyY2hTZXJ2aWNlLmdldFNlYXJjaFRlcm0oKSk7XG5cdH07XG5cblx0U29ydEJ5U2VydmljZS5zdWJzY3JpYmUoZnVuY3Rpb24obmV3VmFsdWUpIHtcblx0XHRjdHJsLnNvcnRCeSA9IG5ld1ZhbHVlO1xuXHR9KTtcblxuXHRTZWFyY2hTZXJ2aWNlLnJlZ2lzdGVyT2JzZXJ2ZXJDYWxsYmFjayhmdW5jdGlvbihldikge1xuXHRcdGlmIChldi5ldmVudCA9PT0gJ3N1Ym1pdFNlYXJjaCcpIHtcblx0XHRcdHZhciB1aWQgPSAhXy5pc0VtcHR5KGN0cmwuY29udGFjdExpc3QpID8gY3RybC5jb250YWN0TGlzdFswXS51aWQoKSA6IHVuZGVmaW5lZDtcblx0XHRcdGN0cmwuc2V0U2VsZWN0ZWRJZCh1aWQpO1xuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH1cblx0XHRpZiAoZXYuZXZlbnQgPT09ICdjaGFuZ2VTZWFyY2gnKSB7XG5cdFx0XHRjdHJsLnNlYXJjaFRlcm0gPSBldi5zZWFyY2hUZXJtO1xuXHRcdFx0Y3RybC50LmVtcHR5U2VhcmNoID0gdCgnY29udGFjdHMnLFxuXHRcdFx0XHRcdFx0XHRcdCAgICdObyBzZWFyY2ggcmVzdWx0IGZvciB7cXVlcnl9Jyxcblx0XHRcdFx0XHRcdFx0XHQgICB7cXVlcnk6IGN0cmwuc2VhcmNoVGVybX1cblx0XHRcdFx0XHRcdFx0XHQgICk7XG5cdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fVxuXHR9KTtcblxuXHRjdHJsLmxvYWRpbmcgPSB0cnVlO1xuXG5cdENvbnRhY3RTZXJ2aWNlLnJlZ2lzdGVyT2JzZXJ2ZXJDYWxsYmFjayhmdW5jdGlvbihldikge1xuXHRcdCRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoZXYuZXZlbnQgPT09ICdkZWxldGUnKSB7XG5cdFx0XHRcdGlmIChjdHJsLmNvbnRhY3RMaXN0Lmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdCRyb3V0ZS51cGRhdGVQYXJhbXMoe1xuXHRcdFx0XHRcdFx0Z2lkOiAkcm91dGVQYXJhbXMuZ2lkLFxuXHRcdFx0XHRcdFx0dWlkOiB1bmRlZmluZWRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gY3RybC5jb250YWN0TGlzdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKGN0cmwuY29udGFjdExpc3RbaV0udWlkKCkgPT09IGV2LnVpZCkge1xuXHRcdFx0XHRcdFx0XHQkcm91dGUudXBkYXRlUGFyYW1zKHtcblx0XHRcdFx0XHRcdFx0XHRnaWQ6ICRyb3V0ZVBhcmFtcy5naWQsXG5cdFx0XHRcdFx0XHRcdFx0dWlkOiAoY3RybC5jb250YWN0TGlzdFtpKzFdKSA/IGN0cmwuY29udGFjdExpc3RbaSsxXS51aWQoKSA6IGN0cmwuY29udGFjdExpc3RbaS0xXS51aWQoKVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChldi5ldmVudCA9PT0gJ2NyZWF0ZScpIHtcblx0XHRcdFx0JHJvdXRlLnVwZGF0ZVBhcmFtcyh7XG5cdFx0XHRcdFx0Z2lkOiAkcm91dGVQYXJhbXMuZ2lkLFxuXHRcdFx0XHRcdHVpZDogZXYudWlkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Y3RybC5jb250YWN0cyA9IGV2LmNvbnRhY3RzO1xuXHRcdH0pO1xuXHR9KTtcblxuXHQvLyBHZXQgY29udGFjdHNcblx0Q29udGFjdFNlcnZpY2UuZ2V0QWxsKCkudGhlbihmdW5jdGlvbihjb250YWN0cykge1xuXHRcdGlmKGNvbnRhY3RzLmxlbmd0aD4wKSB7XG5cdFx0XHQkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjdHJsLmNvbnRhY3RzID0gY29udGFjdHM7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3RybC5sb2FkaW5nID0gZmFsc2U7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBXYWl0IGZvciBjdHJsLmNvbnRhY3RMaXN0IHRvIGJlIHVwZGF0ZWQsIGxvYWQgdGhlIGZpcnN0IGNvbnRhY3QgYW5kIGtpbGwgdGhlIHdhdGNoXG5cdHZhciB1bmJpbmRMaXN0V2F0Y2ggPSAkc2NvcGUuJHdhdGNoKCdjdHJsLmNvbnRhY3RMaXN0JywgZnVuY3Rpb24oKSB7XG5cdFx0aWYoY3RybC5jb250YWN0TGlzdCAmJiBjdHJsLmNvbnRhY3RMaXN0Lmxlbmd0aCA+IDApIHtcblx0XHRcdC8vIENoZWNrIGlmIGEgc3BlY2lmaWMgdWlkIGlzIHJlcXVlc3RlZFxuXHRcdFx0aWYoJHJvdXRlUGFyYW1zLnVpZCAmJiAkcm91dGVQYXJhbXMuZ2lkKSB7XG5cdFx0XHRcdGN0cmwuY29udGFjdExpc3QuZm9yRWFjaChmdW5jdGlvbihjb250YWN0KSB7XG5cdFx0XHRcdFx0aWYoY29udGFjdC51aWQoKSA9PT0gJHJvdXRlUGFyYW1zLnVpZCkge1xuXHRcdFx0XHRcdFx0Y3RybC5zZXRTZWxlY3RlZElkKCRyb3V0ZVBhcmFtcy51aWQpO1xuXHRcdFx0XHRcdFx0Y3RybC5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdC8vIE5vIGNvbnRhY3QgcHJldmlvdXNseSBsb2FkZWQsIGxldCdzIGxvYWQgdGhlIGZpcnN0IG9mIHRoZSBsaXN0IGlmIG5vdCBpbiBtb2JpbGUgbW9kZVxuXHRcdFx0aWYoY3RybC5sb2FkaW5nICYmICQod2luZG93KS53aWR0aCgpID4gNzY4KSB7XG5cdFx0XHRcdGN0cmwuc2V0U2VsZWN0ZWRJZChjdHJsLmNvbnRhY3RMaXN0WzBdLnVpZCgpKTtcblx0XHRcdH1cblx0XHRcdGN0cmwubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0dW5iaW5kTGlzdFdhdGNoKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQkc2NvcGUuJHdhdGNoKCdjdHJsLnJvdXRlUGFyYW1zLnVpZCcsIGZ1bmN0aW9uKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuXHRcdC8vIFVzZWQgZm9yIG1vYmlsZSB2aWV3IHRvIGNsZWFyIHRoZSB1cmxcblx0XHRpZih0eXBlb2Ygb2xkVmFsdWUgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG5ld1ZhbHVlID09ICd1bmRlZmluZWQnICYmICQod2luZG93KS53aWR0aCgpIDw9IDc2OCkge1xuXHRcdFx0Ly8gbm8gY29udGFjdCBzZWxlY3RlZFxuXHRcdFx0Y3RybC5zaG93ID0gdHJ1ZTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0aWYobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gd2UgbWlnaHQgaGF2ZSB0byB3YWl0IHVudGlsIG5nLXJlcGVhdCBmaWxsZWQgdGhlIGNvbnRhY3RMaXN0XG5cdFx0XHRpZihjdHJsLmNvbnRhY3RMaXN0ICYmIGN0cmwuY29udGFjdExpc3QubGVuZ3RoID4gMCkge1xuXHRcdFx0XHQkcm91dGUudXBkYXRlUGFyYW1zKHtcblx0XHRcdFx0XHRnaWQ6ICRyb3V0ZVBhcmFtcy5naWQsXG5cdFx0XHRcdFx0dWlkOiBjdHJsLmNvbnRhY3RMaXN0WzBdLnVpZCgpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gd2F0Y2ggZm9yIG5leHQgY29udGFjdExpc3QgdXBkYXRlXG5cdFx0XHRcdHZhciB1bmJpbmRXYXRjaCA9ICRzY29wZS4kd2F0Y2goJ2N0cmwuY29udGFjdExpc3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpZihjdHJsLmNvbnRhY3RMaXN0ICYmIGN0cmwuY29udGFjdExpc3QubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0JHJvdXRlLnVwZGF0ZVBhcmFtcyh7XG5cdFx0XHRcdFx0XHRcdGdpZDogJHJvdXRlUGFyYW1zLmdpZCxcblx0XHRcdFx0XHRcdFx0dWlkOiBjdHJsLmNvbnRhY3RMaXN0WzBdLnVpZCgpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dW5iaW5kV2F0Y2goKTsgLy8gdW5iaW5kIGFzIHdlIG9ubHkgd2FudCBvbmUgdXBkYXRlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBkaXNwbGF5aW5nIGNvbnRhY3QgZGV0YWlsc1xuXHRcdFx0Y3RybC5zaG93ID0gZmFsc2U7XG5cdFx0fVxuXHR9KTtcblxuXHQkc2NvcGUuJHdhdGNoKCdjdHJsLnJvdXRlUGFyYW1zLmdpZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIHdlIG1pZ2h0IGhhdmUgdG8gd2FpdCB1bnRpbCBuZy1yZXBlYXQgZmlsbGVkIHRoZSBjb250YWN0TGlzdFxuXHRcdGN0cmwuY29udGFjdExpc3QgPSBbXTtcblx0XHQvLyBub3QgaW4gbW9iaWxlIG1vZGVcblx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA+IDc2OCkge1xuXHRcdFx0Ly8gd2F0Y2ggZm9yIG5leHQgY29udGFjdExpc3QgdXBkYXRlXG5cdFx0XHR2YXIgdW5iaW5kV2F0Y2ggPSAkc2NvcGUuJHdhdGNoKCdjdHJsLmNvbnRhY3RMaXN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKGN0cmwuY29udGFjdExpc3QgJiYgY3RybC5jb250YWN0TGlzdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0JHJvdXRlLnVwZGF0ZVBhcmFtcyh7XG5cdFx0XHRcdFx0XHRnaWQ6ICRyb3V0ZVBhcmFtcy5naWQsXG5cdFx0XHRcdFx0XHR1aWQ6IGN0cmwuY29udGFjdExpc3RbMF0udWlkKClcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR1bmJpbmRXYXRjaCgpOyAvLyB1bmJpbmQgYXMgd2Ugb25seSB3YW50IG9uZSB1cGRhdGVcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gV2F0Y2ggaWYgd2UgaGF2ZSBhbiBpbnZhbGlkIGNvbnRhY3Rcblx0JHNjb3BlLiR3YXRjaCgnY3RybC5jb250YWN0TGlzdFswXS5kaXNwbGF5TmFtZSgpJywgZnVuY3Rpb24oZGlzcGxheU5hbWUpIHtcblx0XHRjdHJsLmludmFsaWQgPSAoZGlzcGxheU5hbWUgPT09ICcnKTtcblx0fSk7XG5cblx0Y3RybC5oYXNDb250YWN0cyA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoIWN0cmwuY29udGFjdHMpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIGN0cmwuY29udGFjdHMubGVuZ3RoID4gMDtcblx0fTtcblxuXHRjdHJsLnNldFNlbGVjdGVkSWQgPSBmdW5jdGlvbiAoY29udGFjdElkKSB7XG5cdFx0JHJvdXRlLnVwZGF0ZVBhcmFtcyh7XG5cdFx0XHR1aWQ6IGNvbnRhY3RJZFxuXHRcdH0pO1xuXHR9O1xuXG5cdGN0cmwuZ2V0U2VsZWN0ZWRJZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkcm91dGVQYXJhbXMudWlkO1xuXHR9O1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZGlyZWN0aXZlKCdjb250YWN0bGlzdCcsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHByaW9yaXR5OiAxLFxuXHRcdHNjb3BlOiB7fSxcblx0XHRjb250cm9sbGVyOiAnY29udGFjdGxpc3RDdHJsJyxcblx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRhZGRyZXNzYm9vazogJz1hZHJib29rJ1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnY29udGFjdHMnLCAndGVtcGxhdGVzL2NvbnRhY3RMaXN0Lmh0bWwnKVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmNvbnRyb2xsZXIoJ2RldGFpbHNJdGVtQ3RybCcsIGZ1bmN0aW9uKCR0ZW1wbGF0ZVJlcXVlc3QsIHZDYXJkUHJvcGVydGllc1NlcnZpY2UsIENvbnRhY3RTZXJ2aWNlLCBTZXR0aW5nc1NlcnZpY2UpIHtcblx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdGN0cmwubWV0YSA9IHZDYXJkUHJvcGVydGllc1NlcnZpY2UuZ2V0TWV0YShjdHJsLm5hbWUpO1xuXHRjdHJsLnR5cGUgPSB1bmRlZmluZWQ7XG5cdGN0cmwuaXNQcmVmZXJyZWQgPSBmYWxzZTtcblx0Y3RybC50ID0ge1xuXHRcdHBvQm94IDogdCgnY29udGFjdHMnLCAnUG9zdCBvZmZpY2UgYm94JyksXG5cdFx0cG9zdGFsQ29kZSA6IHQoJ2NvbnRhY3RzJywgJ1Bvc3RhbCBjb2RlJyksXG5cdFx0Y2l0eSA6IHQoJ2NvbnRhY3RzJywgJ0NpdHknKSxcblx0XHRzdGF0ZSA6IHQoJ2NvbnRhY3RzJywgJ1N0YXRlIG9yIHByb3ZpbmNlJyksXG5cdFx0Y291bnRyeSA6IHQoJ2NvbnRhY3RzJywgJ0NvdW50cnknKSxcblx0XHRhZGRyZXNzOiB0KCdjb250YWN0cycsICdBZGRyZXNzJyksXG5cdFx0bmV3R3JvdXA6IHQoJ2NvbnRhY3RzJywgJyhuZXcgZ3JvdXApJyksXG5cdFx0ZmFtaWx5TmFtZTogdCgnY29udGFjdHMnLCAnTGFzdCBuYW1lJyksXG5cdFx0Zmlyc3ROYW1lOiB0KCdjb250YWN0cycsICdGaXJzdCBuYW1lJyksXG5cdFx0cGhvbmV0aWNGaXJzdE5hbWU6IHQoJ2NvbnRhY3RzJywgJ1Bob25ldGljIGZpcnN0IG5hbWUnKSxcblx0XHRwaG9uZXRpY0xhc3ROYW1lOiB0KCdjb250YWN0cycsICdQaG9uZXRpYyBsYXN0IG5hbWUnKSxcblx0XHRhZGRpdGlvbmFsTmFtZXM6IHQoJ2NvbnRhY3RzJywgJ0FkZGl0aW9uYWwgbmFtZXMnKSxcblx0XHRob25vcmlmaWNQcmVmaXg6IHQoJ2NvbnRhY3RzJywgJ1ByZWZpeCcpLFxuXHRcdGhvbm9yaWZpY1N1ZmZpeDogdCgnY29udGFjdHMnLCAnU3VmZml4JyksXG5cdFx0ZGVsZXRlOiB0KCdjb250YWN0cycsICdEZWxldGUnKVxuXHR9O1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnMoKSB7XG5cdFx0Y3RybC5waG9uZXRpY0VuYWJsZSA9IFNldHRpbmdzU2VydmljZS5nZXQoJ3Bob25ldGljRW5hYmxlJyk7XG5cdFx0Y3RybC5yZXZlcnNlTmFtZU9yZGVyID0gU2V0dGluZ3NTZXJ2aWNlLmdldCgncmV2ZXJzZU5hbWVPcmRlcicpO1xuXHR9XG5cdFNldHRpbmdzU2VydmljZS5zdWJzY3JpYmUodXBkYXRlT3B0aW9ucyk7XG5cdHVwZGF0ZU9wdGlvbnMoKTtcblxuXHRjdHJsLmF2YWlsYWJsZU9wdGlvbnMgPSBjdHJsLm1ldGEub3B0aW9ucyB8fCBbXTtcblx0aWYgKCFfLmlzVW5kZWZpbmVkKGN0cmwuZGF0YSkgJiYgIV8uaXNVbmRlZmluZWQoY3RybC5kYXRhLm1ldGEpICYmICFfLmlzVW5kZWZpbmVkKGN0cmwuZGF0YS5tZXRhLnR5cGUpKSB7XG5cdFx0Ly8gcGFyc2UgdHlwZSBvZiB0aGUgcHJvcGVydHlcblx0XHR2YXIgYXJyYXkgPSBjdHJsLmRhdGEubWV0YS50eXBlWzBdLnNwbGl0KCcsJyk7XG5cdFx0YXJyYXkgPSBhcnJheS5tYXAoZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRcdHJldHVybiBlbGVtLnRyaW0oKS5yZXBsYWNlKC9cXC8rJC8sICcnKS5yZXBsYWNlKC9cXFxcKyQvLCAnJykudHJpbSgpLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSk7XG5cdFx0Ly8gdGhlIHByZWYgdmFsdWUgaXMgaGFuZGxlZCBvbiBpdHMgb3duIHNvIHRoYXQgd2UgY2FuIGFkZCBzb21lIGZhdm9yaXRlIGljb24gdG8gdGhlIHVpIGlmIHdlIHdhbnRcblx0XHRpZiAoYXJyYXkuaW5kZXhPZignUFJFRicpID49IDApIHtcblx0XHRcdGN0cmwuaXNQcmVmZXJyZWQgPSB0cnVlO1xuXHRcdFx0YXJyYXkuc3BsaWNlKGFycmF5LmluZGV4T2YoJ1BSRUYnKSwgMSk7XG5cdFx0fVxuXHRcdC8vIHNpbXBseSBqb2luIHRoZSB1cHBlciBjYXNlZCB0eXBlcyB0b2dldGhlciBhcyBrZXlcblx0XHRjdHJsLnR5cGUgPSBhcnJheS5qb2luKCcsJyk7XG5cdFx0dmFyIGRpc3BsYXlOYW1lID0gYXJyYXkubWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZWxlbWVudC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGVsZW1lbnQuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcblx0XHR9KS5qb2luKCcgJyk7XG5cblx0XHQvLyBpbiBjYXNlIHRoZSB0eXBlIGlzIG5vdCB5ZXQgaW4gdGhlIGRlZmF1bHQgbGlzdCBvZiBhdmFpbGFibGUgb3B0aW9ucyB3ZSBhZGQgaXRcblx0XHRpZiAoIWN0cmwuYXZhaWxhYmxlT3B0aW9ucy5zb21lKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuaWQgPT09IGN0cmwudHlwZTsgfSApKSB7XG5cdFx0XHRjdHJsLmF2YWlsYWJsZU9wdGlvbnMgPSBjdHJsLmF2YWlsYWJsZU9wdGlvbnMuY29uY2F0KFt7aWQ6IGN0cmwudHlwZSwgbmFtZTogZGlzcGxheU5hbWV9XSk7XG5cdFx0fVxuXHR9XG5cdGlmICghXy5pc1VuZGVmaW5lZChjdHJsLmRhdGEpICYmICFfLmlzVW5kZWZpbmVkKGN0cmwuZGF0YS5uYW1lc3BhY2UpKSB7XG5cdFx0aWYgKCFfLmlzVW5kZWZpbmVkKGN0cmwubW9kZWwuY29udGFjdC5wcm9wc1snWC1BQkxBQkVMJ10pKSB7XG5cdFx0XHR2YXIgdmFsID0gXy5maW5kKHRoaXMubW9kZWwuY29udGFjdC5wcm9wc1snWC1BQkxBQkVMJ10sIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHgubmFtZXNwYWNlID09PSBjdHJsLmRhdGEubmFtZXNwYWNlOyB9KTtcblx0XHRcdGN0cmwudHlwZSA9IHZhbC52YWx1ZTtcblx0XHRcdGlmICghXy5pc1VuZGVmaW5lZCh2YWwpKSB7XG5cdFx0XHRcdC8vIGluIGNhc2UgdGhlIHR5cGUgaXMgbm90IHlldCBpbiB0aGUgZGVmYXVsdCBsaXN0IG9mIGF2YWlsYWJsZSBvcHRpb25zIHdlIGFkZCBpdFxuXHRcdFx0XHRpZiAoIWN0cmwuYXZhaWxhYmxlT3B0aW9ucy5zb21lKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUuaWQgPT09IHZhbC52YWx1ZTsgfSApKSB7XG5cdFx0XHRcdFx0Y3RybC5hdmFpbGFibGVPcHRpb25zID0gY3RybC5hdmFpbGFibGVPcHRpb25zLmNvbmNhdChbe2lkOiB2YWwudmFsdWUsIG5hbWU6IHZhbC52YWx1ZX1dKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjdHJsLmF2YWlsYWJsZUdyb3VwcyA9IFtdO1xuXG5cdENvbnRhY3RTZXJ2aWNlLmdldEdyb3VwcygpLnRoZW4oZnVuY3Rpb24oZ3JvdXBzKSB7XG5cdFx0Y3RybC5hdmFpbGFibGVHcm91cHMgPSBfLnVuaXF1ZShncm91cHMpO1xuXHR9KTtcblxuXHRjdHJsLmRhdGEucGhvbmV0aWNGaXJzdE5hbWUgPSBjdHJsLm1vZGVsLmNvbnRhY3QucGhvbmV0aWNGaXJzdE5hbWUoKTtcblx0Y3RybC5kYXRhLnBob25ldGljTGFzdE5hbWUgPSBjdHJsLm1vZGVsLmNvbnRhY3QucGhvbmV0aWNMYXN0TmFtZSgpO1xuXG5cdGN0cmwuY2hhbmdlVHlwZSA9IGZ1bmN0aW9uICh2YWwpIHtcblx0XHRpZiAoY3RybC5pc1ByZWZlcnJlZCkge1xuXHRcdFx0dmFsICs9ICcsUFJFRic7XG5cdFx0fVxuXHRcdGN0cmwuZGF0YS5tZXRhID0gY3RybC5kYXRhLm1ldGEgfHwge307XG5cdFx0Y3RybC5kYXRhLm1ldGEudHlwZSA9IGN0cmwuZGF0YS5tZXRhLnR5cGUgfHwgW107XG5cdFx0Y3RybC5kYXRhLm1ldGEudHlwZVswXSA9IHZhbDtcblx0XHRjdHJsLm1vZGVsLnVwZGF0ZUNvbnRhY3QoKTtcblx0fTtcblxuXHRjdHJsLmRhdGVJbnB1dENoYW5nZWQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y3RybC5kYXRhLm1ldGEgPSBjdHJsLmRhdGEubWV0YSB8fCB7fTtcblxuXHRcdHZhciBtYXRjaCA9IGN0cmwuZGF0YS52YWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7Mn0pLShcXGR7Mn0pJC8pO1xuXHRcdGlmIChtYXRjaCkge1xuXHRcdFx0Y3RybC5kYXRhLm1ldGEudmFsdWUgPSBbXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3RybC5kYXRhLm1ldGEudmFsdWUgPSBjdHJsLmRhdGEubWV0YS52YWx1ZSB8fCBbXTtcblx0XHRcdGN0cmwuZGF0YS5tZXRhLnZhbHVlWzBdID0gJ3RleHQnO1xuXHRcdH1cblx0XHRjdHJsLm1vZGVsLnVwZGF0ZUNvbnRhY3QoKTtcblx0fTtcblxuXHRjdHJsLnVwZGF0ZURldGFpbGVkTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZm4gPSAnJztcblx0XHR2YXIgb3JkZXI7XG5cdFx0dmFyIGZuSXRlbSA9IFtdO1xuXHRcdGlmIChjdHJsLnJldmVyc2VOYW1lT3JkZXIpIHtcblx0XHRcdG9yZGVyID0gWyAzLCAwLCAyLCAxLCA0IF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9yZGVyID0gWyAzLCAxLCAyLCAwLCA0IF07XG5cdFx0fVxuXHRcdGFuZ3VsYXIuZm9yRWFjaChvcmRlciwgZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdGlmIChjdHJsLmRhdGEudmFsdWVbaW5kZXhdKSB7XG5cdFx0XHRcdGZuSXRlbS5wdXNoKGN0cmwuZGF0YS52YWx1ZVtpbmRleF0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGZuID0gZm5JdGVtLmpvaW4oJyAnKTtcblxuXHRcdGN0cmwubW9kZWwuY29udGFjdC5mdWxsTmFtZShmbik7XG5cdFx0Y3RybC5tb2RlbC51cGRhdGVDb250YWN0KCk7XG5cdH07XG5cblx0Y3RybC51cGRhdGVQaG9uZXRpY0ZpcnN0TmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRjdHJsLm1vZGVsLmNvbnRhY3QucGhvbmV0aWNGaXJzdE5hbWUoY3RybC5kYXRhLnBob25ldGljRmlyc3ROYW1lKTtcblx0XHRjdHJsLm1vZGVsLnVwZGF0ZUNvbnRhY3QoKTtcblx0fTtcblxuXHRjdHJsLnVwZGF0ZVBob25ldGljTGFzdE5hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y3RybC5tb2RlbC5jb250YWN0LnBob25ldGljTGFzdE5hbWUoY3RybC5kYXRhLnBob25ldGljTGFzdE5hbWUpO1xuXHRcdGN0cmwubW9kZWwudXBkYXRlQ29udGFjdCgpO1xuXHR9O1xuXG5cdGN0cmwuZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdGVtcGxhdGVVcmwgPSBPQy5saW5rVG8oJ2NvbnRhY3RzJywgJ3RlbXBsYXRlcy9kZXRhaWxJdGVtcy8nICsgY3RybC5tZXRhLnRlbXBsYXRlICsgJy5odG1sJyk7XG5cdFx0cmV0dXJuICR0ZW1wbGF0ZVJlcXVlc3QodGVtcGxhdGVVcmwpO1xuXHR9O1xuXG5cdGN0cmwuZGVsZXRlRmllbGQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y3RybC5tb2RlbC5kZWxldGVGaWVsZChjdHJsLm5hbWUsIGN0cmwuZGF0YSk7XG5cdFx0Y3RybC5tb2RlbC51cGRhdGVDb250YWN0KCk7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZGlyZWN0aXZlKCdkZXRhaWxzaXRlbScsIFsnJGNvbXBpbGUnLCBmdW5jdGlvbigkY29tcGlsZSkge1xuXHRyZXR1cm4ge1xuXHRcdHNjb3BlOiB7fSxcblx0XHRjb250cm9sbGVyOiAnZGV0YWlsc0l0ZW1DdHJsJyxcblx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRuYW1lOiAnPScsXG5cdFx0XHRkYXRhOiAnPScsXG5cdFx0XHRtb2RlbDogJz0nXG5cdFx0fSxcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcblx0XHRcdGN0cmwuZ2V0VGVtcGxhdGUoKS50aGVuKGZ1bmN0aW9uKGh0bWwpIHtcblx0XHRcdFx0dmFyIHRlbXBsYXRlID0gYW5ndWxhci5lbGVtZW50KGh0bWwpO1xuXHRcdFx0XHRlbGVtZW50LmFwcGVuZCh0ZW1wbGF0ZSk7XG5cdFx0XHRcdCRjb21waWxlKHRlbXBsYXRlKShzY29wZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmNvbnRyb2xsZXIoJ2dyb3VwQ3RybCcsIGZ1bmN0aW9uKCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblx0dmFyIGN0cmwgPSB0aGlzO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnZ3JvdXAnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0EnLCAvLyBoYXMgdG8gYmUgYW4gYXR0cmlidXRlIHRvIHdvcmsgd2l0aCBjb3JlIGNzc1xuXHRcdHNjb3BlOiB7fSxcblx0XHRjb250cm9sbGVyOiAnZ3JvdXBDdHJsJyxcblx0XHRjb250cm9sbGVyQXM6ICdjdHJsJyxcblx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRncm91cDogJz1kYXRhJ1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnY29udGFjdHMnLCAndGVtcGxhdGVzL2dyb3VwLmh0bWwnKVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmNvbnRyb2xsZXIoJ2dyb3VwbGlzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENvbnRhY3RTZXJ2aWNlLCBTZWFyY2hTZXJ2aWNlLCAkcm91dGVQYXJhbXMpIHtcblx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdHZhciBpbml0aWFsR3JvdXBzID0gW3QoJ2NvbnRhY3RzJywgJ0FsbCBjb250YWN0cycpLCB0KCdjb250YWN0cycsICdOb3QgZ3JvdXBlZCcpXTtcblxuXHRjdHJsLmdyb3VwcyA9IGluaXRpYWxHcm91cHM7XG5cblx0Q29udGFjdFNlcnZpY2UuZ2V0R3JvdXBzKCkudGhlbihmdW5jdGlvbihncm91cHMpIHtcblx0XHRjdHJsLmdyb3VwcyA9IF8udW5pcXVlKGluaXRpYWxHcm91cHMuY29uY2F0KGdyb3VwcykpO1xuXHR9KTtcblxuXHRjdHJsLmdldFNlbGVjdGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRyb3V0ZVBhcmFtcy5naWQ7XG5cdH07XG5cblx0Ly8gVXBkYXRlIGdyb3VwTGlzdCBvbiBjb250YWN0IGFkZC9kZWxldGUvdXBkYXRlXG5cdENvbnRhY3RTZXJ2aWNlLnJlZ2lzdGVyT2JzZXJ2ZXJDYWxsYmFjayhmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuXHRcdFx0Q29udGFjdFNlcnZpY2UuZ2V0R3JvdXBzKCkudGhlbihmdW5jdGlvbihncm91cHMpIHtcblx0XHRcdFx0Y3RybC5ncm91cHMgPSBfLnVuaXF1ZShpbml0aWFsR3JvdXBzLmNvbmNhdChncm91cHMpKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRjdHJsLnNldFNlbGVjdGVkID0gZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXApIHtcblx0XHRTZWFyY2hTZXJ2aWNlLmNsZWFuU2VhcmNoKCk7XG5cdFx0JHJvdXRlUGFyYW1zLmdpZCA9IHNlbGVjdGVkR3JvdXA7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZGlyZWN0aXZlKCdncm91cGxpc3QnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0VBJywgLy8gaGFzIHRvIGJlIGFuIGF0dHJpYnV0ZSB0byB3b3JrIHdpdGggY29yZSBjc3Ncblx0XHRzY29wZToge30sXG5cdFx0Y29udHJvbGxlcjogJ2dyb3VwbGlzdEN0cmwnLFxuXHRcdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2NvbnRhY3RzJywgJ3RlbXBsYXRlcy9ncm91cExpc3QuaHRtbCcpXG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uY29udHJvbGxlcignbmV3Q29udGFjdEJ1dHRvbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENvbnRhY3RTZXJ2aWNlLCAkcm91dGVQYXJhbXMsIHZDYXJkUHJvcGVydGllc1NlcnZpY2UpIHtcblx0dmFyIGN0cmwgPSB0aGlzO1xuXG5cdGN0cmwudCA9IHtcblx0XHRhZGRDb250YWN0IDogdCgnY29udGFjdHMnLCAnTmV3IGNvbnRhY3QnKVxuXHR9O1xuXG5cdGN0cmwuY3JlYXRlQ29udGFjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdENvbnRhY3RTZXJ2aWNlLmNyZWF0ZSgpLnRoZW4oZnVuY3Rpb24oY29udGFjdCkge1xuXHRcdFx0Wyd0ZWwnLCAnYWRyJywgJ2VtYWlsJ10uZm9yRWFjaChmdW5jdGlvbihmaWVsZCkge1xuXHRcdFx0XHR2YXIgZGVmYXVsdFZhbHVlID0gdkNhcmRQcm9wZXJ0aWVzU2VydmljZS5nZXRNZXRhKGZpZWxkKS5kZWZhdWx0VmFsdWUgfHwge3ZhbHVlOiAnJ307XG5cdFx0XHRcdGNvbnRhY3QuYWRkUHJvcGVydHkoZmllbGQsIGRlZmF1bHRWYWx1ZSk7XG5cdFx0XHR9ICk7XG5cdFx0XHRpZiAoW3QoJ2NvbnRhY3RzJywgJ0FsbCBjb250YWN0cycpLCB0KCdjb250YWN0cycsICdOb3QgZ3JvdXBlZCcpXS5pbmRleE9mKCRyb3V0ZVBhcmFtcy5naWQpID09PSAtMSkge1xuXHRcdFx0XHRjb250YWN0LmNhdGVnb3JpZXMoJHJvdXRlUGFyYW1zLmdpZCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb250YWN0LmNhdGVnb3JpZXMoJycpO1xuXHRcdFx0fVxuXHRcdFx0JCgnI2RldGFpbHMtZnVsbE5hbWUnKS5mb2N1cygpO1xuXHRcdH0pO1xuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgnbmV3Y29udGFjdGJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRUEnLCAvLyBoYXMgdG8gYmUgYW4gYXR0cmlidXRlIHRvIHdvcmsgd2l0aCBjb3JlIGNzc1xuXHRcdHNjb3BlOiB7fSxcblx0XHRjb250cm9sbGVyOiAnbmV3Q29udGFjdEJ1dHRvbkN0cmwnLFxuXHRcdGNvbnRyb2xsZXJBczogJ2N0cmwnLFxuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHt9LFxuXHRcdHRlbXBsYXRlVXJsOiBPQy5saW5rVG8oJ2NvbnRhY3RzJywgJ3RlbXBsYXRlcy9uZXdDb250YWN0QnV0dG9uLmh0bWwnKVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmRpcmVjdGl2ZSgndGVsTW9kZWwnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQScsXG5cdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBuZ01vZGVsKSB7XG5cdFx0XHRuZ01vZGVsLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0XHRuZ01vZGVsLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmNvbnRyb2xsZXIoJ3NvcnRieUN0cmwnLCBmdW5jdGlvbihTb3J0QnlTZXJ2aWNlKSB7XG5cdHZhciBjdHJsID0gdGhpcztcblxuXHR2YXIgc29ydFRleHQgPSB0KCdjb250YWN0cycsICdTb3J0IGJ5Jyk7XG5cdGN0cmwuc29ydFRleHQgPSBzb3J0VGV4dDtcblxuXHR2YXIgc29ydExpc3QgPSBTb3J0QnlTZXJ2aWNlLmdldFNvcnRCeUxpc3QoKTtcblx0Y3RybC5zb3J0TGlzdCA9IHNvcnRMaXN0O1xuXG5cdGN0cmwuZGVmYXVsdE9yZGVyID0gU29ydEJ5U2VydmljZS5nZXRTb3J0QnkoKTtcblxuXHRjdHJsLnVwZGF0ZVNvcnRCeSA9IGZ1bmN0aW9uKCkge1xuXHRcdFNvcnRCeVNlcnZpY2Uuc2V0U29ydEJ5KGN0cmwuZGVmYXVsdE9yZGVyKTtcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5kaXJlY3RpdmUoJ3NvcnRieScsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHByaW9yaXR5OiAxLFxuXHRcdHNjb3BlOiB7fSxcblx0XHRjb250cm9sbGVyOiAnc29ydGJ5Q3RybCcsXG5cdFx0Y29udHJvbGxlckFzOiAnY3RybCcsXG5cdFx0YmluZFRvQ29udHJvbGxlcjoge30sXG5cdFx0dGVtcGxhdGVVcmw6IE9DLmxpbmtUbygnY29udGFjdHMnLCAndGVtcGxhdGVzL3NvcnRCeS5odG1sJylcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5mYWN0b3J5KCdBZGRyZXNzQm9vaycsIGZ1bmN0aW9uKClcbntcblx0cmV0dXJuIGZ1bmN0aW9uIEFkZHJlc3NCb29rKGRhdGEpIHtcblx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLCB7XG5cblx0XHRcdGRpc3BsYXlOYW1lOiAnJyxcblx0XHRcdGNvbnRhY3RzOiBbXSxcblx0XHRcdGdyb3VwczogZGF0YS5kYXRhLnByb3BzLmdyb3VwcyxcblxuXHRcdFx0Z2V0Q29udGFjdDogZnVuY3Rpb24odWlkKSB7XG5cdFx0XHRcdGZvcih2YXIgaSBpbiB0aGlzLmNvbnRhY3RzKSB7XG5cdFx0XHRcdFx0aWYodGhpcy5jb250YWN0c1tpXS51aWQoKSA9PT0gdWlkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb250YWN0c1tpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH0sXG5cblx0XHRcdHNoYXJlZFdpdGg6IHtcblx0XHRcdFx0dXNlcnM6IFtdLFxuXHRcdFx0XHRncm91cHM6IFtdXG5cdFx0XHR9XG5cblx0XHR9KTtcblx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLCBkYXRhKTtcblx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLCB7XG5cdFx0XHRvd25lcjogZGF0YS51cmwuc3BsaXQoJy8nKS5zbGljZSgtMywgLTIpWzBdXG5cdFx0fSk7XG5cblx0XHR2YXIgc2hhcmVzID0gdGhpcy5kYXRhLnByb3BzLmludml0ZTtcblx0XHRpZiAodHlwZW9mIHNoYXJlcyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgc2hhcmVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHZhciBocmVmID0gc2hhcmVzW2pdLmhyZWY7XG5cdFx0XHRcdGlmIChocmVmLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBhY2Nlc3MgPSBzaGFyZXNbal0uYWNjZXNzO1xuXHRcdFx0XHRpZiAoYWNjZXNzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIHJlYWRXcml0ZSA9ICh0eXBlb2YgYWNjZXNzLnJlYWRXcml0ZSAhPT0gJ3VuZGVmaW5lZCcpO1xuXG5cdFx0XHRcdGlmIChocmVmLnN0YXJ0c1dpdGgoJ3ByaW5jaXBhbDpwcmluY2lwYWxzL3VzZXJzLycpKSB7XG5cdFx0XHRcdFx0dGhpcy5zaGFyZWRXaXRoLnVzZXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0aWQ6IGhyZWYuc3Vic3RyKDI3KSxcblx0XHRcdFx0XHRcdGRpc3BsYXluYW1lOiBocmVmLnN1YnN0cigyNyksXG5cdFx0XHRcdFx0XHR3cml0YWJsZTogcmVhZFdyaXRlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaHJlZi5zdGFydHNXaXRoKCdwcmluY2lwYWw6cHJpbmNpcGFscy9ncm91cHMvJykpIHtcblx0XHRcdFx0XHR0aGlzLnNoYXJlZFdpdGguZ3JvdXBzLnB1c2goe1xuXHRcdFx0XHRcdFx0aWQ6IGhyZWYuc3Vic3RyKDI4KSxcblx0XHRcdFx0XHRcdGRpc3BsYXluYW1lOiBocmVmLnN1YnN0cigyOCksXG5cdFx0XHRcdFx0XHR3cml0YWJsZTogcmVhZFdyaXRlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL3ZhciBvd25lciA9IHRoaXMuZGF0YS5wcm9wcy5vd25lcjtcblx0XHQvL2lmICh0eXBlb2Ygb3duZXIgIT09ICd1bmRlZmluZWQnICYmIG93bmVyLmxlbmd0aCAhPT0gMCkge1xuXHRcdC8vXHRvd25lciA9IG93bmVyLnRyaW0oKTtcblx0XHQvL1x0aWYgKG93bmVyLnN0YXJ0c1dpdGgoJy9yZW1vdGUucGhwL2Rhdi9wcmluY2lwYWxzL3VzZXJzLycpKSB7XG5cdFx0Ly9cdFx0dGhpcy5fcHJvcGVydGllcy5vd25lciA9IG93bmVyLnN1YnN0cigzMyk7XG5cdFx0Ly9cdH1cblx0XHQvL31cblxuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmZhY3RvcnkoJ0NvbnRhY3QnLCBmdW5jdGlvbigkZmlsdGVyKSB7XG5cdHJldHVybiBmdW5jdGlvbiBDb250YWN0KGFkZHJlc3NCb29rLCB2Q2FyZCkge1xuXHRcdGFuZ3VsYXIuZXh0ZW5kKHRoaXMsIHtcblxuXHRcdFx0ZGF0YToge30sXG5cdFx0XHRwcm9wczoge30sXG5cdFx0XHQvLyBBbGxvdyBhZGRyZXNzZXMgJiBub24tYWRkcmVzcyBwcm9wcyB0byBiZSBkaXNwbGF5ZWQgaW4gc2VwYXJhdGUgY29sdW1uc1xuXHRcdFx0YWRkcmVzc2VzOiB7fSxcblx0XHRcdG5vbkFkZHJlc3Nlczoge30sXG5cblx0XHRcdGRhdGVQcm9wZXJ0aWVzOiBbJ2JkYXknLCAnYW5uaXZlcnNhcnknLCAnZGVhdGhkYXRlJ10sXG5cblx0XHRcdGFkZHJlc3NCb29rSWQ6IGFkZHJlc3NCb29rLmRpc3BsYXlOYW1lLFxuXG5cdFx0XHR2ZXJzaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgndmVyc2lvbicpO1xuXHRcdFx0XHRpZihwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHR9LFxuXG5cdFx0XHR1aWQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBtb2RlbCA9IHRoaXM7XG5cdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRyZXR1cm4gbW9kZWwuc2V0UHJvcGVydHkoJ3VpZCcsIHsgdmFsdWU6IHZhbHVlIH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGdldHRlclxuXHRcdFx0XHRcdHJldHVybiBtb2RlbC5nZXRQcm9wZXJ0eSgndWlkJykudmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHNvcnRGaXJzdE5hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gW3RoaXMuZmlyc3ROYW1lKCksIHRoaXMubGFzdE5hbWUoKV07XG5cdFx0XHR9LFxuXG5cdFx0XHRzb3J0TGFzdE5hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gW3RoaXMubGFzdE5hbWUoKSwgdGhpcy5maXJzdE5hbWUoKV07XG5cdFx0XHR9LFxuXG5cdFx0XHRzb3J0UGhvbmV0aWNGaXJzdE5hbWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gW3RoaXMucGhvbmV0aWNGaXJzdE5hbWUoKSA/IHRoaXMucGhvbmV0aWNGaXJzdE5hbWUoKSA6IHRoaXMuZmlyc3ROYW1lKCksXG5cdFx0XHRcdFx0dGhpcy5waG9uZXRpY0xhc3ROYW1lKCkgPyB0aGlzLnBob25ldGljTGFzdE5hbWUoKSA6IHRoaXMubGFzdE5hbWUoKV07XG5cdFx0XHR9LFxuXG5cdFx0XHRzb3J0UGhvbmV0aWNMYXN0TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBbdGhpcy5waG9uZXRpY0xhc3ROYW1lKCkgPyB0aGlzLnBob25ldGljTGFzdE5hbWUoKSA6IHRoaXMubGFzdE5hbWUoKSxcblx0XHRcdFx0XHR0aGlzLnBob25ldGljRmlyc3ROYW1lKCkgPyB0aGlzLnBob25ldGljRmlyc3ROYW1lKCkgOiB0aGlzLmZpcnN0TmFtZSgpXTtcblx0XHRcdH0sXG5cblx0XHRcdHNvcnREaXNwbGF5TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRpc3BsYXlOYW1lKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHRkaXNwbGF5TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmZ1bGxOYW1lKCkgfHwgdGhpcy5vcmcoKSB8fCAnJztcblx0XHRcdH0sXG5cblx0XHRcdGZpcnN0TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBwcm9wZXJ0eSA9IHRoaXMuZ2V0UHJvcGVydHkoJ24nKTtcblx0XHRcdFx0aWYgKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlWzFdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRpc3BsYXlOYW1lKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGxhc3ROYW1lOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgnbicpO1xuXHRcdFx0XHRpZiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWVbMF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZGlzcGxheU5hbWUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0cGhvbmV0aWNGaXJzdE5hbWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBtb2RlbCA9IHRoaXM7XG5cdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRQcm9wZXJ0eSgnWC1QSE9ORVRJQy1GSVJTVC1OQU1FJywgeyB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gbW9kZWwuZ2V0UHJvcGVydHkoJ1gtUEhPTkVUSUMtRklSU1QtTkFNRScpO1xuXHRcdFx0XHRcdGlmKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHBob25ldGljTGFzdE5hbWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdHZhciBtb2RlbCA9IHRoaXM7XG5cdFx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZCh2YWx1ZSkpIHtcblx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zZXRQcm9wZXJ0eSgnWC1QSE9ORVRJQy1MQVNULU5BTUUnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHR2YXIgcHJvcGVydHkgPSBtb2RlbC5nZXRQcm9wZXJ0eSgnWC1QSE9ORVRJQy1MQVNULU5BTUUnKTtcblx0XHRcdFx0XHRpZihwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRhZGRpdGlvbmFsTmFtZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCduJyk7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZVsyXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGZ1bGxOYW1lOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzO1xuXHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoJ2ZuJywgeyB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gbW9kZWwuZ2V0UHJvcGVydHkoJ2ZuJyk7XG5cdFx0XHRcdFx0aWYocHJvcGVydHkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHJvcGVydHkgPSBtb2RlbC5nZXRQcm9wZXJ0eSgnbicpO1xuXHRcdFx0XHRcdGlmKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcHJvcGVydHkudmFsdWUuZmlsdGVyKGZ1bmN0aW9uKGVsZW0pIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGVsZW07XG5cdFx0XHRcdFx0XHR9KS5qb2luKCcgJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHRpdGxlOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoJ3RpdGxlJywgeyB2YWx1ZTogdmFsdWUgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgndGl0bGUnKTtcblx0XHRcdFx0XHRpZihwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0b3JnOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdvcmcnKTtcblx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSkge1xuXHRcdFx0XHRcdHZhciB2YWwgPSB2YWx1ZTtcblx0XHRcdFx0XHQvLyBzZXR0ZXJcblx0XHRcdFx0XHRpZihwcm9wZXJ0eSAmJiBBcnJheS5pc0FycmF5KHByb3BlcnR5LnZhbHVlKSkge1xuXHRcdFx0XHRcdFx0dmFsID0gcHJvcGVydHkudmFsdWU7XG5cdFx0XHRcdFx0XHR2YWxbMF0gPSB2YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoJ29yZycsIHsgdmFsdWU6IHZhbCB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBnZXR0ZXJcblx0XHRcdFx0XHRpZihwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocHJvcGVydHkudmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZVswXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGVtYWlsOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eSA9IHRoaXMuZ2V0UHJvcGVydHkoJ2VtYWlsJyk7XG5cdFx0XHRcdGlmKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHBob3RvOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0Ly8gc3BsaXRzIGltYWdlIGRhdGEgaW50byBcImRhdGE6aW1hZ2UvanBlZ1wiIGFuZCBiYXNlIDY0IGVuY29kZWQgaW1hZ2Vcblx0XHRcdFx0XHR2YXIgaW1hZ2VEYXRhID0gdmFsdWUuc3BsaXQoJztiYXNlNjQsJyk7XG5cdFx0XHRcdFx0dmFyIGltYWdlVHlwZSA9IGltYWdlRGF0YVswXS5zbGljZSgnZGF0YTonLmxlbmd0aCk7XG5cdFx0XHRcdFx0aWYgKCFpbWFnZVR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UvJykpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aW1hZ2VUeXBlID0gaW1hZ2VUeXBlLnN1YnN0cmluZyg2KS50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0UHJvcGVydHkoJ3Bob3RvJywgeyB2YWx1ZTogaW1hZ2VEYXRhWzFdLCBtZXRhOiB7dHlwZTogW2ltYWdlVHlwZV0sIGVuY29kaW5nOiBbJ2InXX0gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgncGhvdG8nKTtcblx0XHRcdFx0XHRpZihwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0dmFyIHR5cGUgPSBwcm9wZXJ0eS5tZXRhLnR5cGU7XG5cdFx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc1VuZGVmaW5lZCh0eXBlKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNBcnJheSh0eXBlKSkge1xuXHRcdFx0XHRcdFx0XHR0eXBlID0gdHlwZVswXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghdHlwZS5zdGFydHNXaXRoKCdpbWFnZS8nKSkge1xuXHRcdFx0XHRcdFx0XHR0eXBlID0gJ2ltYWdlLycgKyB0eXBlLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ2RhdGE6JyArIHR5cGUgKyAnO2Jhc2U2NCwnICsgcHJvcGVydHkudmFsdWU7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRjYXRlZ29yaWVzOiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQodmFsdWUpKSB7XG5cdFx0XHRcdFx0Ly8gc2V0dGVyXG5cdFx0XHRcdFx0aWYgKGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpKSB7XG5cdFx0XHRcdFx0XHQvKiBjaGVjayBmb3IgZW1wdHkgc3RyaW5nICovXG5cdFx0XHRcdFx0XHR0aGlzLnNldFByb3BlcnR5KCdjYXRlZ29yaWVzJywgeyB2YWx1ZTogIXZhbHVlLmxlbmd0aCA/IFtdIDogW3ZhbHVlXSB9KTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFuZ3VsYXIuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0XHRcdHRoaXMuc2V0UHJvcGVydHkoJ2NhdGVnb3JpZXMnLCB7IHZhbHVlOiB2YWx1ZSB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gZ2V0dGVyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5ID0gdGhpcy5nZXRQcm9wZXJ0eSgnY2F0ZWdvcmllcycpO1xuXHRcdFx0XHRcdGlmKCFwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0FycmF5KHByb3BlcnR5LnZhbHVlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gW3Byb3BlcnR5LnZhbHVlXTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Zm9ybWF0RGF0ZUFzUkZDNjM1MDogZnVuY3Rpb24obmFtZSwgZGF0YSkge1xuXHRcdFx0XHRpZiAoXy5pc1VuZGVmaW5lZChkYXRhKSB8fCBfLmlzVW5kZWZpbmVkKGRhdGEudmFsdWUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuZGF0ZVByb3BlcnRpZXMuaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcblx0XHRcdFx0XHR2YXIgbWF0Y2ggPSBkYXRhLnZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSkkLyk7XG5cdFx0XHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnZhbHVlID0gbWF0Y2hbMV0gKyBtYXRjaFsyXSArIG1hdGNoWzNdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSxcblxuXHRcdFx0Zm9ybWF0RGF0ZUZvckRpc3BsYXk6IGZ1bmN0aW9uKG5hbWUsIGRhdGEpIHtcblx0XHRcdFx0aWYgKF8uaXNVbmRlZmluZWQoZGF0YSkgfHwgXy5pc1VuZGVmaW5lZChkYXRhLnZhbHVlKSkge1xuXHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLmRhdGVQcm9wZXJ0aWVzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gZGF0YS52YWx1ZS5tYXRjaCgvXihcXGR7NH0pKFxcZHsyfSkoXFxkezJ9KSQvKTtcblx0XHRcdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0XHRcdGRhdGEudmFsdWUgPSBtYXRjaFsxXSArICctJyArIG1hdGNoWzJdICsgJy0nICsgbWF0Y2hbM107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LFxuXG5cdFx0XHRnZXRQcm9wZXJ0eTogZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0XHRpZiAodGhpcy5wcm9wc1tuYW1lXSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmZvcm1hdERhdGVGb3JEaXNwbGF5KG5hbWUsIHRoaXMucHJvcHNbbmFtZV1bMF0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhZGRQcm9wZXJ0eTogZnVuY3Rpb24obmFtZSwgZGF0YSkge1xuXHRcdFx0XHRkYXRhID0gYW5ndWxhci5jb3B5KGRhdGEpO1xuXHRcdFx0XHRkYXRhID0gdGhpcy5mb3JtYXREYXRlQXNSRkM2MzUwKG5hbWUsIGRhdGEpO1xuXHRcdFx0XHRpZighdGhpcy5wcm9wc1tuYW1lXSkge1xuXHRcdFx0XHRcdHRoaXMucHJvcHNbbmFtZV0gPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgaWR4ID0gdGhpcy5wcm9wc1tuYW1lXS5sZW5ndGg7XG5cdFx0XHRcdHRoaXMucHJvcHNbbmFtZV1baWR4XSA9IGRhdGE7XG5cblx0XHRcdFx0dGhpcy5zZXRQcm9wc0ZvckRpc3BsYXkoKTtcblxuXHRcdFx0XHQvLyBrZWVwIHZDYXJkIGluIHN5bmNcblx0XHRcdFx0dGhpcy5kYXRhLmFkZHJlc3NEYXRhID0gJGZpbHRlcignSlNPTjJ2Q2FyZCcpKHRoaXMucHJvcHMpO1xuXHRcdFx0XHRyZXR1cm4gaWR4O1xuXHRcdFx0fSxcblx0XHRcdHNldFByb3BlcnR5OiBmdW5jdGlvbihuYW1lLCBkYXRhKSB7XG5cdFx0XHRcdGlmKCF0aGlzLnByb3BzW25hbWVdKSB7XG5cdFx0XHRcdFx0dGhpcy5wcm9wc1tuYW1lXSA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGRhdGEgPSB0aGlzLmZvcm1hdERhdGVBc1JGQzYzNTAobmFtZSwgZGF0YSk7XG5cdFx0XHRcdHRoaXMucHJvcHNbbmFtZV1bMF0gPSBkYXRhO1xuXG5cdFx0XHRcdC8vIGtlZXAgdkNhcmQgaW4gc3luY1xuXHRcdFx0XHR0aGlzLmRhdGEuYWRkcmVzc0RhdGEgPSAkZmlsdGVyKCdKU09OMnZDYXJkJykodGhpcy5wcm9wcyk7XG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlUHJvcGVydHk6IGZ1bmN0aW9uIChuYW1lLCBwcm9wKSB7XG5cdFx0XHRcdGFuZ3VsYXIuY29weShfLndpdGhvdXQodGhpcy5wcm9wc1tuYW1lXSwgcHJvcCksIHRoaXMucHJvcHNbbmFtZV0pO1xuXHRcdFx0XHR0aGlzLmRhdGEuYWRkcmVzc0RhdGEgPSAkZmlsdGVyKCdKU09OMnZDYXJkJykodGhpcy5wcm9wcyk7XG5cdFx0XHRcdHRoaXMuc2V0UHJvcHNGb3JEaXNwbGF5KCk7XG5cdFx0XHR9LFxuXHRcdFx0c2V0RVRhZzogZnVuY3Rpb24oZXRhZykge1xuXHRcdFx0XHR0aGlzLmRhdGEuZXRhZyA9IGV0YWc7XG5cdFx0XHR9LFxuXHRcdFx0c2V0VXJsOiBmdW5jdGlvbihhZGRyZXNzQm9vaywgdWlkKSB7XG5cdFx0XHRcdHRoaXMuZGF0YS51cmwgPSBhZGRyZXNzQm9vay51cmwgKyB1aWQgKyAnLnZjZic7XG5cdFx0XHR9LFxuXG5cdFx0XHRnZXRJU09EYXRlOiBmdW5jdGlvbihkYXRlKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIHBhZChudW1iZXIpIHtcblx0XHRcdFx0XHRpZiAobnVtYmVyIDwgMTApIHtcblx0XHRcdFx0XHRcdHJldHVybiAnMCcgKyBudW1iZXI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiAnJyArIG51bWJlcjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgKyAnJyArXG5cdFx0XHRcdFx0XHRwYWQoZGF0ZS5nZXRVVENNb250aCgpICsgMSkgK1xuXHRcdFx0XHRcdFx0cGFkKGRhdGUuZ2V0VVRDRGF0ZSgpKSArXG5cdFx0XHRcdFx0XHQnVCcgKyBwYWQoZGF0ZS5nZXRVVENIb3VycygpKSArXG5cdFx0XHRcdFx0XHRwYWQoZGF0ZS5nZXRVVENNaW51dGVzKCkpICtcblx0XHRcdFx0XHRcdHBhZChkYXRlLmdldFVUQ1NlY29uZHMoKSkgKyAnWic7XG5cdFx0XHR9LFxuXG5cdFx0XHRzeW5jVkNhcmQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdHRoaXMuc2V0UHJvcGVydHkoJ3JldicsIHsgdmFsdWU6IHRoaXMuZ2V0SVNPRGF0ZShuZXcgRGF0ZSgpKSB9KTtcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRcdF8uZWFjaCh0aGlzLmRhdGVQcm9wZXJ0aWVzLCBmdW5jdGlvbihuYW1lKSB7XG5cdFx0XHRcdFx0aWYgKCFfLmlzVW5kZWZpbmVkKHNlbGYucHJvcHNbbmFtZV0pICYmICFfLmlzVW5kZWZpbmVkKHNlbGYucHJvcHNbbmFtZV1bMF0pKSB7XG5cdFx0XHRcdFx0XHQvLyBTZXQgZGF0ZXMgYWdhaW4gdG8gbWFrZSBzdXJlIHRoZXkgYXJlIGluIFJGQy02MzUwIGZvcm1hdFxuXHRcdFx0XHRcdFx0c2VsZi5zZXRQcm9wZXJ0eShuYW1lLCBzZWxmLnByb3BzW25hbWVdWzBdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQvLyBmb3JjZSBmbiB0byBiZSBzZXRcblx0XHRcdFx0dGhpcy5mdWxsTmFtZSh0aGlzLmZ1bGxOYW1lKCkpO1xuXG5cdFx0XHRcdC8vIGtlZXAgdkNhcmQgaW4gc3luY1xuXHRcdFx0XHRzZWxmLmRhdGEuYWRkcmVzc0RhdGEgPSAkZmlsdGVyKCdKU09OMnZDYXJkJykoc2VsZi5wcm9wcyk7XG5cdFx0XHR9LFxuXG5cdFx0XHRtYXRjaGVzOiBmdW5jdGlvbihwYXR0ZXJuKSB7XG5cdFx0XHRcdGlmIChfLmlzVW5kZWZpbmVkKHBhdHRlcm4pIHx8IHBhdHRlcm4ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIG1vZGVsID0gdGhpcztcblx0XHRcdFx0dmFyIG1hdGNoaW5nUHJvcHMgPSBbJ2ZuJywgJ3RpdGxlJywgJ29yZycsICdlbWFpbCcsICduaWNrbmFtZScsICdub3RlJywgJ3VybCcsICdjbG91ZCcsICdhZHInLCAnaW1wcCcsICd0ZWwnXS5maWx0ZXIoZnVuY3Rpb24gKHByb3BOYW1lKSB7XG5cdFx0XHRcdFx0aWYgKG1vZGVsLnByb3BzW3Byb3BOYW1lXSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsLnByb3BzW3Byb3BOYW1lXS5maWx0ZXIoZnVuY3Rpb24gKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRcdGlmICghcHJvcGVydHkudmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKF8uaXNTdHJpbmcocHJvcGVydHkudmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHByb3BlcnR5LnZhbHVlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihwYXR0ZXJuLnRvTG93ZXJDYXNlKCkpICE9PSAtMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoXy5pc0FycmF5KHByb3BlcnR5LnZhbHVlKSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwcm9wZXJ0eS52YWx1ZS5maWx0ZXIoZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHYudG9Mb3dlckNhc2UoKS5pbmRleE9mKHBhdHRlcm4udG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuXHRcdFx0XHRcdFx0XHRcdH0pLmxlbmd0aCA+IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fSkubGVuZ3RoID4gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIG1hdGNoaW5nUHJvcHMubGVuZ3RoID4gMDtcblx0XHRcdH0sXG5cblx0XHRcdHNldFByb3BzRm9yRGlzcGxheTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGFuZ3VsYXIuZXh0ZW5kKHRoaXMubm9uQWRkcmVzc2VzLCB0aGlzLnByb3BzKTtcblx0XHRcdFx0ZGVsZXRlKHRoaXMubm9uQWRkcmVzc2VzLmFkcik7XG5cdFx0XHRcdHRoaXMuYWRkcmVzc2VzLmFkciA9IHRoaXMucHJvcHMuYWRyO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0XHRpZihhbmd1bGFyLmlzRGVmaW5lZCh2Q2FyZCkpIHtcblx0XHRcdGFuZ3VsYXIuZXh0ZW5kKHRoaXMuZGF0YSwgdkNhcmQpO1xuXHRcdFx0YW5ndWxhci5leHRlbmQodGhpcy5wcm9wcywgJGZpbHRlcigndkNhcmQySlNPTicpKHRoaXMuZGF0YS5hZGRyZXNzRGF0YSkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhbmd1bGFyLmV4dGVuZCh0aGlzLnByb3BzLCB7XG5cdFx0XHRcdHZlcnNpb246IFt7dmFsdWU6ICczLjAnfV0sXG5cdFx0XHRcdGZuOiBbe3ZhbHVlOiAnJ31dXG5cdFx0XHR9KTtcblx0XHRcdHRoaXMuZGF0YS5hZGRyZXNzRGF0YSA9ICRmaWx0ZXIoJ0pTT04ydkNhcmQnKSh0aGlzLnByb3BzKTtcblx0XHR9XG5cblx0XHR2YXIgcHJvcGVydHkgPSB0aGlzLmdldFByb3BlcnR5KCdjYXRlZ29yaWVzJyk7XG5cdFx0aWYoIXByb3BlcnR5KSB7XG5cdFx0XHR0aGlzLmNhdGVnb3JpZXMoJycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYW5ndWxhci5pc1N0cmluZyhwcm9wZXJ0eS52YWx1ZSkpIHtcblx0XHRcdFx0dGhpcy5jYXRlZ29yaWVzKFtwcm9wZXJ0eS52YWx1ZV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuc2V0UHJvcHNGb3JEaXNwbGF5KCk7XG5cblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5mYWN0b3J5KCdBZGRyZXNzQm9va1NlcnZpY2UnLCBmdW5jdGlvbihEYXZDbGllbnQsIERhdlNlcnZpY2UsIFNldHRpbmdzU2VydmljZSwgQWRkcmVzc0Jvb2ssICRxKSB7XG5cblx0dmFyIGFkZHJlc3NCb29rcyA9IFtdO1xuXHR2YXIgbG9hZFByb21pc2UgPSB1bmRlZmluZWQ7XG5cblx0dmFyIGxvYWRBbGwgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoYWRkcmVzc0Jvb2tzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiAkcS53aGVuKGFkZHJlc3NCb29rcyk7XG5cdFx0fVxuXHRcdGlmIChfLmlzVW5kZWZpbmVkKGxvYWRQcm9taXNlKSkge1xuXHRcdFx0bG9hZFByb21pc2UgPSBEYXZTZXJ2aWNlLnRoZW4oZnVuY3Rpb24oYWNjb3VudCkge1xuXHRcdFx0XHRsb2FkUHJvbWlzZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0YWRkcmVzc0Jvb2tzID0gYWNjb3VudC5hZGRyZXNzQm9va3MubWFwKGZ1bmN0aW9uKGFkZHJlc3NCb29rKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBBZGRyZXNzQm9vayhhZGRyZXNzQm9vayk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBsb2FkUHJvbWlzZTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldEFsbDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbG9hZEFsbCgpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBhZGRyZXNzQm9va3M7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Z2V0R3JvdXBzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRBbGwoKS50aGVuKGZ1bmN0aW9uKGFkZHJlc3NCb29rcykge1xuXHRcdFx0XHRyZXR1cm4gYWRkcmVzc0Jvb2tzLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50Lmdyb3Vwcztcblx0XHRcdFx0fSkucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0XHRyZXR1cm4gYS5jb25jYXQoYik7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdGdldERlZmF1bHRBZGRyZXNzQm9vazogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gYWRkcmVzc0Jvb2tzWzBdO1xuXHRcdH0sXG5cblx0XHRnZXRBZGRyZXNzQm9vazogZnVuY3Rpb24oZGlzcGxheU5hbWUpIHtcblx0XHRcdHJldHVybiBEYXZTZXJ2aWNlLnRoZW4oZnVuY3Rpb24oYWNjb3VudCkge1xuXHRcdFx0XHRyZXR1cm4gRGF2Q2xpZW50LmdldEFkZHJlc3NCb29rKHtkaXNwbGF5TmFtZTpkaXNwbGF5TmFtZSwgdXJsOmFjY291bnQuaG9tZVVybH0pLnRoZW4oZnVuY3Rpb24oYWRkcmVzc0Jvb2spIHtcblx0XHRcdFx0XHRhZGRyZXNzQm9vayA9IG5ldyBBZGRyZXNzQm9vayh7XG5cdFx0XHRcdFx0XHR1cmw6IGFjY291bnQuaG9tZVVybCtkaXNwbGF5TmFtZSsnLycsXG5cdFx0XHRcdFx0XHRkYXRhOiBhZGRyZXNzQm9va1swXVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGFkZHJlc3NCb29rLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG5cdFx0XHRcdFx0cmV0dXJuIGFkZHJlc3NCb29rO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRjcmVhdGU6IGZ1bmN0aW9uKGRpc3BsYXlOYW1lKSB7XG5cdFx0XHRyZXR1cm4gRGF2U2VydmljZS50aGVuKGZ1bmN0aW9uKGFjY291bnQpIHtcblx0XHRcdFx0cmV0dXJuIERhdkNsaWVudC5jcmVhdGVBZGRyZXNzQm9vayh7ZGlzcGxheU5hbWU6ZGlzcGxheU5hbWUsIHVybDphY2NvdW50LmhvbWVVcmx9KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRkZWxldGU6IGZ1bmN0aW9uKGFkZHJlc3NCb29rKSB7XG5cdFx0XHRyZXR1cm4gRGF2U2VydmljZS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gRGF2Q2xpZW50LmRlbGV0ZUFkZHJlc3NCb29rKGFkZHJlc3NCb29rKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciBpbmRleCA9IGFkZHJlc3NCb29rcy5pbmRleE9mKGFkZHJlc3NCb29rKTtcblx0XHRcdFx0XHRhZGRyZXNzQm9va3Muc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0cmVuYW1lOiBmdW5jdGlvbihhZGRyZXNzQm9vaywgZGlzcGxheU5hbWUpIHtcblx0XHRcdHJldHVybiBEYXZTZXJ2aWNlLnRoZW4oZnVuY3Rpb24oYWNjb3VudCkge1xuXHRcdFx0XHRyZXR1cm4gRGF2Q2xpZW50LnJlbmFtZUFkZHJlc3NCb29rKGFkZHJlc3NCb29rLCB7ZGlzcGxheU5hbWU6ZGlzcGxheU5hbWUsIHVybDphY2NvdW50LmhvbWVVcmx9KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRnZXQ6IGZ1bmN0aW9uKGRpc3BsYXlOYW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZXRBbGwoKS50aGVuKGZ1bmN0aW9uKGFkZHJlc3NCb29rcykge1xuXHRcdFx0XHRyZXR1cm4gYWRkcmVzc0Jvb2tzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LmRpc3BsYXlOYW1lID09PSBkaXNwbGF5TmFtZTtcblx0XHRcdFx0fSlbMF07XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0c3luYzogZnVuY3Rpb24oYWRkcmVzc0Jvb2spIHtcblx0XHRcdHJldHVybiBEYXZDbGllbnQuc3luY0FkZHJlc3NCb29rKGFkZHJlc3NCb29rKTtcblx0XHR9LFxuXG5cdFx0c2hhcmU6IGZ1bmN0aW9uKGFkZHJlc3NCb29rLCBzaGFyZVR5cGUsIHNoYXJlV2l0aCwgd3JpdGFibGUsIGV4aXN0aW5nU2hhcmUpIHtcblx0XHRcdHZhciB4bWxEb2MgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudCgnJywgJycsIG51bGwpO1xuXHRcdFx0dmFyIG9TaGFyZSA9IHhtbERvYy5jcmVhdGVFbGVtZW50KCdvOnNoYXJlJyk7XG5cdFx0XHRvU2hhcmUuc2V0QXR0cmlidXRlKCd4bWxuczpkJywgJ0RBVjonKTtcblx0XHRcdG9TaGFyZS5zZXRBdHRyaWJ1dGUoJ3htbG5zOm8nLCAnaHR0cDovL293bmNsb3VkLm9yZy9ucycpO1xuXHRcdFx0eG1sRG9jLmFwcGVuZENoaWxkKG9TaGFyZSk7XG5cblx0XHRcdHZhciBvU2V0ID0geG1sRG9jLmNyZWF0ZUVsZW1lbnQoJ286c2V0Jyk7XG5cdFx0XHRvU2hhcmUuYXBwZW5kQ2hpbGQob1NldCk7XG5cblx0XHRcdHZhciBkSHJlZiA9IHhtbERvYy5jcmVhdGVFbGVtZW50KCdkOmhyZWYnKTtcblx0XHRcdGlmIChzaGFyZVR5cGUgPT09IE9DLlNoYXJlLlNIQVJFX1RZUEVfVVNFUikge1xuXHRcdFx0XHRkSHJlZi50ZXh0Q29udGVudCA9ICdwcmluY2lwYWw6cHJpbmNpcGFscy91c2Vycy8nO1xuXHRcdFx0fSBlbHNlIGlmIChzaGFyZVR5cGUgPT09IE9DLlNoYXJlLlNIQVJFX1RZUEVfR1JPVVApIHtcblx0XHRcdFx0ZEhyZWYudGV4dENvbnRlbnQgPSAncHJpbmNpcGFsOnByaW5jaXBhbHMvZ3JvdXBzLyc7XG5cdFx0XHR9XG5cdFx0XHRkSHJlZi50ZXh0Q29udGVudCArPSBzaGFyZVdpdGg7XG5cdFx0XHRvU2V0LmFwcGVuZENoaWxkKGRIcmVmKTtcblxuXHRcdFx0dmFyIG9TdW1tYXJ5ID0geG1sRG9jLmNyZWF0ZUVsZW1lbnQoJ286c3VtbWFyeScpO1xuXHRcdFx0b1N1bW1hcnkudGV4dENvbnRlbnQgPSB0KCdjb250YWN0cycsICd7YWRkcmVzc2Jvb2t9IHNoYXJlZCBieSB7b3duZXJ9Jywge1xuXHRcdFx0XHRhZGRyZXNzYm9vazogYWRkcmVzc0Jvb2suZGlzcGxheU5hbWUsXG5cdFx0XHRcdG93bmVyOiBhZGRyZXNzQm9vay5vd25lclxuXHRcdFx0fSk7XG5cdFx0XHRvU2V0LmFwcGVuZENoaWxkKG9TdW1tYXJ5KTtcblxuXHRcdFx0aWYgKHdyaXRhYmxlKSB7XG5cdFx0XHRcdHZhciBvUlcgPSB4bWxEb2MuY3JlYXRlRWxlbWVudCgnbzpyZWFkLXdyaXRlJyk7XG5cdFx0XHRcdG9TZXQuYXBwZW5kQ2hpbGQob1JXKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGJvZHkgPSBvU2hhcmUub3V0ZXJIVE1MO1xuXG5cdFx0XHRyZXR1cm4gRGF2Q2xpZW50Lnhoci5zZW5kKFxuXHRcdFx0XHRkYXYucmVxdWVzdC5iYXNpYyh7bWV0aG9kOiAnUE9TVCcsIGRhdGE6IGJvZHl9KSxcblx0XHRcdFx0YWRkcmVzc0Jvb2sudXJsXG5cdFx0XHQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0aWYgKCFleGlzdGluZ1NoYXJlKSB7XG5cdFx0XHRcdFx0XHRpZiAoc2hhcmVUeXBlID09PSBPQy5TaGFyZS5TSEFSRV9UWVBFX1VTRVIpIHtcblx0XHRcdFx0XHRcdFx0YWRkcmVzc0Jvb2suc2hhcmVkV2l0aC51c2Vycy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0XHRpZDogc2hhcmVXaXRoLFxuXHRcdFx0XHRcdFx0XHRcdGRpc3BsYXluYW1lOiBzaGFyZVdpdGgsXG5cdFx0XHRcdFx0XHRcdFx0d3JpdGFibGU6IHdyaXRhYmxlXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzaGFyZVR5cGUgPT09IE9DLlNoYXJlLlNIQVJFX1RZUEVfR1JPVVApIHtcblx0XHRcdFx0XHRcdFx0YWRkcmVzc0Jvb2suc2hhcmVkV2l0aC5ncm91cHMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0aWQ6IHNoYXJlV2l0aCxcblx0XHRcdFx0XHRcdFx0XHRkaXNwbGF5bmFtZTogc2hhcmVXaXRoLFxuXHRcdFx0XHRcdFx0XHRcdHdyaXRhYmxlOiB3cml0YWJsZVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fSxcblxuXHRcdHVuc2hhcmU6IGZ1bmN0aW9uKGFkZHJlc3NCb29rLCBzaGFyZVR5cGUsIHNoYXJlV2l0aCkge1xuXHRcdFx0dmFyIHhtbERvYyA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50KCcnLCAnJywgbnVsbCk7XG5cdFx0XHR2YXIgb1NoYXJlID0geG1sRG9jLmNyZWF0ZUVsZW1lbnQoJ286c2hhcmUnKTtcblx0XHRcdG9TaGFyZS5zZXRBdHRyaWJ1dGUoJ3htbG5zOmQnLCAnREFWOicpO1xuXHRcdFx0b1NoYXJlLnNldEF0dHJpYnV0ZSgneG1sbnM6bycsICdodHRwOi8vb3duY2xvdWQub3JnL25zJyk7XG5cdFx0XHR4bWxEb2MuYXBwZW5kQ2hpbGQob1NoYXJlKTtcblxuXHRcdFx0dmFyIG9SZW1vdmUgPSB4bWxEb2MuY3JlYXRlRWxlbWVudCgnbzpyZW1vdmUnKTtcblx0XHRcdG9TaGFyZS5hcHBlbmRDaGlsZChvUmVtb3ZlKTtcblxuXHRcdFx0dmFyIGRIcmVmID0geG1sRG9jLmNyZWF0ZUVsZW1lbnQoJ2Q6aHJlZicpO1xuXHRcdFx0aWYgKHNoYXJlVHlwZSA9PT0gT0MuU2hhcmUuU0hBUkVfVFlQRV9VU0VSKSB7XG5cdFx0XHRcdGRIcmVmLnRleHRDb250ZW50ID0gJ3ByaW5jaXBhbDpwcmluY2lwYWxzL3VzZXJzLyc7XG5cdFx0XHR9IGVsc2UgaWYgKHNoYXJlVHlwZSA9PT0gT0MuU2hhcmUuU0hBUkVfVFlQRV9HUk9VUCkge1xuXHRcdFx0XHRkSHJlZi50ZXh0Q29udGVudCA9ICdwcmluY2lwYWw6cHJpbmNpcGFscy9ncm91cHMvJztcblx0XHRcdH1cblx0XHRcdGRIcmVmLnRleHRDb250ZW50ICs9IHNoYXJlV2l0aDtcblx0XHRcdG9SZW1vdmUuYXBwZW5kQ2hpbGQoZEhyZWYpO1xuXHRcdFx0dmFyIGJvZHkgPSBvU2hhcmUub3V0ZXJIVE1MO1xuXG5cblx0XHRcdHJldHVybiBEYXZDbGllbnQueGhyLnNlbmQoXG5cdFx0XHRcdGRhdi5yZXF1ZXN0LmJhc2ljKHttZXRob2Q6ICdQT1NUJywgZGF0YTogYm9keX0pLFxuXHRcdFx0XHRhZGRyZXNzQm9vay51cmxcblx0XHRcdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcblx0XHRcdFx0XHRpZiAoc2hhcmVUeXBlID09PSBPQy5TaGFyZS5TSEFSRV9UWVBFX1VTRVIpIHtcblx0XHRcdFx0XHRcdGFkZHJlc3NCb29rLnNoYXJlZFdpdGgudXNlcnMgPSBhZGRyZXNzQm9vay5zaGFyZWRXaXRoLnVzZXJzLmZpbHRlcihmdW5jdGlvbih1c2VyKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1c2VyLmlkICE9PSBzaGFyZVdpdGg7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHNoYXJlVHlwZSA9PT0gT0MuU2hhcmUuU0hBUkVfVFlQRV9HUk9VUCkge1xuXHRcdFx0XHRcdFx0YWRkcmVzc0Jvb2suc2hhcmVkV2l0aC5ncm91cHMgPSBhZGRyZXNzQm9vay5zaGFyZWRXaXRoLmdyb3Vwcy5maWx0ZXIoZnVuY3Rpb24oZ3JvdXBzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBncm91cHMuaWQgIT09IHNoYXJlV2l0aDtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL3RvZG8gLSByZW1vdmUgZW50cnkgZnJvbSBhZGRyZXNzYm9vayBvYmplY3Rcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cblx0fTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLnNlcnZpY2UoJ0NvbnRhY3RTZXJ2aWNlJywgZnVuY3Rpb24oRGF2Q2xpZW50LCBBZGRyZXNzQm9va1NlcnZpY2UsIENvbnRhY3QsICRxLCBDYWNoZUZhY3RvcnksIHV1aWQ0KSB7XG5cblx0dmFyIGNhY2hlRmlsbGVkID0gZmFsc2U7XG5cblx0dmFyIGNvbnRhY3RzID0gQ2FjaGVGYWN0b3J5KCdjb250YWN0cycpO1xuXG5cdHZhciBvYnNlcnZlckNhbGxiYWNrcyA9IFtdO1xuXG5cdHZhciBsb2FkUHJvbWlzZSA9IHVuZGVmaW5lZDtcblxuXHR0aGlzLnJlZ2lzdGVyT2JzZXJ2ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0b2JzZXJ2ZXJDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdH07XG5cblx0dmFyIG5vdGlmeU9ic2VydmVycyA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgdWlkKSB7XG5cdFx0dmFyIGV2ID0ge1xuXHRcdFx0ZXZlbnQ6IGV2ZW50TmFtZSxcblx0XHRcdHVpZDogdWlkLFxuXHRcdFx0Y29udGFjdHM6IGNvbnRhY3RzLnZhbHVlcygpXG5cdFx0fTtcblx0XHRhbmd1bGFyLmZvckVhY2gob2JzZXJ2ZXJDYWxsYmFja3MsIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHRjYWxsYmFjayhldik7XG5cdFx0fSk7XG5cdH07XG5cblx0dGhpcy5maWxsQ2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoXy5pc1VuZGVmaW5lZChsb2FkUHJvbWlzZSkpIHtcblx0XHRcdGxvYWRQcm9taXNlID0gQWRkcmVzc0Jvb2tTZXJ2aWNlLmdldEFsbCgpLnRoZW4oZnVuY3Rpb24gKGVuYWJsZWRBZGRyZXNzQm9va3MpIHtcblx0XHRcdFx0dmFyIHByb21pc2VzID0gW107XG5cdFx0XHRcdGVuYWJsZWRBZGRyZXNzQm9va3MuZm9yRWFjaChmdW5jdGlvbiAoYWRkcmVzc0Jvb2spIHtcblx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKFxuXHRcdFx0XHRcdFx0QWRkcmVzc0Jvb2tTZXJ2aWNlLnN5bmMoYWRkcmVzc0Jvb2spLnRoZW4oZnVuY3Rpb24gKGFkZHJlc3NCb29rKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgaW4gYWRkcmVzc0Jvb2sub2JqZWN0cykge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChhZGRyZXNzQm9vay5vYmplY3RzW2ldLmFkZHJlc3NEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgY29udGFjdCA9IG5ldyBDb250YWN0KGFkZHJlc3NCb29rLCBhZGRyZXNzQm9vay5vYmplY3RzW2ldKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRhY3RzLnB1dChjb250YWN0LnVpZCgpLCBjb250YWN0KTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gY3VzdG9tIGNvbnNvbGVcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdJbnZhbGlkIGNvbnRhY3QgcmVjZWl2ZWQ6ICcgKyBhZGRyZXNzQm9vay5vYmplY3RzW2ldLnVybCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjYWNoZUZpbGxlZCA9IHRydWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdHJldHVybiBsb2FkUHJvbWlzZTtcblx0fTtcblxuXHR0aGlzLmdldEFsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKGNhY2hlRmlsbGVkID09PSBmYWxzZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZmlsbENhY2hlKCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRhY3RzLnZhbHVlcygpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAkcS53aGVuKGNvbnRhY3RzLnZhbHVlcygpKTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5nZXRHcm91cHMgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0QWxsKCkudGhlbihmdW5jdGlvbihjb250YWN0cykge1xuXHRcdFx0cmV0dXJuIF8udW5pcShjb250YWN0cy5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQuY2F0ZWdvcmllcygpO1xuXHRcdFx0fSkucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0cmV0dXJuIGEuY29uY2F0KGIpO1xuXHRcdFx0fSwgW10pLnNvcnQoKSwgdHJ1ZSk7XG5cdFx0fSk7XG5cdH07XG5cblx0dGhpcy5nZXRCeUlkID0gZnVuY3Rpb24odWlkKSB7XG5cdFx0aWYoY2FjaGVGaWxsZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5maWxsQ2FjaGUoKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY29udGFjdHMuZ2V0KHVpZCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICRxLndoZW4oY29udGFjdHMuZ2V0KHVpZCkpO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKG5ld0NvbnRhY3QsIGFkZHJlc3NCb29rLCB1aWQpIHtcblx0XHRhZGRyZXNzQm9vayA9IGFkZHJlc3NCb29rIHx8IEFkZHJlc3NCb29rU2VydmljZS5nZXREZWZhdWx0QWRkcmVzc0Jvb2soKTtcblx0XHRuZXdDb250YWN0ID0gbmV3Q29udGFjdCB8fCBuZXcgQ29udGFjdChhZGRyZXNzQm9vayk7XG5cdFx0dmFyIG5ld1VpZCA9ICcnO1xuXHRcdGlmKHV1aWQ0LnZhbGlkYXRlKHVpZCkpIHtcblx0XHRcdG5ld1VpZCA9IHVpZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3VWlkID0gdXVpZDQuZ2VuZXJhdGUoKTtcblx0XHR9XG5cdFx0bmV3Q29udGFjdC51aWQobmV3VWlkKTtcblx0XHRuZXdDb250YWN0LnNldFVybChhZGRyZXNzQm9vaywgbmV3VWlkKTtcblx0XHRuZXdDb250YWN0LmFkZHJlc3NCb29rSWQgPSBhZGRyZXNzQm9vay5kaXNwbGF5TmFtZTtcblx0XHRpZiAoXy5pc1VuZGVmaW5lZChuZXdDb250YWN0LmZ1bGxOYW1lKCkpIHx8IG5ld0NvbnRhY3QuZnVsbE5hbWUoKSA9PT0gJycpIHtcblx0XHRcdG5ld0NvbnRhY3QuZnVsbE5hbWUodCgnY29udGFjdHMnLCAnTmV3IGNvbnRhY3QnKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIERhdkNsaWVudC5jcmVhdGVDYXJkKFxuXHRcdFx0YWRkcmVzc0Jvb2ssXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IG5ld0NvbnRhY3QuZGF0YS5hZGRyZXNzRGF0YSxcblx0XHRcdFx0ZmlsZW5hbWU6IG5ld1VpZCArICcudmNmJ1xuXHRcdFx0fVxuXHRcdCkudGhlbihmdW5jdGlvbih4aHIpIHtcblx0XHRcdG5ld0NvbnRhY3Quc2V0RVRhZyh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0VUYWcnKSk7XG5cdFx0XHRjb250YWN0cy5wdXQobmV3VWlkLCBuZXdDb250YWN0KTtcblx0XHRcdG5vdGlmeU9ic2VydmVycygnY3JlYXRlJywgbmV3VWlkKTtcblx0XHRcdCQoJyNkZXRhaWxzLWZ1bGxOYW1lJykuc2VsZWN0KCk7XG5cdFx0XHRyZXR1cm4gbmV3Q29udGFjdDtcblx0XHR9KS5jYXRjaChmdW5jdGlvbih4aHIpIHtcblx0XHRcdHZhciBtc2cgPSB0KCdjb250YWN0cycsICdDb250YWN0IGNvdWxkIG5vdCBiZSBjcmVhdGVkLicpO1xuXHRcdFx0aWYgKCFhbmd1bGFyLmlzVW5kZWZpbmVkKHhocikgJiYgIWFuZ3VsYXIuaXNVbmRlZmluZWQoeGhyLnJlc3BvbnNlWE1MKSAmJiAhYW5ndWxhci5pc1VuZGVmaW5lZCh4aHIucmVzcG9uc2VYTUwuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUygnaHR0cDovL3NhYnJlZGF2Lm9yZy9ucycsICdtZXNzYWdlJykpKSB7XG5cdFx0XHRcdGlmICgkKHhoci5yZXNwb25zZVhNTC5nZXRFbGVtZW50c0J5VGFnTmFtZU5TKCdodHRwOi8vc2FicmVkYXYub3JnL25zJywgJ21lc3NhZ2UnKSkudGV4dCgpKSB7XG5cdFx0XHRcdFx0bXNnID0gJCh4aHIucmVzcG9uc2VYTUwuZ2V0RWxlbWVudHNCeVRhZ05hbWVOUygnaHR0cDovL3NhYnJlZGF2Lm9yZy9ucycsICdtZXNzYWdlJykpLnRleHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRPQy5Ob3RpZmljYXRpb24uc2hvd1RlbXBvcmFyeShtc2cpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHRoaXMuaW1wb3J0ID0gZnVuY3Rpb24oZGF0YSwgdHlwZSwgYWRkcmVzc0Jvb2ssIHByb2dyZXNzQ2FsbGJhY2spIHtcblx0XHRhZGRyZXNzQm9vayA9IGFkZHJlc3NCb29rIHx8IEFkZHJlc3NCb29rU2VydmljZS5nZXREZWZhdWx0QWRkcmVzc0Jvb2soKTtcblxuXHRcdHZhciByZWdleHAgPSAvQkVHSU46VkNBUkRbXFxzXFxTXSo/RU5EOlZDQVJEL21naTtcblx0XHR2YXIgc2luZ2xlVkNhcmRzID0gZGF0YS5tYXRjaChyZWdleHApO1xuXG5cdFx0aWYgKCFzaW5nbGVWQ2FyZHMpIHtcblx0XHRcdE9DLk5vdGlmaWNhdGlvbi5zaG93VGVtcG9yYXJ5KHQoJ2NvbnRhY3RzJywgJ05vIGNvbnRhY3RzIGluIGZpbGUuIE9ubHkgdkNhcmQgZmlsZXMgYXJlIGFsbG93ZWQuJykpO1xuXHRcdFx0aWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcblx0XHRcdFx0cHJvZ3Jlc3NDYWxsYmFjaygxKTtcblx0XHRcdH1cblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIG51bSA9IDE7XG5cdFx0Zm9yKHZhciBpIGluIHNpbmdsZVZDYXJkcykge1xuXHRcdFx0dmFyIG5ld0NvbnRhY3QgPSBuZXcgQ29udGFjdChhZGRyZXNzQm9vaywge2FkZHJlc3NEYXRhOiBzaW5nbGVWQ2FyZHNbaV19KTtcblx0XHRcdGlmIChbJzMuMCcsICc0LjAnXS5pbmRleE9mKG5ld0NvbnRhY3QudmVyc2lvbigpKSA8IDApIHtcblx0XHRcdFx0aWYgKHByb2dyZXNzQ2FsbGJhY2spIHtcblx0XHRcdFx0XHRwcm9ncmVzc0NhbGxiYWNrKG51bSAvIHNpbmdsZVZDYXJkcy5sZW5ndGgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdE9DLk5vdGlmaWNhdGlvbi5zaG93VGVtcG9yYXJ5KHQoJ2NvbnRhY3RzJywgJ09ubHkgdkNhcmQgdmVyc2lvbiA0LjAgKFJGQzYzNTApIG9yIHZlcnNpb24gMy4wIChSRkMyNDI2KSBhcmUgc3VwcG9ydGVkLicpKTtcblx0XHRcdFx0bnVtKys7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jcmVhdGUobmV3Q29udGFjdCwgYWRkcmVzc0Jvb2spLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgcHJvZ3Jlc3MgaW5kaWNhdG9yXG5cdFx0XHRcdGlmIChwcm9ncmVzc0NhbGxiYWNrKSB7XG5cdFx0XHRcdFx0cHJvZ3Jlc3NDYWxsYmFjayhudW0gLyBzaW5nbGVWQ2FyZHMubGVuZ3RoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRudW0rKztcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLm1vdmVDb250YWN0ID0gZnVuY3Rpb24gKGNvbnRhY3QsIGFkZHJlc3Nib29rKSB7XG5cdFx0aWYgKGNvbnRhY3QuYWRkcmVzc0Jvb2tJZCA9PT0gYWRkcmVzc2Jvb2suZGlzcGxheU5hbWUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29udGFjdC5zeW5jVkNhcmQoKTtcblx0XHR2YXIgY2xvbmUgPSBhbmd1bGFyLmNvcHkoY29udGFjdCk7XG5cdFx0dmFyIHVpZCA9IGNvbnRhY3QudWlkKCk7XG5cblx0XHQvLyBkZWxldGUgdGhlIG9sZCBvbmUgYmVmb3JlIHRvIGF2b2lkIGNvbmZsaWN0XG5cdFx0dGhpcy5kZWxldGUoY29udGFjdCk7XG5cblx0XHQvLyBjcmVhdGUgdGhlIGNvbnRhY3QgaW4gdGhlIG5ldyB0YXJnZXQgYWRkcmVzc2Jvb2tcblx0XHR0aGlzLmNyZWF0ZShjbG9uZSwgYWRkcmVzc2Jvb2ssIHVpZCk7XG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbihjb250YWN0KSB7XG5cdFx0Ly8gdXBkYXRlIHJldiBmaWVsZFxuXHRcdGNvbnRhY3Quc3luY1ZDYXJkKCk7XG5cblx0XHQvLyB1cGRhdGUgY29udGFjdCBvbiBzZXJ2ZXJcblx0XHRyZXR1cm4gRGF2Q2xpZW50LnVwZGF0ZUNhcmQoY29udGFjdC5kYXRhLCB7anNvbjogdHJ1ZX0pLnRoZW4oZnVuY3Rpb24oeGhyKSB7XG5cdFx0XHR2YXIgbmV3RXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignRVRhZycpO1xuXHRcdFx0Y29udGFjdC5zZXRFVGFnKG5ld0V0YWcpO1xuXHRcdFx0bm90aWZ5T2JzZXJ2ZXJzKCd1cGRhdGUnLCBjb250YWN0LnVpZCgpKTtcblx0XHR9KTtcblx0fTtcblxuXHR0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcblx0XHQvLyBkZWxldGUgY29udGFjdCBmcm9tIHNlcnZlclxuXHRcdHJldHVybiBEYXZDbGllbnQuZGVsZXRlQ2FyZChjb250YWN0LmRhdGEpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250YWN0cy5yZW1vdmUoY29udGFjdC51aWQoKSk7XG5cdFx0XHRub3RpZnlPYnNlcnZlcnMoJ2RlbGV0ZScsIGNvbnRhY3QudWlkKCkpO1xuXHRcdH0pO1xuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLnNlcnZpY2UoJ0RhdkNsaWVudCcsIGZ1bmN0aW9uKCkge1xuXHR2YXIgeGhyID0gbmV3IGRhdi50cmFuc3BvcnQuQmFzaWMoXG5cdFx0bmV3IGRhdi5DcmVkZW50aWFscygpXG5cdCk7XG5cdHJldHVybiBuZXcgZGF2LkNsaWVudCh4aHIpO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLnNlcnZpY2UoJ0RhdlNlcnZpY2UnLCBmdW5jdGlvbihEYXZDbGllbnQpIHtcblx0cmV0dXJuIERhdkNsaWVudC5jcmVhdGVBY2NvdW50KHtcblx0XHRzZXJ2ZXI6IE9DLmxpbmtUb1JlbW90ZSgnZGF2L2FkZHJlc3Nib29rcycpLFxuXHRcdGFjY291bnRUeXBlOiAnY2FyZGRhdicsXG5cdFx0dXNlUHJvdmlkZWRQYXRoOiB0cnVlXG5cdH0pO1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLnNlcnZpY2UoJ1NlYXJjaFNlcnZpY2UnLCBmdW5jdGlvbigpIHtcblx0dmFyIHNlYXJjaFRlcm0gPSAnJztcblxuXHR2YXIgb2JzZXJ2ZXJDYWxsYmFja3MgPSBbXTtcblxuXHR0aGlzLnJlZ2lzdGVyT2JzZXJ2ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0b2JzZXJ2ZXJDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdH07XG5cblx0dmFyIG5vdGlmeU9ic2VydmVycyA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuXHRcdHZhciBldiA9IHtcblx0XHRcdGV2ZW50OmV2ZW50TmFtZSxcblx0XHRcdHNlYXJjaFRlcm06c2VhcmNoVGVybVxuXHRcdH07XG5cdFx0YW5ndWxhci5mb3JFYWNoKG9ic2VydmVyQ2FsbGJhY2tzLCBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0Y2FsbGJhY2soZXYpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBTZWFyY2hQcm94eSA9IHtcblx0XHRhdHRhY2g6IGZ1bmN0aW9uKHNlYXJjaCkge1xuXHRcdFx0c2VhcmNoLnNldEZpbHRlcignY29udGFjdHMnLCB0aGlzLmZpbHRlclByb3h5KTtcblx0XHR9LFxuXHRcdGZpbHRlclByb3h5OiBmdW5jdGlvbihxdWVyeSkge1xuXHRcdFx0c2VhcmNoVGVybSA9IHF1ZXJ5O1xuXHRcdFx0bm90aWZ5T2JzZXJ2ZXJzKCdjaGFuZ2VTZWFyY2gnKTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5nZXRTZWFyY2hUZXJtID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNlYXJjaFRlcm07XG5cdH07XG5cblx0dGhpcy5jbGVhblNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghXy5pc1VuZGVmaW5lZCgkKCcuc2VhcmNoYm94JykpKSB7XG5cdFx0XHQkKCcuc2VhcmNoYm94JylbMF0ucmVzZXQoKTtcblx0XHR9XG5cdFx0c2VhcmNoVGVybSA9ICcnO1xuXHR9O1xuXG5cdGlmICghXy5pc1VuZGVmaW5lZChPQy5QbHVnaW5zKSkge1xuXHRcdE9DLlBsdWdpbnMucmVnaXN0ZXIoJ09DQS5TZWFyY2gnLCBTZWFyY2hQcm94eSk7XG5cdFx0aWYgKCFfLmlzVW5kZWZpbmVkKE9DQS5TZWFyY2gpKSB7XG5cdFx0XHRPQy5TZWFyY2ggPSBuZXcgT0NBLlNlYXJjaCgkKCcjc2VhcmNoYm94JyksICQoJyNzZWFyY2hyZXN1bHRzJykpO1xuXHRcdFx0JCgnI3NlYXJjaGJveCcpLnNob3coKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoIV8uaXNVbmRlZmluZWQoJCgnLnNlYXJjaGJveCcpKSkge1xuXHRcdCQoJy5zZWFyY2hib3gnKVswXS5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGlmKGUua2V5Q29kZSA9PT0gMTMpIHtcblx0XHRcdFx0bm90aWZ5T2JzZXJ2ZXJzKCdzdWJtaXRTZWFyY2gnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLnNlcnZpY2UoJ1NldHRpbmdzU2VydmljZScsIGZ1bmN0aW9uKCkge1xuXHR2YXIgc3Vic2NyaXB0aW9ucyA9IFtdO1xuXHR2YXIgc2V0dGluZ3MgPSB7XG5cdFx0YWRkcmVzc0Jvb2tzOiBbXG5cdFx0XHQndGVzdEFkZHInXG5cdFx0XSxcblx0XHRwaG9uZXRpY0VuYWJsZTogZmFsc2UsXG5cdFx0cmV2ZXJzZU5hbWVPcmRlcjogZmFsc2UsXG5cdH07XG5cblx0T2JqZWN0LmFzc2lnbihzZXR0aW5ncywgSlNPTi5wYXJzZSh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvbnRhY3RzX3NldHRpbmdzJykpKTtcblxuXHRmdW5jdGlvbiBub3RpZnlPYnNlcnZlcnMgKCkge1xuXHRcdGFuZ3VsYXIuZm9yRWFjaChzdWJzY3JpcHRpb25zLCBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uKSB7XG5cdFx0XHRpZiAodHlwZW9mIHN1YnNjcmlwdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRzdWJzY3JpcHRpb24oKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHRoaXMuc2V0ID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdHNldHRpbmdzW2tleV0gPSB2YWx1ZTtcblx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NvbnRhY3RzX3NldHRpbmdzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcblx0XHRub3RpZnlPYnNlcnZlcnMoKTtcblx0fTtcblxuXHR0aGlzLmdldCA9IGZ1bmN0aW9uKGtleSkge1xuXHRcdHJldHVybiBzZXR0aW5nc1trZXldO1xuXHR9O1xuXG5cdHRoaXMuZ2V0QWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNldHRpbmdzO1xuXHR9O1xuXG5cdHRoaXMuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0c3Vic2NyaXB0aW9ucy5wdXNoIChjYWxsYmFjayk7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uc2VydmljZSgnU29ydEJ5U2VydmljZScsIGZ1bmN0aW9uICgpIHtcblx0dmFyIHN1YnNjcmlwdGlvbnMgPSBbXTtcblx0dmFyIHNvcnRCeSA9ICdzb3J0RGlzcGxheU5hbWUnO1xuXG5cdHZhciBkZWZhdWx0T3JkZXIgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NvbnRhY3RzX2RlZmF1bHRfb3JkZXInKTtcblx0aWYgKGRlZmF1bHRPcmRlcikge1xuXHRcdHNvcnRCeSA9IGRlZmF1bHRPcmRlcjtcblx0fVxuXG5cdGZ1bmN0aW9uIG5vdGlmeU9ic2VydmVycyAoKSB7XG5cdFx0YW5ndWxhci5mb3JFYWNoKHN1YnNjcmlwdGlvbnMsIGZ1bmN0aW9uIChzdWJzY3JpcHRpb24pIHtcblx0XHRcdGlmICh0eXBlb2Ygc3Vic2NyaXB0aW9uID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHN1YnNjcmlwdGlvbihzb3J0QnkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzdWJzY3JpYmU6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0c3Vic2NyaXB0aW9ucy5wdXNoIChjYWxsYmFjayk7XG5cdFx0fSxcblx0XHRzZXRTb3J0Qnk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0c29ydEJ5ID0gdmFsdWU7XG5cdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0gKCdjb250YWN0c19kZWZhdWx0X29yZGVyJywgdmFsdWUpO1xuXHRcdFx0bm90aWZ5T2JzZXJ2ZXJzICgpO1xuXHRcdH0sXG5cdFx0Z2V0U29ydEJ5OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gc29ydEJ5O1xuXHRcdH0sXG5cdFx0Z2V0U29ydEJ5TGlzdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c29ydERpc3BsYXlOYW1lOiB0KCdjb250YWN0cycsICdEaXNwbGF5IG5hbWUnKSxcblx0XHRcdFx0c29ydEZpcnN0TmFtZTogdCgnY29udGFjdHMnLCAnRmlyc3QgbmFtZScpLFxuXHRcdFx0XHRzb3J0TGFzdE5hbWU6IHQoJ2NvbnRhY3RzJywgJ0xhc3QgbmFtZScpLFxuXHRcdFx0XHRzb3J0UGhvbmV0aWNGaXJzdE5hbWU6IHQoJ2NvbnRhY3RzJywgJ1Bob25ldGljIGZpcnN0IG5hbWUnKSxcblx0XHRcdFx0c29ydFBob25ldGljTGFzdE5hbWU6IHQoJ2NvbnRhY3RzJywgJ1Bob25ldGljIGxhc3QgbmFtZScpLFxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uc2VydmljZSgndkNhcmRQcm9wZXJ0aWVzU2VydmljZScsIGZ1bmN0aW9uKCkge1xuXHQvKipcblx0ICogbWFwIHZDYXJkIGF0dHJpYnV0ZXMgdG8gaW50ZXJuYWwgYXR0cmlidXRlc1xuXHQgKlxuXHQgKiBwcm9wTmFtZToge1xuXHQgKiBcdFx0bXVsdGlwbGU6IFtCb29sZWFuXSwgLy8gaXMgdGhpcyBwcm9wIGFsbG93ZWQgbW9yZSB0aGFuIG9uY2U/IChkZWZhdWx0ID0gZmFsc2UpXG5cdCAqIFx0XHRyZWFkYWJsZU5hbWU6IFtTdHJpbmddLCAvLyBpbnRlcm5hdGlvbmFsaXplZCByZWFkYWJsZSBuYW1lIG9mIHByb3Bcblx0ICogXHRcdHRlbXBsYXRlOiBbU3RyaW5nXSwgLy8gdGVtcGxhdGUgbmFtZSBmb3VuZCBpbiAvdGVtcGxhdGVzL2RldGFpbEl0ZW1zXG5cdCAqIFx0XHRbLi4uXSAvLyBvcHRpb25hbCBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHdoaWNoIG1pZ2h0IGdldCB1c2VkIGJ5IHRoZSB0ZW1wbGF0ZVxuXHQgKiB9XG5cdCAqL1xuXHR0aGlzLnZDYXJkTWV0YSA9IHtcblx0XHRuaWNrbmFtZToge1xuXHRcdFx0cmVhZGFibGVOYW1lOiB0KCdjb250YWN0cycsICdOaWNrbmFtZScpLFxuXHRcdFx0dGVtcGxhdGU6ICd0ZXh0J1xuXHRcdH0sXG5cdFx0bjoge1xuXHRcdFx0cmVhZGFibGVOYW1lOiB0KCdjb250YWN0cycsICdEZXRhaWxlZCBuYW1lJyksXG5cdFx0XHRkZWZhdWx0VmFsdWU6IHtcblx0XHRcdFx0dmFsdWU6WycnLCAnJywgJycsICcnLCAnJ11cblx0XHRcdH0sXG5cdFx0XHR0ZW1wbGF0ZTogJ24nXG5cdFx0fSxcblx0XHRub3RlOiB7XG5cdFx0XHRyZWFkYWJsZU5hbWU6IHQoJ2NvbnRhY3RzJywgJ05vdGVzJyksXG5cdFx0XHR0ZW1wbGF0ZTogJ3RleHRhcmVhJ1xuXHRcdH0sXG5cdFx0dXJsOiB7XG5cdFx0XHRtdWx0aXBsZTogdHJ1ZSxcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnV2Vic2l0ZScpLFxuXHRcdFx0dGVtcGxhdGU6ICd1cmwnXG5cdFx0fSxcblx0XHRjbG91ZDoge1xuXHRcdFx0bXVsdGlwbGU6IHRydWUsXG5cdFx0XHRyZWFkYWJsZU5hbWU6IHQoJ2NvbnRhY3RzJywgJ0ZlZGVyYXRlZCBDbG91ZCBJRCcpLFxuXHRcdFx0dGVtcGxhdGU6ICd0ZXh0Jyxcblx0XHRcdGRlZmF1bHRWYWx1ZToge1xuXHRcdFx0XHR2YWx1ZTpbJyddLFxuXHRcdFx0XHRtZXRhOnt0eXBlOlsnSE9NRSddfVxuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0e2lkOiAnSE9NRScsIG5hbWU6IHQoJ2NvbnRhY3RzJywgJ0hvbWUnKX0sXG5cdFx0XHRcdHtpZDogJ1dPUksnLCBuYW1lOiB0KCdjb250YWN0cycsICdXb3JrJyl9LFxuXHRcdFx0XHR7aWQ6ICdPVEhFUicsIG5hbWU6IHQoJ2NvbnRhY3RzJywgJ090aGVyJyl9XG5cdFx0XHRdXHRcdH0sXG5cdFx0YWRyOiB7XG5cdFx0XHRtdWx0aXBsZTogdHJ1ZSxcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnQWRkcmVzcycpLFxuXHRcdFx0dGVtcGxhdGU6ICdhZHInLFxuXHRcdFx0ZGVmYXVsdFZhbHVlOiB7XG5cdFx0XHRcdHZhbHVlOlsnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG5cdFx0XHRcdG1ldGE6e3R5cGU6WydIT01FJ119XG5cdFx0XHR9LFxuXHRcdFx0b3B0aW9uczogW1xuXHRcdFx0XHR7aWQ6ICdIT01FJywgbmFtZTogdCgnY29udGFjdHMnLCAnSG9tZScpfSxcblx0XHRcdFx0e2lkOiAnV09SSycsIG5hbWU6IHQoJ2NvbnRhY3RzJywgJ1dvcmsnKX0sXG5cdFx0XHRcdHtpZDogJ09USEVSJywgbmFtZTogdCgnY29udGFjdHMnLCAnT3RoZXInKX1cblx0XHRcdF1cblx0XHR9LFxuXHRcdGNhdGVnb3JpZXM6IHtcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnR3JvdXBzJyksXG5cdFx0XHR0ZW1wbGF0ZTogJ2dyb3Vwcydcblx0XHR9LFxuXHRcdGJkYXk6IHtcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnQmlydGhkYXknKSxcblx0XHRcdHRlbXBsYXRlOiAnZGF0ZSdcblx0XHR9LFxuXHRcdGFubml2ZXJzYXJ5OiB7XG5cdFx0XHRyZWFkYWJsZU5hbWU6IHQoJ2NvbnRhY3RzJywgJ0Fubml2ZXJzYXJ5JyksXG5cdFx0XHR0ZW1wbGF0ZTogJ2RhdGUnXG5cdFx0fSxcblx0XHRkZWF0aGRhdGU6IHtcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnRGF0ZSBvZiBkZWF0aCcpLFxuXHRcdFx0dGVtcGxhdGU6ICdkYXRlJ1xuXHRcdH0sXG5cdFx0ZW1haWw6IHtcblx0XHRcdG11bHRpcGxlOiB0cnVlLFxuXHRcdFx0cmVhZGFibGVOYW1lOiB0KCdjb250YWN0cycsICdFbWFpbCcpLFxuXHRcdFx0dGVtcGxhdGU6ICdlbWFpbCcsXG5cdFx0XHRkZWZhdWx0VmFsdWU6IHtcblx0XHRcdFx0dmFsdWU6JycsXG5cdFx0XHRcdG1ldGE6e3R5cGU6WydIT01FJ119XG5cdFx0XHR9LFxuXHRcdFx0b3B0aW9uczogW1xuXHRcdFx0XHR7aWQ6ICdIT01FJywgbmFtZTogdCgnY29udGFjdHMnLCAnSG9tZScpfSxcblx0XHRcdFx0e2lkOiAnV09SSycsIG5hbWU6IHQoJ2NvbnRhY3RzJywgJ1dvcmsnKX0sXG5cdFx0XHRcdHtpZDogJ09USEVSJywgbmFtZTogdCgnY29udGFjdHMnLCAnT3RoZXInKX1cblx0XHRcdF1cblx0XHR9LFxuXHRcdGltcHA6IHtcblx0XHRcdG11bHRpcGxlOiB0cnVlLFxuXHRcdFx0cmVhZGFibGVOYW1lOiB0KCdjb250YWN0cycsICdJbnN0YW50IG1lc3NhZ2luZycpLFxuXHRcdFx0dGVtcGxhdGU6ICd1c2VybmFtZScsXG5cdFx0XHRkZWZhdWx0VmFsdWU6IHtcblx0XHRcdFx0dmFsdWU6WycnXSxcblx0XHRcdFx0bWV0YTp7dHlwZTpbJ1NLWVBFJ119XG5cdFx0XHR9LFxuXHRcdFx0b3B0aW9uczogW1xuXHRcdFx0XHR7aWQ6ICdJUkMnLCBuYW1lOiAgJ0lSQyd9LFxuXHRcdFx0XHR7aWQ6ICdTS1lQRScsIG5hbWU6J1NreXBlJ30sXG5cdFx0XHRcdHtpZDogJ1RFTEVHUkFNJywgbmFtZTonVGVsZWdyYW0nfVxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0dGVsOiB7XG5cdFx0XHRtdWx0aXBsZTogdHJ1ZSxcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnUGhvbmUnKSxcblx0XHRcdHRlbXBsYXRlOiAndGVsJyxcblx0XHRcdGRlZmF1bHRWYWx1ZToge1xuXHRcdFx0XHR2YWx1ZTpbJyddLFxuXHRcdFx0XHRtZXRhOnt0eXBlOlsnSE9NRSxWT0lDRSddfVxuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0e2lkOiAnSE9NRSxWT0lDRScsIG5hbWU6IHQoJ2NvbnRhY3RzJywgJ0hvbWUnKX0sXG5cdFx0XHRcdHtpZDogJ1dPUkssVk9JQ0UnLCBuYW1lOiB0KCdjb250YWN0cycsICdXb3JrJyl9LFxuXHRcdFx0XHR7aWQ6ICdDRUxMJywgbmFtZTogdCgnY29udGFjdHMnLCAnTW9iaWxlJyl9LFxuXHRcdFx0XHR7aWQ6ICdGQVgnLCBuYW1lOiB0KCdjb250YWN0cycsICdGYXgnKX0sXG5cdFx0XHRcdHtpZDogJ0hPTUUsRkFYJywgbmFtZTogdCgnY29udGFjdHMnLCAnRmF4IGhvbWUnKX0sXG5cdFx0XHRcdHtpZDogJ1dPUkssRkFYJywgbmFtZTogdCgnY29udGFjdHMnLCAnRmF4IHdvcmsnKX0sXG5cdFx0XHRcdHtpZDogJ1BBR0VSJywgbmFtZTogdCgnY29udGFjdHMnLCAnUGFnZXInKX0sXG5cdFx0XHRcdHtpZDogJ1ZPSUNFJywgbmFtZTogdCgnY29udGFjdHMnLCAnVm9pY2UnKX1cblx0XHRcdF1cblx0XHR9LFxuXHRcdCdYLVNPQ0lBTFBST0ZJTEUnOiB7XG5cdFx0XHRtdWx0aXBsZTogdHJ1ZSxcblx0XHRcdHJlYWRhYmxlTmFtZTogdCgnY29udGFjdHMnLCAnU29jaWFsIG5ldHdvcmsnKSxcblx0XHRcdHRlbXBsYXRlOiAndXNlcm5hbWUnLFxuXHRcdFx0ZGVmYXVsdFZhbHVlOiB7XG5cdFx0XHRcdHZhbHVlOlsnJ10sXG5cdFx0XHRcdG1ldGE6e3R5cGU6WydmYWNlYm9vayddfVxuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnM6IFtcblx0XHRcdFx0e2lkOiAnRkFDRUJPT0snLCBuYW1lOiAnRmFjZWJvb2snfSxcblx0XHRcdFx0e2lkOiAnR09PR0xFUExVUycsIG5hbWU6ICdHb29nbGUrJ30sXG5cdFx0XHRcdHtpZDogJ0lOU1RBR1JBTScsIG5hbWU6ICdJbnN0YWdyYW0nfSxcblx0XHRcdFx0e2lkOiAnTElOS0VESU4nLCBuYW1lOiAnTGlua2VkSW4nfSxcblx0XHRcdFx0e2lkOiAnUElOVEVSRVNUJywgbmFtZTogJ1BpbnRlcmVzdCd9LFxuXHRcdFx0XHR7aWQ6ICdUV0lUVEVSJywgbmFtZTogJ1R3aXR0ZXInfVxuXG5cdFx0XHRdXG5cblx0XHR9XG5cdH07XG5cblx0dGhpcy5maWVsZE9yZGVyID0gW1xuXHRcdCdvcmcnLFxuXHRcdCd0aXRsZScsXG5cdFx0J3RlbCcsXG5cdFx0J2VtYWlsJyxcblx0XHQnYWRyJyxcblx0XHQnaW1wcCcsXG5cdFx0J25pY2snLFxuXHRcdCdiZGF5Jyxcblx0XHQnYW5uaXZlcnNhcnknLFxuXHRcdCdkZWF0aGRhdGUnLFxuXHRcdCd1cmwnLFxuXHRcdCdYLVNPQ0lBTFBST0ZJTEUnLFxuXHRcdCdub3RlJyxcblx0XHQnY2F0ZWdvcmllcycsXG5cdFx0J3JvbGUnXG5cdF07XG5cblx0dGhpcy5maWVsZERlZmluaXRpb25zID0gW107XG5cdGZvciAodmFyIHByb3AgaW4gdGhpcy52Q2FyZE1ldGEpIHtcblx0XHR0aGlzLmZpZWxkRGVmaW5pdGlvbnMucHVzaCh7aWQ6IHByb3AsIG5hbWU6IHRoaXMudkNhcmRNZXRhW3Byb3BdLnJlYWRhYmxlTmFtZSwgbXVsdGlwbGU6ICEhdGhpcy52Q2FyZE1ldGFbcHJvcF0ubXVsdGlwbGV9KTtcblx0fVxuXG5cdHRoaXMuZmFsbGJhY2tNZXRhID0gZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykgeyByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpOyB9XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6ICd1bmtub3duLScgKyBwcm9wZXJ0eSxcblx0XHRcdHJlYWRhYmxlTmFtZTogY2FwaXRhbGl6ZShwcm9wZXJ0eSksXG5cdFx0XHR0ZW1wbGF0ZTogJ2hpZGRlbicsXG5cdFx0XHRuZWNlc3NpdHk6ICdvcHRpb25hbCdcblx0XHR9O1xuXHR9O1xuXG5cdHRoaXMuZ2V0TWV0YSA9IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG5cdFx0cmV0dXJuIHRoaXMudkNhcmRNZXRhW3Byb3BlcnR5XSB8fCB0aGlzLmZhbGxiYWNrTWV0YShwcm9wZXJ0eSk7XG5cdH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5maWx0ZXIoJ0pTT04ydkNhcmQnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0cmV0dXJuIHZDYXJkLmdlbmVyYXRlKGlucHV0KTtcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5maWx0ZXIoJ2NvbnRhY3RDb2xvcicsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcblx0XHQvLyBDaGVjayBpZiBjb3JlIGhhcyB0aGUgbmV3IGNvbG9yIGdlbmVyYXRvclxuXHRcdGlmKHR5cGVvZiBpbnB1dC50b0hzbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIGhzbCA9IGlucHV0LnRvSHNsKCk7XG5cdFx0XHRyZXR1cm4gJ2hzbCgnK2hzbFswXSsnLCAnK2hzbFsxXSsnJSwgJytoc2xbMl0rJyUpJztcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSWYgbm90LCB3ZSB1c2UgdGhlIG9sZCBvbmVcblx0XHRcdC8qIGdsb2JhbCBtZDUgKi9cblx0XHRcdHZhciBoYXNoID0gbWQ1KGlucHV0KS5zdWJzdHJpbmcoMCwgNCksXG5cdFx0XHRcdG1heFJhbmdlID0gcGFyc2VJbnQoJ2ZmZmYnLCAxNiksXG5cdFx0XHRcdGh1ZSA9IHBhcnNlSW50KGhhc2gsIDE2KSAvIG1heFJhbmdlICogMjU2O1xuXHRcdFx0cmV0dXJuICdoc2woJyArIGh1ZSArICcsIDkwJSwgNjUlKSc7XG5cdFx0fVxuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5maWx0ZXIoJ2NvbnRhY3RHcm91cEZpbHRlcicsIGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdHJldHVybiBmdW5jdGlvbiAoY29udGFjdHMsIGdyb3VwKSB7XG5cdFx0aWYgKHR5cGVvZiBjb250YWN0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHJldHVybiBjb250YWN0cztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBncm91cCA9PT0gJ3VuZGVmaW5lZCcgfHwgZ3JvdXAudG9Mb3dlckNhc2UoKSA9PT0gdCgnY29udGFjdHMnLCAnQWxsIGNvbnRhY3RzJykudG9Mb3dlckNhc2UoKSkge1xuXHRcdFx0cmV0dXJuIGNvbnRhY3RzO1xuXHRcdH1cblx0XHR2YXIgZmlsdGVyID0gW107XG5cdFx0aWYgKGNvbnRhY3RzLmxlbmd0aCA+IDApIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY29udGFjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGdyb3VwLnRvTG93ZXJDYXNlKCkgPT09IHQoJ2NvbnRhY3RzJywgJ05vdCBncm91cGVkJykudG9Mb3dlckNhc2UoKSkge1xuXHRcdFx0XHRcdGlmIChjb250YWN0c1tpXS5jYXRlZ29yaWVzKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXIucHVzaChjb250YWN0c1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChjb250YWN0c1tpXS5jYXRlZ29yaWVzKCkuaW5kZXhPZihncm91cCkgPj0gMCkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyLnB1c2goY29udGFjdHNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmlsdGVyO1xuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmZpbHRlcignZmllbGRGaWx0ZXInLCBmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRyZXR1cm4gZnVuY3Rpb24gKGZpZWxkcywgY29udGFjdCkge1xuXHRcdGlmICh0eXBlb2YgZmllbGRzID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuIGZpZWxkcztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBjb250YWN0ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuIGZpZWxkcztcblx0XHR9XG5cdFx0dmFyIGZpbHRlciA9IFtdO1xuXHRcdGlmIChmaWVsZHMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGZpZWxkc1tpXS5tdWx0aXBsZSApIHtcblx0XHRcdFx0XHRmaWx0ZXIucHVzaChmaWVsZHNbaV0pO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfLmlzVW5kZWZpbmVkKGNvbnRhY3QuZ2V0UHJvcGVydHkoZmllbGRzW2ldLmlkKSkpIHtcblx0XHRcdFx0XHRmaWx0ZXIucHVzaChmaWVsZHNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBmaWx0ZXI7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZmlsdGVyKCdmaXJzdENoYXJhY3RlcicsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcblx0XHRyZXR1cm4gaW5wdXQuY2hhckF0KDApO1xuXHR9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnY29udGFjdHNBcHAnKVxuLmZpbHRlcignbG9jYWxlT3JkZXJCeScsIFtmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoYXJyYXksIHNvcnRQcmVkaWNhdGUsIHJldmVyc2VPcmRlcikge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHJldHVybiBhcnJheTtcblx0XHRpZiAoIXNvcnRQcmVkaWNhdGUpIHJldHVybiBhcnJheTtcblxuXHRcdHZhciBhcnJheUNvcHkgPSBbXTtcblx0XHRhbmd1bGFyLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRhcnJheUNvcHkucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdGFycmF5Q29weS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHR2YXIgdmFsdWVBID0gYVtzb3J0UHJlZGljYXRlXTtcblx0XHRcdGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odmFsdWVBKSkge1xuXHRcdFx0XHR2YWx1ZUEgPSBhW3NvcnRQcmVkaWNhdGVdKCk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdmFsdWVCID0gYltzb3J0UHJlZGljYXRlXTtcblx0XHRcdGlmIChhbmd1bGFyLmlzRnVuY3Rpb24odmFsdWVCKSkge1xuXHRcdFx0XHR2YWx1ZUIgPSBiW3NvcnRQcmVkaWNhdGVdKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhbmd1bGFyLmlzU3RyaW5nKHZhbHVlQSkpIHtcblx0XHRcdFx0cmV0dXJuICFyZXZlcnNlT3JkZXIgPyB2YWx1ZUEubG9jYWxlQ29tcGFyZSh2YWx1ZUIpIDogdmFsdWVCLmxvY2FsZUNvbXBhcmUodmFsdWVBKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFuZ3VsYXIuaXNOdW1iZXIodmFsdWVBKSB8fCB0eXBlb2YgdmFsdWVBID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0cmV0dXJuICFyZXZlcnNlT3JkZXIgPyB2YWx1ZUEgLSB2YWx1ZUIgOiB2YWx1ZUIgLSB2YWx1ZUE7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChhbmd1bGFyLmlzQXJyYXkodmFsdWVBKSkge1xuXHRcdFx0XHRpZiAodmFsdWVBWzBdID09PSB2YWx1ZUJbMF0pIHtcblx0XHRcdFx0XHRyZXR1cm4gIXJldmVyc2VPcmRlciA/IHZhbHVlQVsxXS5sb2NhbGVDb21wYXJlKHZhbHVlQlsxXSkgOiB2YWx1ZUJbMV0ubG9jYWxlQ29tcGFyZSh2YWx1ZUFbMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAhcmV2ZXJzZU9yZGVyID8gdmFsdWVBWzBdLmxvY2FsZUNvbXBhcmUodmFsdWVCWzBdKSA6IHZhbHVlQlswXS5sb2NhbGVDb21wYXJlKHZhbHVlQVswXSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFycmF5Q29weTtcblx0fTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZmlsdGVyKCduZXdDb250YWN0JywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuXHRcdHJldHVybiBpbnB1dCAhPT0gJycgPyBpbnB1dCA6IHQoJ2NvbnRhY3RzJywgJ05ldyBjb250YWN0Jyk7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZmlsdGVyKCdvcmRlckRldGFpbEl0ZW1zJywgZnVuY3Rpb24odkNhcmRQcm9wZXJ0aWVzU2VydmljZSkge1xuXHQndXNlIHN0cmljdCc7XG5cdHJldHVybiBmdW5jdGlvbihpdGVtcywgZmllbGQsIHJldmVyc2UpIHtcblxuXHRcdHZhciBmaWx0ZXJlZCA9IFtdO1xuXHRcdGFuZ3VsYXIuZm9yRWFjaChpdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0ZmlsdGVyZWQucHVzaChpdGVtKTtcblx0XHR9KTtcblxuXHRcdHZhciBmaWVsZE9yZGVyID0gYW5ndWxhci5jb3B5KHZDYXJkUHJvcGVydGllc1NlcnZpY2UuZmllbGRPcmRlcik7XG5cdFx0Ly8gcmV2ZXJzZSB0byBtb3ZlIGN1c3RvbSBpdGVtcyB0byB0aGUgZW5kIChpbmRleE9mID09IC0xKVxuXHRcdGZpZWxkT3JkZXIucmV2ZXJzZSgpO1xuXG5cdFx0ZmlsdGVyZWQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0aWYoZmllbGRPcmRlci5pbmRleE9mKGFbZmllbGRdKSA8IGZpZWxkT3JkZXIuaW5kZXhPZihiW2ZpZWxkXSkpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cdFx0XHRpZihmaWVsZE9yZGVyLmluZGV4T2YoYVtmaWVsZF0pID4gZmllbGRPcmRlci5pbmRleE9mKGJbZmllbGRdKSkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9KTtcblxuXHRcdGlmKHJldmVyc2UpIGZpbHRlcmVkLnJldmVyc2UoKTtcblx0XHRyZXR1cm4gZmlsdGVyZWQ7XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdjb250YWN0c0FwcCcpXG4uZmlsdGVyKCd0b0FycmF5JywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiBmdW5jdGlvbihvYmopIHtcblx0XHRpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QpKSByZXR1cm4gb2JqO1xuXHRcdHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG5cdFx0XHRpZiAoYW5ndWxhci5pc1VuZGVmaW5lZCh2YWwpKSByZXR1cm4gdmFsO1xuXHRcdFx0cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWwsICcka2V5Jywge3ZhbHVlOiBrZXl9KTtcblx0XHR9KTtcblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2NvbnRhY3RzQXBwJylcbi5maWx0ZXIoJ3ZDYXJkMkpTT04nLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG5cdFx0cmV0dXJuIHZDYXJkLnBhcnNlKGlucHV0KTtcblx0fTtcbn0pO1xuIl19
