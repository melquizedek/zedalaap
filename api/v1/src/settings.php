<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],

        // Database
        'db' => [
            'host' => 'localhost', // To change port, just add it afterwards like localhost:8889
            /*'dbname' => 'id262099_jobs_db', // DB name or SQLite path
            'username' => 'id262099_zed',
            'password' => 'ZedAlaap2016'*/
            'dbname' => 'jobs', // DB name or SQLite path
            'username' => 'root',
            'password' => ''
        ]
    ],
];
