<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <script data-ionic="inject">
    (function(w){var i=w.Ionic=w.Ionic||{};i.version='3.9.2';i.angular='5.0.3';i.staticDir='build/';})(window);
  </script>
  <base href="./" id="base_tag">
  <meta charset="UTF-8">
  <title>Prescription Coupons, Savings, & Info - America's Pharmacy</title>
  <!-- <meta name="apple-itunes-app" content="app-id=1446761875"> -->

  <!-- Start SmartBanner configuration -->
<!-- <meta name="smartbanner:title" content="America's Pharmacy">
<meta name="smartbanner:author" content="MCN LLC.">
<meta name="smartbanner:icon-google" content="assets/favicon/apple-touch-icon-57x57.png">
<meta name="smartbanner:price" content="FREE">
<meta name="smartbanner:price-suffix-google" content=" - In Google Play">
<meta name="smartbanner:button" content="VIEW">
<meta name="smartbanner:button-url-google" content="https://play.google.com/store/apps/details?id=com.americaspharmacy.app">
<meta name="smartbanner:enabled-platforms" content="android"> -->
<!-- End SmartBanner configuration -->
  <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <meta name="description" content="Compare drug prices, get coupons, at 62,000+ US pharmacies. Save up to 80% instantly!" id="desc">

  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#dd3570">

  <meta name="url" property="og:url" content="https://www.AmericasPharmacy.com/"/>
  <meta name="title" property="og:title" content="Drug Prices, Coupons, & Pharmacy Info - AmericasPharmacy"  />
  <meta name="type" property="og:type" content="article"/>
  <meta name="desc" property="og:description" content="Compare drug prices, find coupons, and save money at more than 62,000 US pharmacies. Save up to 80% instantly!" />
  <meta name="image" property="og:image" content="https://www.americaspharmacy.com/assets/img/logo.fb.jpg"/>
  <meta property="og:image:secure_url" content="https://www.americaspharmacy.com/assets/img/logo.fb.jpg"/>
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="robots" content="noindex">
  <script>
    // Set the Angular routing base tag as "/" instead of "./" on web version, else page reload (and direct nav) to map//zip_code fails.
    const isApp = document.URL.indexOf('http') !== 0;
    if (!isApp){
      const baseTag = document.getElementById('base_tag');
      baseTag.setAttribute('href', "/");
    }

    if (window.location.href.toUpperCase().indexOf("SAMS") > -1) {
      document.getElementsByTagName('META')["title"].content = "America’s Pharmacy | Exclusive Sam’s Club Card";
      document.getElementsByTagName('META')["desc"].content = "Sam’s Club members can save on prescriptions at 62,000+ pharmacies across the US. Save up to 80% on prescription drugs."
    }
  </script>

  <!-- Comments in this file are from the Ionic Starter template; except this one. -->
  <!-- add to homescreen for ios -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <!--
  <script src="http://maps.google.com/maps/api/js?key=AIzaSyD-PaInSrt2IYNbaQ2pOzU7VTSSpgVve7M"></script>
  -->
  <script src="https://maps.google.com/maps/api/js?key=AIzaSyBbSef5zoc5g8wbXrDYmQiWlnITmIT3hYU"></script>

  <!-- cordova.js required for cordova apps (remove if not needed) -->
  <script src="cordova.js"></script>

  <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "Organization",
        "name" : " AmericasPharmacy",
        "url": "https://www. AmericasPharmacy.com",
        "sameAs" : [
          "https://www.facebook.com/AmericasPharmacy-190314565081428",
          "https://twitter.com/AmericasPharmaC"
          ]
      }
  </script>
  <!-- un-comment this code to enable service worker
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('service worker installed'))
        .catch(err => console.error('Error', err));
    }
  </script>-->

  <link href="build/main.css" rel="stylesheet">
  <!-- <link href="assets/js/smartbanner.min.css" rel="stylesheet"> -->
  <!-- Favicons! -->
  <link rel="icon" type="image/x-icon" href="assets/favicon/favicon.ico">
  <link rel="apple-touch-icon-precomposed" sizes="57x57" href="assets/favicon/apple-touch-icon-57x57.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/favicon/apple-touch-icon-114x114.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/favicon/apple-touch-icon-72x72.png" />
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/favicon/apple-touch-icon-144x144.png" />
  <link rel="apple-touch-icon-precomposed" sizes="60x60" href="assets/favicon/apple-touch-icon-60x60.png" />
  <link rel="apple-touch-icon-precomposed" sizes="120x120" href="assets/favicon/apple-touch-icon-120x120.png" />
  <link rel="apple-touch-icon-precomposed" sizes="76x76" href="assets/favicon/apple-touch-icon-76x76.png" />
  <link rel="apple-touch-icon-precomposed" sizes="152x152" href="assets/favicon/apple-touch-icon-152x152.png" />
  <link rel="icon" type="image/png" href="assets/favicon/favicon-196x196.png" sizes="196x196" />
  <link rel="icon" type="image/png" href="assets/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/png" href="assets/favicon/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="assets/favicon/favicon-16x16.png" sizes="16x16" />
  <link rel="icon" type="image/png" href="assets/favicon/favicon-128.png" sizes="128x128" />
  <meta name="application-name" content="America’s Pharmacy"/>
  <meta name="msapplication-TileColor" content="#FFFFFF" />
  <meta name="msapplication-TileImage" content="mstile-144x144.png" />
  <meta name="msapplication-square70x70logo" content="mstile-70x70.png" />
  <meta name="msapplication-square150x150logo" content="mstile-150x150.png" />
  <meta name="msapplication-wide310x150logo" content="mstile-310x150.png" />
  <meta name="msapplication-square310x310logo" content="mstile-310x310.png" />
