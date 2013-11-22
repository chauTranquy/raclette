<?php
session_start();
require_once '../library/Gapi/Google_Client.php';
require_once '../library/Gapi/contrib/Google_AnalyticsService.php';

$scriptUri = "http://".$_SERVER["HTTP_HOST"].$_SERVER['PHP_SELF'];

$client = new Google_Client();
$client->setAccessType('online'); // default: offline
$client->setApplicationName('emmental');
$client->setClientId('744007931737.apps.googleusercontent.com');
$client->setClientSecret('L5aV87kYtsGbuvxx_3RMOq9-');
$client->setRedirectUri($scriptUri);
$client->setDeveloperKey('AIzaSyAH9oFEvp7XVA8z5XYmjAqlJEzLEsU9do0'); // API key

// $service implements the client interface, has to be set before auth call
$service = new Google_AnalyticsService($client);

if (isset($_GET['logout'])) { // logout: destroy token
    unset($_SESSION['token']);
	die('Logged out.');
}

if (isset($_GET['code'])) { // we received the positive auth callback, get the token and store it in session
    $client->authenticate();
    $_SESSION['token'] = $client->getAccessToken();
}

if (isset($_SESSION['token'])) { // extract token from session and configure client
    $token = $_SESSION['token'];
    $client->setAccessToken($token);
}

if (!$client->getAccessToken()) { // auth call to google
    $authUrl = $client->createAuthUrl();
    header("Location: ".$authUrl);
    die;
}

try {
    $props = $service->management_webproperties->listManagementWebproperties("~all");
    
    var_dump($props);
    
    echo '<h1>Available Google Analytics projects</h1><ul>'."\n";
    foreach($props['items'] as $item) printf('<li>%1$s</li>', $item['name']);
    echo '</ul>';
} catch (Exception $e) {
    die('An error occured: ' . $e->getMessage()."\n");
}