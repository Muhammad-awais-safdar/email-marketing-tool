<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Primary Meta Tags -->
        <title>Awais Marketing Tool | Email & WhatsApp Campaigns</title>
        <meta name="title" content="Awais Marketing Tool | Email & WhatsApp Campaigns">
        <meta name="description" content="A premium, modern Email and WhatsApp marketing platform. Manage your lists, design beautiful templates, launch automated campaigns, and track real-time statistics.">
        <meta name="keywords" content="email marketing, whatsapp marketing, bulk campaigns, templates, automation, analytics">
        <meta name="theme-color" content="#4f46e5">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:title" content="Awais Marketing Tool | Email & WhatsApp Campaigns">
        <meta property="og:description" content="A premium, modern Email and WhatsApp marketing platform. Manage your lists, design beautiful templates, launch automated campaigns, and track real-time statistics.">
        <meta property="og:image" content="{{ asset('assets/auth-bg.png') }}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url('/') }}">
        <meta property="twitter:title" content="Awais Marketing Tool | Email & WhatsApp Campaigns">
        <meta property="twitter:description" content="A premium, modern Email and WhatsApp marketing platform. Manage your lists, design beautiful templates, launch automated campaigns, and track real-time statistics.">
        <meta property="twitter:image" content="{{ asset('assets/auth-bg.png') }}">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/entry.jsx'])
    </head>
    <body class="antialiased">
        <div id="root"></div>
    </body>
</html>
