<?php
include('header.tpl');
?>

</head>
<body>

<?php if ($errorMessage) { ?>
<div style="color:red;font-weight:bold;"><?php echo $errorMessage; ?></div>
<?php } ?>
<?php if ($okMessage) { ?>
<div style="color:blue;font-weight:italic;"><?php echo $okMessage; ?></div>
<?php } ?>

<form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <div style="color:white;">
        <label for="username">User name: </label> 
        <input type="text" id="username" name="username" required autofocus></input>
    </div>
    <div style="color:white;">
        <label for="password">Password: </label> 
        <input type="password" id="password" name="password" required></input>
    </div>
    <div style="color:white;">
        <label for="password2">Repeat password: </label> 
        <input type="password" id="password2" name="password2" required></input>
    </div>
    <div style="color:white;">
        <label for="firstname">First name: </label> 
        <input type="text" id="firstname" name="firstname" required></input>
    </div>
    <div style="color:white;">
        <label for="lastname">Last name: </label> 
        <input type="text" id="lastname" name="lastname" required></input>
    </div>
    <div style="color:white;">
        <label for="email">Email address: </label> 
        <input type="email" id="email" name="email"></input>
    </div>
    <div>
        <input type="submit" name="action-register" value="Register"></input>
    </div>
</form>

</body>
</html>