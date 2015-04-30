Honeycombs.js
========================

A modified version of mstrehse's Honeycombs jQuery Plugin. It produces responsive hexagon grids.

![Demo Image](https://raw.githubusercontent.com/Tiotao/honeycombs/master/demo.png)

## Original

- Author: mstrehse
- Repo: https://github.com/mstrehse/honeycombs
- Example: http://examples.rabbid.net/honeycombs/demo.html

## Fork

- Author: Tiotao
- Repo: https://github.com/Tiotao/honeycombs.js/

## Modifications
- Added centering cells
- Reworked around 90%

## Usage
To generate a honeycomb grid, use the following markup:

```
<script src="honeycombs/js/jquery.honeycombs.js"></script>
<link rel="stylesheet" type="text/css" href="honeycombs/css/honeycombs.css" />

<div class="honeycombs honeycombs-wrapper">
    <div class="honeycombs-inner-wrapper" >
        <div class="comb">
            <span class="icon-hex-lg"></span>
            <div class="inner">
                <div style="padding:100px 20px 0 20px;">Text to place here. Text to place here</div>
            </div>
        </div>
        <div class="comb">
            <span class="icon-hex-lg"></span>
            <div class="inner">
                <div style="padding:100px 20px 0 20px;">Text to place here. Text to place here</div>
            </div>
        </div>
    </div>
</div>
```
and add the following code at the end of the `<body>` tag

```
<script>
	$(document).ready(function() {
	$('.honeycombs').honeycombs({
		combWidth:250,  // width of the hexagon
		margin: 0,		// spacing between hexagon
	});
});
</script>
```