<!-- Google Tag Manager -->
<script>(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({
    'gtm.start':
      new Date().getTime(), event: 'gtm.js'
  }); var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-NNF4CSF');</script>
  <!-- End Google Tag Manager -->

<!-- Google Analytics -->
  <script>
    (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,"script","https://www.google-analytics.com/analytics.js","ga");
    ga("create", "UA-116793263-1", "auto");
  </script>

  <!-- End Google Analytics -->

  <!--Google Analytics for pageads-->
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <script>
    function adsby(){
      if(window.adsbygoogle) {
        delete window.adsbygoogle
      }

      adsbygoogle = [].push(
        { google_ad_client: "ca-pub-2948361559242650", enable_page_level_ads: true }
      );

      // (adsbygoogle = window.adsbygoogle || []).push(
      //   { google_ad_client: "ca-pub-2948361559242650", enable_page_level_ads: true }
      // );
    }
  </script>
  <!--End Google Analytics for pageads-->
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-805855991');
  </script>
  <!--BEGIN: Bing Ads UET Javascript tag. -->
  <script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"26014619"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script>

  <script>
      function bingAdsCard() {
        window.uetq = window.uetq || [];
        window.uetq.push({ 'ec': 'conversion', 'ea': 'click', 'el': 'card', 'ev': 1 });
      }
      function bingAdsCoupon() {
        window.uetq = window.uetq || [];
        window.uetq.push({ 'ec': 'conversion', 'ea': 'click', 'el': 'Coupon', 'ev': 1 });
      }
  </script>
  <!--END: Bing Ads UET Javascript tag. -->

 <!-- Facebook Pixel Code -->
  <!-- Facebook pixel tracking only for StitchRx site -->
  <script>
      if (window.location.href.toLowerCase().indexOf("stitchrx") !== -1) {
        !function (f, b, e, v, n, t, s) {
          if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
              n.callMethod.apply(n, arguments) : n.queue.push(arguments)
          };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
          n.queue = []; t = b.createElement(e); t.async = !0;
          t.src = v; s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '449767308972246');
        fbq('track', 'PageView');
      }
      </script>
      <noscript>
        <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=449767308972246&ev=PageView&noscript=1"/>
      </noscript>
      <!-- End Facebook Pixel Code -->

<!-- Dot Tags Code -->
<script type="application/javascript">(function(w,d,t,r,u){w[u]=w[u]||[];w[u].push({'projectId':'10000','properties':{'pixelId':'10070852'}});var s=d.createElement(t);s.src=r;s.async=true;s.onload=s.onreadystatechange=function(){var y,rs=this.readyState,c=w[u];if(rs&&rs!="complete"&&rs!="loaded"){return}try{y=YAHOO.ywa.I13N.fireBeacon;w[u]=[];w[u].push=function(p){y([p])};y(c)}catch(e){}};var scr=d.getElementsByTagName(t)[0],par=scr.parentNode;par.insertBefore(s,scr)})(window,document,"script","https://s.yimg.com/wi/ytc.js","dotq");</script>

<script>
  function dotCard() {
    window.dotq = window.dotq || [];
    window.dotq.push(
      {
        'projectId': '10000',
        'properties': {
          'pixelId': '10070852',
          'qstrings': {
            'et': 'custom',
            'ec': 'conversion',
            'ea': 'click',
            'el': 'card',
            'ev': '1',
            'gv': '0'
          }
        }
      });
  }
  function dotCoupon() {
    window.dotq = window.dotq || [];
    window.dotq.push(
      {
        'projectId': '10000',
        'properties': {
          'pixelId': '10070852',
          'qstrings': {
            'et': 'custom',
            'ec': 'conversion',
            'ea': 'click',
            'el': 'Coupon',
            'ev': '1',
            'gv': '0'
          }
        }
      });
  }
</script>
<!-- End Dot Tags Code -->


  </head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NNF4CSF" height="0" width="0" style="display:none;visibility:hidden"></iframe>
  </noscript>
  <!-- End Google Tag Manager (noscript) -->
  <h1 style="visibility: hidden;">Prescription Drug Savings - America's Pharmacy</h1>

  <!-- Ionic's root component and where the app will load -->
  <ion-app></ion-app>

  <!-- The polyfills js is generated during the build process -->
  <script src="build/polyfills.js"></script>

  <!-- The vendor js is generated during the build process
       It contains all of the dependencies in node_modules -->
  <script src="build/vendor.js"></script>

  <!-- The main bundle js is generated during the build process -->
  <script src="build/main.js"></script>

  <!-- Google Analytics -->


</body>
</html>
