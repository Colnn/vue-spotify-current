<script lang="js">
  import { RouterLink } from 'vue-router'
  export default {
    mounted() {
      if(!localStorage.getItem('authCode')||localStorage.getItem('authCode').accessToken===null){
        this.logout()
      }else{
        this.localToData()
        this.spotCallAPI()
        this.checkTheme()
        this.toogle = true
      }

      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URL;
      const state = this.generateString(16);
      const scope = 'user-read-email+user-read-private+user-read-currently-playing';

      let authUrl = 'https://accounts.spotify.com/authorize?response_type=token&redirect_uri='+redirect_uri+'&client_id='+clientId+'&scope='+scope+'&state='+state
      this.authUrl = authUrl.replace(' ', '')
    },
    data() {
      return {
        authCode: {
          accessToken: null,
          tokenType: null,
          expiredIn: null,
          state: null,
        },
        toogle: false,
        user: {
          name: null,
          url: null,
        },
        playing: "",
        newSong: "",
        errors: null,
        typer: {
          typeValue: "",
          typeStatus: false,
          typingSpeed: 100,
          erasingSpeed: 100,
          charIndex: 0,
          cursor: '',
        },
        theme: '',
        classes: '',
      }
    },
    watch: {
      'errors': function () {
        this.eraseText(true);
      }
    },
    methods: {
      localToData: function(){
        const authCode = JSON.parse(localStorage.getItem('authCode'))
        this.authCode.accessToken = authCode.accessToken
        this.authCode.tokenType = authCode.tokenType
        this.authCode.expiredIn = authCode.expiredIn
        this.authCode.state = authCode.state
      },
      checkTheme: function() {
        if(localStorage.getItem('theme') == null) {
          localStorage.setItem('theme', 'normal');
        }
        this.theme = localStorage.getItem('theme');
        if(this.theme == 'commodore64') {
          this.classes = 'font-commodore bg-blue-800';
          this.typer.cursor = '¡';
        } else {
          this.classes = 'font-mono';
          this.typer.cursor = '|';
        }
        console.log(this.theme);
      },
      cycleThemes: function() {
        if(localStorage.getItem('theme') == 'commodore64') {
          localStorage.setItem('theme', 'normal');
        } else if(localStorage.getItem('theme') == 'normal') {
          localStorage.setItem('theme', 'commodore64');
        }
        this.checkTheme();
      },
      generateString: function(length) {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
      },
      spotCallAPI: function(){
        function handleErrors(response) {
          if (!response.ok) throw new Error(response.status);
          return response;
        }
          fetch('https://api.spotify.com/v1/me', {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+this.authCode.accessToken,
            },
          })
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => {
              this.user.name = data.display_name
              this.user.url = data.images.length>0 ? data.images[0].url : null
            })
            .catch(error => this.errors=error)
          fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+this.authCode.accessToken,
            },
          })
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => {
              let song = data.item.name;
              let artists = "";
              if(data.item.artists.length > 1) {
                data.item.artists.forEach(artist => {
                    artists = artists.concat(', ' + artist.name);
                });
              } else {
                artists = data.item.artists[0].name;
              }
              this.newSong = song + ' - ' + artists;
              if(this.playing !== this.newSong && this.typer.typeStatus == false) {
                this.eraseText(false);
              }
            })
            .catch(error => this.errors=error)
            setTimeout(this.spotCallAPI, 5000);
      },
      logout: function(){
        localStorage.removeItem('authCode')
        this.$router.replace('/login')
      },
      typeText() {
        this.playing = this.newSong;
        if (this.typer.charIndex < this.playing.length) {
            if (!this.typer.typeStatus) this.typer.typeStatus = true;
            this.typer.typeValue += this.playing.charAt(
            this.typer.charIndex
            );
            this.typer.charIndex += 1;
            setTimeout(this.typeText, this.typer.typingSpeed);
        } else {
            this.typer.typeStatus = false;
        }
        },
        eraseText(error) {
            if (this.typer.charIndex > 0) {
                if (!this.typer.typeStatus) this.typer.typeStatus = true;
                this.typer.typeValue = this.playing.substring(
                0,
                this.typer.charIndex - 1
                );
                this.typer.charIndex -= 1;
                setTimeout(this.eraseText, this.typer.erasingSpeed);
            } else {
                this.typer.typeStatus = false;
                if(error == true) {
                    window.location.href=this.authUrl
                } else {
                    this.typeText();
                }
            }
        },
    },
  }
</script>

<template>
  <main>
    <div :class="this.classes" @click="this.cycleThemes">
        <span class="typed-text text-gray-200 text-2xl">{{ typer.typeValue }}</span>
        <span class="blinking-cursor text-gray-200 text-2xl">{{ this.typer.cursor }}</span>
        <span class="cursor" :class="{ typing: typer.typeStatus }"></span>
    </div>
  </main>
</template>