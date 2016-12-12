<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);


/*$app->add(new \Slim\Middleware\JwtAuthentication([
    'secure' => false,
    'logger' => $app->getContainer()->logger,
    'callback' => function ($request, $response, $args) use ($app) {
        
        $jwt = $args['decoded'];

        $app->getContainer()['jwt'] = $jwt;

        return $response;
    },
    'error' => function ($request, $response, $args) {
        return $response->withStatus(401)->withJson([
            'success' => false,
            'message' => 'Unauthorized.'
        ]);
    },

    'rules' => [
        new \Slim\Middleware\JwtAuthentication\RequestPathRule([
            'path' => '/',
            'passthrough' => [
                '/login',
                '/logout'
            ]
        ])
    ],
    'secret' => 
]));*/