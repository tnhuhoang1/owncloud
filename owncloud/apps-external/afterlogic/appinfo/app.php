<?php

/**
 * ownCloud - Afterlogic WebMail
 * @copyright 2002-2020 Afterlogic Corp.
 */

OCP\App::registerAdmin('afterlogic', 'admin');
OCP\App::registerPersonal('afterlogic', 'personal');

$sUrl = trim(\OC::$server->getConfig()->getAppValue('afterlogic', 'afterlogic-url', ''));
$sPath = trim(\OC::$server->getConfig()->getAppValue('afterlogic', 'afterlogic-path', ''));

/*
if (('' !== $sUrl && '' !== $sPath) || OC_User::isAdminUser(OC_User::getUser()))
*/
if ('' !== $sUrl || OC_User::isAdminUser(OC_User::getUser()))
{
	OCP\Util::addScript('afterlogic', 'afterlogic');

	\OC::$server->getNavigationManager()->add(array(
		'id' => 'afterlogic_index',
		'order' => 10,
		'href' => \OC::$server->getURLGenerator()->linkTo('afterlogic', 'index.php'),
		'icon' => \OC::$server->getURLGenerator()->imagePath('afterlogic', 'mail.svg'),
		'name' => 'Mail'
	));
}
