<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};

$container['jwt'] = function ($container) {
    return new stdClass();
};

// -----------------------------------------------------------------------------
// Database connection
// -----------------------------------------------------------------------------

$container['db'] = function ($c) {
    $settings = $c->get('settings')['db'];
    $pdo = new PDO("mysql:host=" . $settings['host'] . ";dbname=" . $settings['dbname'],
        $settings['username'], $settings['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

// -----------------------------------------------------------------------------
// Controllers
// -----------------------------------------------------------------------------

$container['ExamController'] = function($c) {
    return new \App\Controllers\ExamController($c->get('Exam'), $c->get('Validation'));
};

$container['ResourcesController'] = function($c) {
    return new \App\Controllers\ResourcesController($c->get('Resources'));
};

$container['JobController'] = function($c) {
    return new \App\Controllers\JobController($c);
};

$container['UploadController'] = function($c) {
    return new \App\Controllers\UploadController($c->get('UploadHandler'));
};
// -----------------------------------------------------------------------------
// Model factories
// -----------------------------------------------------------------------------
$container['Main'] = function ($container) {
    return new App\Models\Main($container->get('db'));
};

$container['Job'] = function ($container) {
    return new App\Models\Job($container->get('db'));
};

$container['Exam'] = function ($container) {
    return new App\Models\Exam($container->get('db'));
};

$container['Resources'] = function ($container) {
    return new App\Models\Resources($container->get('db'));
};

$container['Country'] = function ($container) {
    return new App\Models\Country($container->get('db'));
};

$container['Industry'] = function ($container) {
    return new App\Models\Industry($container->get('db'));
};

$container['Currency'] = function ($container) {
    return new App\Models\Currency($container->get('db'));
};

$container['mainModel'] = function ($container) {
    return new App\Models\Main($container->get('db'));
};
// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

$container['Validation'] = function ($container) {
    return new App\Helpers\Validation($container->get('Exam'));
};

$container['JobValidator'] = function ($dic) {
    return new App\Helpers\JobValidator($dic);
};

// -----------------------------------------------------------------------------
// External Library
// -----------------------------------------------------------------------------
$container['UploadHandler'] = function ($container) {
    return new App\Vendor\UploadHandler();
};