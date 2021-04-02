window.onload = function () {
  //canvas initialization
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  //dimensions
  var W = canvas.width;
  var H = canvas.height;
  //Variables
  var TO_RADIANS = Math.PI / 180;
  var degrees = 0;
  var new_degrees = 0;
  var difference = 0;
  var color = "#fff";
  var bgcolor = "#2C393F";
  var readout;
  var readoutcolor = "#fff";
  var unit = "mph".split("").join(String.fromCharCode(8201));
  //unicode spacing used for letterspacing see http://www.fileformat.info/info/unicode/category/Zs/list.htm
  var unitcolor = "#7B9BA6";
  var gear;
  var animation_loop, redraw_loop;
  var linewidth = 2;

  function xyOnArc(cx, cy, radius, radianAngle) {
    var x = cx + radius * Math.cos(radianAngle);
    var y = cy + radius * Math.sin(radianAngle);
    return { x: x, y: y };
  }

  function init() {
    //Clear the canvas everytime a chart is drawn
    ctx.clearRect(0, 0, W, H);

    //line above MPH
    ctx.beginPath();
    ctx.moveTo(130, H / 3 - 5);
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = 1;
    ctx.lineTo(270, H / 3 - 5);
    ctx.stroke();

    //line under MPH
    ctx.beginPath();
    ctx.moveTo(140, H / 2 + 5);
    ctx.lineTo(260, H / 2 + 5);
    ctx.stroke();

    //line under GEAR
    ctx.beginPath();
    ctx.moveTo(130, (H / 3) * 2 + 5);
    ctx.lineTo(270, (H / 3) * 2 + 5);
    ctx.stroke();

    //line dots
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = linewidth;
    ctx.arc(130, H / 3 - 3, 1, 0, 360 * TO_RADIANS, false);
    ctx.stroke();
    //ctx.closePath();

    ctx.beginPath();
    ctx.arc(270, H / 3 - 3, 1, 0, 360 * TO_RADIANS, false);
    ctx.stroke();
    //ctx.closePath();

    ctx.beginPath();
    ctx.arc(130, (H / 3) * 2 + 3, 1, 0, 360 * TO_RADIANS, false);
    ctx.stroke();
    //ctx.closePath();

    ctx.beginPath();
    ctx.arc(270, (H / 3) * 2 + 3, 1, 0, 360 * TO_RADIANS, false);
    ctx.stroke();
    //ctx.closePath();

    //decoration arcs
    //inner half
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = linewidth - 1;
    ctx.arc(
      W / 2,
      H / 2,
      100,
      0 - 225 * TO_RADIANS,
      0 - 135 * TO_RADIANS,
      false
    );
    ctx.stroke();

    //inner half
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = linewidth - 1;
    ctx.arc(W / 2, H / 2, 100, 0 - 45 * TO_RADIANS, 45 * TO_RADIANS, false);
    ctx.stroke();

    //outer half
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = linewidth - 1;
    ctx.arc(W / 2, H / 2, 130, -145 * TO_RADIANS, -35 * TO_RADIANS, false);
    ctx.stroke();

    //outer half
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = linewidth - 1;
    ctx.arc(W / 2, H / 2, 130, 145 * TO_RADIANS, 35 * TO_RADIANS, true);
    ctx.stroke();

    //FUEL READOUT
    //fuel arc
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = linewidth - 1;
    ctx.arc(W / 2, H / 2, 115, -215 * TO_RADIANS, -145 * TO_RADIANS, false);
    ctx.stroke();
    //place F at top of arc
    var fuelArcF = xyOnArc(W / 2, H / 2, 110, -145 * TO_RADIANS);
    ctx.font = "12px 'PT Sans Narrow'";
    ctx.fillStyle = "#fff";
    ctx.fillText("F", fuelArcF.x + 2, fuelArcF.y);
    //place E at top of arc
    var fuelArcE = xyOnArc(W / 2, H / 2, 110, -215 * TO_RADIANS);
    ctx.font = "12px 'PT Sans Narrow'";
    ctx.fillStyle = "#F65E2C";
    ctx.fillText("E", fuelArcE.x + 2, fuelArcE.y + 4);

    for (fr = 0; fr < 16; fr++) {
      var fuelArcR = xyOnArc(
        W / 2,
        H / 2,
        110,
        ((60 / 16) * fr - 207) * TO_RADIANS
      );
      ctx.beginPath();
      ctx.moveTo(fuelArcR.x - 6, fuelArcR.y);
      ctx.lineWidth = 5;
      if (fr > 2) {
        ctx.strokeStyle = "#293B49";
      } else {
        ctx.strokeStyle = "#F65E2C";
      }

      ctx.lineTo(fuelArcR.x + 10, fuelArcR.y);
      ctx.stroke();
    }
    //shading
    for (fr = 0; fr < 16; fr++) {
      var fuelArcR = xyOnArc(
        W / 2,
        H / 2,
        110,
        ((60 / 16) * fr - 207) * TO_RADIANS
      );
      ctx.beginPath();
      ctx.moveTo(fuelArcR.x + 2, fuelArcR.y);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineTo(fuelArcR.x + 10, fuelArcR.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = "#F65E2C";
    ctx.lineWidth = linewidth - 1;
    ctx.arc(W / 2, H / 2, 115, -208 * TO_RADIANS, -150 * TO_RADIANS, false);
    ctx.stroke();

    //TEMP READOUT

    //temp arc
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = linewidth - 1;
    ctx.arc(W / 2, H / 2, 115, -35 * TO_RADIANS, 35 * TO_RADIANS, false);
    ctx.stroke();
    //place H at top of arc
    var tempArcH = xyOnArc(W / 2, H / 2, 110, -35 * TO_RADIANS);
    ctx.font = "12px 'PT Sans Narrow'";
    ctx.fillStyle = "#F65E2C";
    ctx.fillText("H", tempArcH.x - 8, tempArcH.y - 4);
    //place C at bottom of arc
    var tempArcC = xyOnArc(W / 2, H / 2, 110, 35 * TO_RADIANS);
    ctx.font = "12px 'PT Sans Narrow'";
    ctx.fillStyle = "#fff";
    ctx.fillText("C", tempArcC.x - 8, tempArcC.y + 8);

    for (tr = 0; tr < 16; tr++) {
      var tempArcR = xyOnArc(
        W / 2,
        H / 2,
        110,
        -145 + (60 / 16) * tr * TO_RADIANS
      );
      ctx.beginPath();
      ctx.moveTo(tempArcR.x + 6, tempArcR.y);
      ctx.lineWidth = 4;
      if (tr > 8) {
        ctx.strokeStyle = "#fff";
      } else {
        ctx.strokeStyle = "#293B49";
      }
      ctx.lineTo(tempArcR.x - 10, tempArcR.y);
      ctx.stroke();
    }
    //shading
    for (tr = 0; tr < 16; tr++) {
      var tempArcR = xyOnArc(
        W / 2,
        H / 2,
        110,
        -145 + (60 / 16) * tr * TO_RADIANS
      );
      ctx.beginPath();
      ctx.moveTo(tempArcR.x - 2, tempArcR.y);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineTo(tempArcR.x - 10, tempArcR.y);
      ctx.stroke();
    }

    //outer speedo
    ctx.beginPath();
    ctx.strokeStyle = "#76A1A8";
    ctx.lineWidth = linewidth;
    ctx.arc(W / 2, H / 2, 170, -270 * TO_RADIANS, 54 * TO_RADIANS, false);
    ctx.stroke();

    //red zone
    ctx.beginPath();
    ctx.strokeStyle = "#F65E2C";
    ctx.lineWidth = linewidth;
    ctx.arc(W / 2, H / 2, 170, 17 * TO_RADIANS, 54 * TO_RADIANS, false);
    ctx.stroke();

    //inner arc
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = linewidth;
    ctx.arc(W / 2, H / 2, 120, 0, 360 * TO_RADIANS, false);
    ctx.stroke();

    //REV COUNTER
    var revPos = degrees * TO_RADIANS;
    ctx.beginPath();
    if (degrees > 288) {
      ctx.strokeStyle = "rgba(246, 94, 44, 0.6)";
      readoutcolor = "#F65E2C";
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      readoutcolor = "#fff";
    }
    ctx.lineWidth = 30;

    var revEnd = revPos + 90 * TO_RADIANS;
    ctx.arc(W / 2, H / 2, 150, 90 * TO_RADIANS, revEnd, false);
    ctx.stroke();

    //REV COUNTER POINTER
    ctx.save();
    ctx.beginPath();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(revPos);
    ctx.moveTo(0, 120);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F65E2C";
    ctx.lineTo(0, 160);
    ctx.stroke();
    ctx.restore();

    //REV COUNTER TICKS
    for (var n = 0; n <= 90; n++) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(W / 2, H / 2);
      ctx.rotate((360 / 100) * n * TO_RADIANS);
      //ctx.rotate(-4  * TO_RADIANS);

      ctx.moveTo(0, 165);
      ctx.lineWidth = 1;

      if (n > 80) {
        ctx.strokeStyle = "#F65E2C";
      } else {
        ctx.strokeStyle = "#fff";
      }

      if (n % 10 == 0) {
        ctx.lineTo(0, 155);
      } else {
        //minor
        ctx.lineTo(0, 162);
      }

      ctx.stroke();

      ctx.restore();
    }

    //REV COUNTER NUMBERS
    for (var i = 9; i >= 0; i--) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(180 * TO_RADIANS); //rotate 180 so we can place the text the right way up
      ctx.rotate((360 / 10) * i * TO_RADIANS);

      ctx.font = "12px 'PT Sans Narrow'";
      if (i > 7) {
        ctx.fillStyle = "#F65E2C";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fillText(i, -4, -140);
      ctx.restore();
    }

    //SPEED
    ctx.fillStyle = readoutcolor;
    ctx.font = "50px 'PT Sans Narrow'";
    readoutNumeric = Math.floor((degrees / 360) * 100 * 1.8);
    if (readoutNumeric < 0) {
      readoutNumeric = 0;
    }
    readout = readoutNumeric
      .toString()
      .split("")
      .join(String.fromCharCode(8201));
    readout_width = ctx.measureText(readout).width;
    //adding manual value to position y since the height of the text cannot be measured easily.
    ctx.fillText(readout, W / 2 - readout_width / 2, H / 3 + 40);

    //MPH
    ctx.fillStyle = unitcolor;
    ctx.font = "14px 'PT Sans Narrow'";
    unit_width = ctx.measureText(unit).width;
    ctx.fillText(unit, W / 2 - unit_width / 2, H / 3 + 60);

    //GEAR
    ctx.fillStyle = readoutcolor;
    ctx.font = "50px 'PT Sans Narrow'";
    if (readoutNumeric > 120) {
      gear = 6;
    } else if (readoutNumeric > 90) {
      gear = 5;
    } else if (readoutNumeric > 70) {
      gear = 4;
    } else if (readoutNumeric > 50) {
      gear = 3;
    } else if (readoutNumeric > 30) {
      gear = 2;
    } else if (readoutNumeric > 0) {
      gear = 1;
    } else {
      gear = "N";
    }
    gear_width = ctx.measureText(gear).width;
    ctx.fillText(gear, W / 2 - gear_width / 2, H / 3 + 120);
  }

  function draw() {
    //Cancel any movement animation if a new chart is requested
    if (typeof animation_loop != undefined) clearInterval(animation_loop);

    //random degree from 0 to 344
    new_degrees = Math.round(Math.random() * ((360 / 10) * 9));
    difference = new_degrees - degrees;

    //This will animate the gauge to new positions
    //The animation will take 1 second
    //time for each frame is based on difference, with a minimum time to ensure smooth movement
    //console.log(Math.max(0.2 * Math.abs(difference), 10));
    animation_loop = setInterval(
      animate_to,
      Math.max(0.1 * Math.abs(difference), 10)
    );
  }

  //function to make the chart move to new degrees
  function animate_to() {
    //clear animation loop if degrees reaches to new_degrees
    if (degrees == new_degrees) clearInterval(animation_loop);

    if (degrees < new_degrees) degrees++;
    else degrees--;

    init();
  }

  //initial set
  draw();

  //animation
  redraw_loop = setInterval(draw, 800);
};
