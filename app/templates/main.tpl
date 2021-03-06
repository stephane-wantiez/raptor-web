<?php include('header.tpl'); ?>
<script>
    var config = <?php echo json_encode($_SESSION['config']); ?>;
	var user = <?php echo $_SESSION['user']->toJSON(); ?>;
	var nofblogin = <?php echo ( defined('FB_APP_ID') ? 'false' : 'true' ); ?>;
	var ENCRYPT_ENABLED = <?php echo (ENCRYPT_ENABLED ? 'true' : 'false'); ?>;
	var FB_APP_ID = "<?php if (defined('FB_APP_ID')) { echo FB_APP_ID; } ?>";
	var LOCALE = "<?php echo $_SESSION['locale']; ?>";
	var webStaticUri = '<?php echo WEB_STATIC_URI; ?>';
	var friendsRequests = <?php
	   if (isset($_SESSION['friendsRequests']))
	   {
	       echo json_encode($_SESSION['friendsRequests']);
	       $_SESSION['friendsRequests'] = array();
	   }
	   else
	   {
	       echo 'null';
	   }
	?>;
</script>
<script type="text/javascript" src="<?php echo WEB_STATIC_URI; ?>js/script.js"></script>

</head>
<body>
    <div id="screen">
        <div id="game">
            <canvas id="scene-view" width="800" height="600"></canvas>
            <div id="hud">
                <div id="armor-hud" class="gauge-hud progress-bar">
                    <div id="armor-hud-indic" class="gauge-hud-indic progress-bar-indic"></div>
                </div>
                <div id="health-hud" class="gauge-hud progress-bar">
                    <div id="health-hud-indic" class="gauge-hud-indic progress-bar-indic"></div>
                </div>
                <div id="inner-huds">
                    <div id="upper-huds">
                        <div id="shields" class="counter-hud">
                           <div id="shields-indic"></div>
                        </div>
                        <div id="score" class="score"></div>
                        <div id="sec-weapon">
                        </div>
                    </div>
                    <div id="downer-huds">
                        <div id="bombs" class="counter-hud">
                           <div id="bombs-indic"></div>
                        </div>
                        <div id="boss-health" class="health-bar progress-bar"></div>
                    </div>
                </div>
            </div>
            <div class="menu"></div>
            <div id="sound_volume"></div>
        </div>
    </div>
</body>
</html>