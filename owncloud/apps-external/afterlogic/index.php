<?php

/**
 * ownCloud - Afterlogic WebMail
 * @copyright 2002-2020 Afterlogic Corp.
 */
OCP\User::checkLoggedIn();
OCP\App::checkAppEnabled('afterlogic');
\OC::$server->getNavigationManager()->setActiveEntry('afterlogic_index');

$sUrl = trim(\OC::$server->getConfig()->getAppValue('afterlogic', 'afterlogic-url', ''));
$sPath = trim(\OC::$server->getConfig()->getAppValue('afterlogic', 'afterlogic-path', ''));

if ('' === $sUrl)
{
	$oTemplate = new OCP\Template('afterlogic', 'not-configured', 'user');
}
else
{
	$sUser = OCP\User::getUser();

	$sEmail = \OC::$server->getConfig()->getUserValue($sUser, 'afterlogic', 'afterlogic-email', '');
	$sPassword = \OC::$server->getConfig()->getUserValue($sUser, 'afterlogic', 'afterlogic-password', '');

	include_once OC_App::getAppPath('afterlogic').'/functions.php';
	
	$sPassword = aftDecodePassword($sPassword, md5($sEmail));
	$sSsoHash = aftSsoKey($sPath, $sEmail, $sPassword, $sEmail);

	$sUrl = rtrim($sUrl, '/\\');
	if ('.php' !== strtolower(substr($sUrl, -4)))
	{
		$sUrl .= '/';
	}

	if ('' === $sPath) {
	    $sResultUrl = $sUrl.'?postlogin&Email='.urlencode($sEmail).'&Password='.urlencode($sPassword);
	} else {
	    $sResultUrl = empty($sSsoHash) ? $sUrl.'?sso' : $sUrl.'?sso&hash='.$sSsoHash;
	}	
	$oTemplate = new OCP\Template('afterlogic', 'iframe', 'user');
	$oTemplate->assign('afterlogic-url', $sResultUrl);
}

$oTemplate->printpage();
