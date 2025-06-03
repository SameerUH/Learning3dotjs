<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="png" href="../favicon.png">
    <title>Projects showcase test</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js", "three/examples/jsm/controls/OrbitControls.js":
            "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js"
        }
    }
    </script>

    <div id="tooltip"></div>

    <div id="projects-showcase"></div>

    <div id="nav">
        <button data-project="-1">Project 1</button>
        <button data-project="0">Project 2</button>
        <button data-project="1">Project 3</button>
    </div>

    <script type="module" src="./js/projects.js"></script>
</body>
</html>