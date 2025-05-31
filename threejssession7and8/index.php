<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css">
    <title>Three.js in PHP</title>

    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js", "three/examples/jsm/controls/OrbitControls.js":
            "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js"
        }
    }
    </script>
</head>
<body>
    <h1>My PHP Page with a THREE.js section.</h1>

    <div id="three-container"></div>

    <script type="module" src="./js/threeScene.js"></script>
</body>
</html>