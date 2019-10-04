
<script>


  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{806502046431924}',
      cookie     : true,
      xfbml      : true,
      version    : '{4.0}'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });



  {
      status: 'connected',
      authResponse: {
          accessToken: '...',
          expiresIn:'...',
          signedRequest:'...',
          userID:'...'
      }
  }




</script>
