function demo(){
  var l1 = {p1: {x: 10, y: 10}, p2: {x: 15, y: 100}};
  var l2 = {p1: {x: 100, y: 20}, p2: {x: 80, y: 90}};
  var canvas = document.getElementById("bezier_canvas");
  var ctx = canvas.getContext("2d");
  drawLine(ctx, l1);
  drawLine(ctx, l2);
  //bezier(l1, l2);
  setTimeout(bezier, 1000, l1, l2);
};


function bezier(line1, line2){
  //var segments = 100;
  var segments = 5;
  line1Segs = lineSegments(line1, segments);
  line2Segs = lineSegments(line2, segments);
  bezLines = bezierLines(line1Segs, line2Segs);
  bezSegs = bezSegments(bezLines, segments);
  animateLines(bezSegs);
}

function animateLines(lineSegs){
  var canvas = document.getElementById("bezier_canvas");

  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    blankCanvas(ctx, canvas);
    setTimeout(animateLines_, 1000, ctx, lineSegs);
  }
}

function animateLines_(ctx, lines){
  if(lines.length == 0){
    window.alert("Done");
    return;
  }
  drawLine(ctx, hd(lines));
  setTimeout(animateLines_, 1000, ctx, tl(lines));
}

function drawLine(ctx, line){
  ctx.fillStyle = "#101010"
  ctx.moveTo(line.p1.x, line.p1.y);
  ctx.lineTo(line.p2.y, line.p2.y);
  ctx.stroke();
}

function blankCanvas(ctx, canvas){
    drawRect(ctx,
             {x: 0, y: 0,
              h: canvas.height, w: canvas.width,
              r: 255, g: 255, b: 255, a: 1.0,
              fill: "color"});
}

function line(x1, y1, x2, y2){
  return {p1: {x: x1, y: y1}, p2: {x: x2, y: y2}};
}

function lineSegments(l, numSegments){
  var xDist = (l.p2.x - l.p1.x) / numSegments;
  var yDist = (l.p2.y - l.p1.y) / numSegments;
  var segmentNumbers = seq(numSegments);
  /*
   * x1 - x2 will be positive or negative depending on what direction
   * the line is going. If it's negative then dividing by the number
   * of segments will give a negative segment length.
   * Multiplying a negative segment length by the segment number
   * will give us the amounts to go in the proper (up or left) direction.
   */
  var fun = function(seg){
                return line(l.p1.x + ((seg - 1) * xDist),
                            l.p1.y + ((seg - 1) * yDist),
                            l.p1.x + (seg * xDist),
                            l.p1.y + (seg * yDist));
            };
  return map(fun, segmentNumbers);
}

function testLineSegments(){
  var l = line(10, 10, 20, 20);
  var segs = lineSegments(l, 2);
  return segs[0].p1.x == 10 &&
         segs[0].p1.y == 10 &&
         segs[0].p2.x == 15 &&
         segs[0].p2.y == 15 &&
         segs[1].p1.x == 15 &&
         segs[1].p1.y == 15 &&
         segs[1].p2.x == 20 &&
         segs[1].p2.y == 20;
}

function bezierLines(segs1, segs2){
  var points1 = reverse(cons(map(end, segs1), start(hd(segs1))));
  var lastSeg2End = end(hd(reverse(segs2)));
  var points2 = concat(map(start, segs2), [lastSeg2End]);
  var lines = map(function(pair){
                    return {p1: pair[0], p2: pair[1]}
                  },
                  zip(points1, points2));
  return lines;
}

function bezSegments(lines, numSegments){
  var segSeq = seq(numSegments);
  var lineCurrTotals = zip3(lines, segSeq, repeat(numSegments));
  return map(lineSegmentN, lineCurrTotals);
}

function bezSegmentsTest(){
  var line1 = line(10, 10, 20, 20);
  var line2 = line(20, 20, 30, 10);
  var bezSegs = bezSegments([line1, line2], 2);
  var seg1 = bezSegs[0];
  var seg2 = bezSegs[1];
  return seg1.p1.x == 10 &&
         seg1.p1.y == 10 &&
         seg1.p2.x == 15 &&
         seg1.p2.y == 15 &&
         seg2.p1.x == 25 &&
         seg2.p1.y == 15 &&
         seg2.p2.x == 30 &&
         seg2.p2.y == 10 &&
         bezSegs.length == 2;
}

function lineSegmentN(lineCurrTotal){
  var line = lineCurrTotal[0];
  var segNo = lineCurrTotal[1];
  var segTotal = lineCurrTotal[2];
  return lineSegments(line, segTotal)[segNo - 1];
}

function start(line){
  return line.p1;
}

function end(line){
  return line.p2;
}


function drawRect(ctx, obj){
    var fillStyle;
    if(obj.fill == "gradient"){
      obj.x += 5;
      obj.y += 5;
      var gradientX = obj.x + (obj.w / 2);
      var gradientY = obj.y + (obj.w / 2);
      gradient = ctx.createRadialGradient(gradientX, gradientY, obj.w, gradientX, gradientY, 0);
      gradient.addColorStop(0,"rgba(" + obj.gr + "," + obj.gg + "," + obj.gb + ", " + obj.ga + ")");
      gradient.addColorStop(1,"rgba(" + obj.r + "," + obj.g + "," + obj.b + ", " + obj.a + ")");
      fillStyle = gradient;
    }else{
      fillStyle = "rgba(" + obj.r + "," + obj.g + "," + obj.b + ", " + obj.a + ")";
    }
    ctx.fillStyle = fillStyle;
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}
