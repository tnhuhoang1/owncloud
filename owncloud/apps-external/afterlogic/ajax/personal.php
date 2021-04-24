<?php

/**
 * ownCloud - Afterlogic WebMail
 * @copyright 2002-2020 Afterlogic Corp.
 */

\OC_JSON::checkLoggedIn();
\OC_JSON::checkAppEnabled('afterlogic');
\OC_JSON::callCheck();

if (isset($_POST['appname'], $_POST['afterlogic-password'], $_POST['afterlogic-email']) && 'afterlogic' === $_POST['appname'])
{
	$sUser = OCP\User::getUser();

	$sEmail = $_POST['afterlogic-email'];
	\OC::$server->getConfig()->setUserValue($sUser, 'afterlogic', 'afterlogic-email', $sEmail);

	$sPass = $_POST['afterlogic-password'];
	if ('******' !== $sPass)
	{
		include_once OC_App::getAppPath('afterlogic').'/functions.php';
		
		\OC::$server->getConfig()->setUserValue($sUser, 'afterlogic', 'afterlogic-password',
			aftEncodePassword($sPass, md5($sEmail)));
	}

	\OC_JSON::success(array('Message' => 'Saved successfully'));
	return true;
}

\OC_JSON::error(array('Message' => 'Invalid argument(s)'));
return false;
