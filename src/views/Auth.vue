<template>
    <button @click.prevent="signIn()">Sign In</button>
</template>

<script setup>
    import querystring from "querystring"; 
    function signIn() {
        let url = "https://accounts.spotify.com/authorize?" + querystring.stringify({
        response_type: 'code',
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email user-read-recently-played user-read-playback-state user-modify-playback-state user-read-currently-playing user-top-read',
        redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URL,
        });
        window.location.href = url
    }
</script>