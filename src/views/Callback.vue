<script lang="js">
    import { RouterLink } from 'vue-router'
    export default {
        mounted() {
            this.getTokenURL()
            localStorage.setItem("authCode", JSON.stringify(this.authorize))
            this.$router.replace('/')
        },
        component: {
            RouterLink,
        },
        data() {
            return {
                authorize: {
                    accessToken: null,
                    tokenType: null,
                    expiredIn: null,
                    state: null,
                },
            }
        },
        methods: {
            getTokenURL: function(){
                const fullUrl = window.location.href
                const queryString = fullUrl.replace(import.meta.env.VITE_SPOTIFY_REDIRECT_URL+'#', '?')
                const urlParams = new URLSearchParams(queryString)
                this.authorize.accessToken = urlParams.get('access_token')
                this.authorize.tokenType = urlParams.get('token_type')
                this.authorize.expiredIn = urlParams.get('expires_in')
                this.authorize.state = urlParams.get('state')
            },
            setTokenLocal: function(){
                localStorage.setItem("authCode", JSON.stringify(this.authorize))
            }
        }
    }
</script>
<template>
    <div class="bg-red-500">Callback test</div>
    <router-link to="/">
        <button class="bg-blue-500 px-3 py-1 hover:bg-blue-600 rounded">Home</button>
    </router-link>
</template>