function demo(){
  var l1 = {p1: {x: 10, y: 10}, p2: {x: 15, y: 200}};
  var l2 = {p1: {x: 200, y: 40}, p2: {x: 220, y: 150}};
  var canvas = document.getElementById("bezier_canvas");
  var ctx = canvas.getContext("2d");
  drawLine(ctx, l1);
  drawLine(ctx, l2);
  //setTimeout(bezier, 1000, l1, l2);
  bezier(l1, l2);
};

function demo2(){
  var l1 = {p1: {x: 15, y: 200}, p2: {x: 10, y: 10}};
  var l2 = {p1: {x: 200, y: 40}, p2: {x: 220, y: 150}};
  var canvas = document.getElementById("bezier_canvas");
  var ctx = canvas.getContext("2d");
  blankCanvas(ctx, canvas);
  drawLine(ctx, l1);
  drawLine(ctx, l2);
  var fractions = seqBy(0, 1, .01);
  var l1Points = map(function(f){ return linePoint(l1, f) }, fractions);
  var l2Points = map(function(f){ return linePoint(l2, f) }, fractions);
  var points = zip(l1Points, l2Points);
  var crossLines = map(function(ps){ return lineFromPoints(ps[0], ps[1]) }, points);
  var bezLinePoints = zip(crossLines, fractions);
  var bezPoints = map(function(lp){ return linePoint(lp[0], lp[1]) }, bezLinePoints);
  drawPoints(ctx, bezPoints);
}

function demo3(){
  var l1 = {p1: {x: 50, y: 200}, p2: {x: 10, y: 10}};
  var l2 = {p1: {x: 200, y: 40}, p2: {x: 220, y: 150}};
  var fractions = seqBy(0, 1, 0.01);
  var canvas = document.getElementById("bezier_canvas");
  var ctx = canvas.getContext("2d");
  blankCanvas(ctx, canvas);
  drawLine(ctx, l1);
  drawLine(ctx, l2);
  var points = map(function(frac){ return bezierPoint([l1,l2],frac) }, fractions);
  drawPoints(ctx, points);
}

function demo4(){
  var l1 = {p1: {x: 50, y: 200}, p2: {x: 10, y: 10}};
  var l2 = {p1: {x: 200, y: 40}, p2: {x: 220, y: 150}};
  var l3 = {p1: {x: 220, y: 150}, p2: {x: 120, y: 50}};
  var fractions = seqBy(0, 1, 0.01);
  var canvas = document.getElementById("bezier_canvas");
  var ctx = canvas.getContext("2d");
  blankCanvas(ctx, canvas);
  drawLine(ctx, l1, "#FF0000");
  drawLine(ctx, l2, "#00FF00");
  drawLine(ctx, l3, "#0000FF");
  var points = map(function(frac){ return bezierPoint([l1,l2,l3],frac) }, fractions);
  var lines = map(lineFromPair, pairs(points));
  animateLines(lines);
}

function demo5(){
  var l1 = {p1: {x: 50, y: 200}, p2: {x: 10, y: 10}};
  var l2 = {p1: {x: 200, y: 40}, p2: {x: 220, y: 150}};
  var l3 = {p1: {x: 220, y: 150}, p2: {x: 120, y: 50}};
  var fractions = seqBy(0, 1, 0.01);
  var canvas = document.getElementById("bezier_canvas");
  var ctx = canvas.getContext("2d");
  blankCanvas(ctx, canvas);
  drawLine(ctx, l1, "#FF0000");
  drawLine(ctx, l2, "#00FF00");
  drawLine(ctx, l3, "#0000FF");
  var lines = [l1,l2,l3];
  var breakdowns = map(function(frac){ return bezierBreakdowns(lines, lines, frac) }, fractions);
  animateBreakdowns(breakdowns);
}

function drawPoints(ctx, points){
  var f = function(p, acc){
            var prev = acc[0];
            var lines_ = acc[1];
            var line = lineFromPoints(p, prev);
            return [p, cons(lines_, line)];
          };
  var lines0 = foldl(f, tl(points), [hd(points), []]);
  var lines = lines0[1];
  map(function(line){ drawLine(ctx, line) }, lines);
}


function bezier(line1, line2){
  var segments = 500;
  var line1Segs = lineSegments(line1, segments);
  var line2Segs = lineSegments(line2, segments);
  var bezLines = bezierLines(line1Segs, line2Segs);
  var bezSegs = bezSegments(bezLines);
  animateLines(bezSegs);
}

function animateLines(line){
  var canvas = document.getElementById("bezier_canvas");

  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    blankCanvas(ctx, canvas);
    setTimeout(animateLines_, 0, ctx, lines);
  }
}

function animateLines_(ctx, lines){
  if(lines.length == 0){
    return;
  }
  drawLine(ctx, hd(lines));
  setTimeout(animateLines_, 0, ctx, tl(lines));
}

function animateBreakdowns(ctx, breakdowns){
  var colourDefs = [{line: "#FF0000",
                     point: "#0000FF"},
                    {line: "#00FF00",
                     point: "#FFFF00"},
                    {line: "#0000FF",
                     point: "#FF0000"},
                    {line: "#FFFF00",
                     point: "#00FF00"},
                    {line: "#00FFFF",
                     point: "#990000"}];

  var canvas = document.getElementById("bezier_canvas");

  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    blankCanvas(ctx, canvas);
    setTimeout(animateBreakdowns_, 100, ctx, breakdowns, colourDefs);
  }
}

function animateBreakdowns_(ctx, breakdowns, colourDefs){
  animateBreakdown(ctx, hd(breakdowns), colourdefs)
  setTimeout(animateBreakdowns_, 100, ctx, tl(breakdowns), colourDefs);
}

function animateBreakdown(ctx, breakdowns, colourDefs){
  map(function(bd){animateBreakdown_(ctx, bd, colourDefs)}, breakdowns);
}

function animateBreakdown_(ctx, breakdown, colorDef){
  map(function(l){ drawLine(ctx, l) }, breakdown.guides);
  map(function(l){ drawLine(ctx, l, colourDef.line) }, breakdown.lines);
  map(function(p){ drawPoint(ctx, p, colourDef.point) }, breakdown.points);
}

function drawLine(ctx, line, maybe_strokeStyle){
  var strokeStyle = "#101010";
  if(maybe_strokeStyle != undefined){
    strokeStyle = maybe_strokeStyle;
  }

  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(line.p1.x, line.p1.y);
  ctx.lineTo(line.p2.x, line.p2.y);
  ctx.stroke();
}

function drawPoint(ctx, point, maybe_fillStyle){
  var fillStyle = "#101010";
  if(maybe_fillStyle != undefined){
    fillStyle = maybe_fillStyle;
  }

  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(point.x,point.y,20,0,2*Math.PI);
  ctx.fill();
}

function blankCanvas(ctx, canvas){
    drawRect(ctx,
             {x: 0, y: 0,
              h: canvas.height, w: canvas.width,
              r: 255, g: 255, b: 255, a: 1.0});
}

function line(x1, y1, x2, y2){
  return {p1: {x: x1, y: y1}, p2: {x: x2, y: y2}};
}

function lineFromPoints(p1, p2){
  return {p1: p1, p2: p2};
}

function lineFromPair(pair){
  return lineFromPoints(pair[0], pair[1]);
}

/*
 * recursively reduce line pairs to lines and the final line to a point
 * using a fraction.
 * e.g. given lines a, b, c find fractional midpoints fa, fb, fc
 * then recurse with fa-fb, fb-fc, find the fractional midpoints fab, fbc
 * then recurse with line fab-fbc to get the final point fabbc
 */
function bezierPoint(lines, fraction){
  if(lines.length == 1){
    return linePoint(lines[0], fraction);
  }
  var points = map(function(l){ return linePoint(l, fraction) }, lines);
  var pointPairs = tl(reverse(zip(points, rotate(points))));
  var bezLines = map(lineFromPair, pointPairs);
  return bezierPoint(bezLines, fraction);
}

function bezierBreakdowns(lines, sub_lines, fraction, maybe_breakdowns){
  var breakdowns = [];
  if(sub_lines.length == 0){
    return maybe_breakdowns;
  }
  if(maybe_breakdowns != undefined){
    breakdowns = maybe_breakdowns;
  }
  var func = function(pair){ return bezierLine(pair[0], pair[1], fraction); };
  var breakdown_lines = map(func, pairs(sub_lines));
  var breakdown_points = map(function(l){return linePoint(l, fraction)}, sub_lines);
  var breakdown = {guides: lines,
                   lines: breakdown_lines,
                   points: breakdown_points};
  return bezierBreakdowns(lines, breakdown_lines, fraction, cons(breakdowns, breakdown));
}

function linePoint(l, fraction){
  var x = l.p1.x + ((l.p2.x - l.p1.x) * fraction);
  var y = l.p1.y + ((l.p2.y - l.p1.y) * fraction);
  return {x: Math.round(x), y: Math.round(y)};
}

function bezierLine(l1, l2, fraction){
  return lineFromPoints(linePoint(l1, fraction),
                        linePoint(l2, fraction));
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

function bezSegments(lines){
  var segs = lines.length
  var segSeq = seq(segs);
  var lineCurrTotals = zip3(lines, segSeq, repeat(segs, segs));
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

function lineSegmentsTest(){
  var l = line(10, 10, 20, 20);
  var segs = lineSegments(l, 2);
  return segs[0].p1.x == 10 &&
         segs[0].p1.y == 10 &&
         segs[0].p2.x == 15 &&
         segs[0].p2.y == 15 &&
         segs[1].p1.x == 15 &&
         segs[1].p1.y == 15 &&
         segs[1].p2.x == 20 &&
         segs[1].p2.y == 20 &&
         segs.length == 2;
}

function start(line){
  return line.p1;
}

function end(line){
  return line.p2;
}


function drawRect(ctx, obj){
    var fillStyle = "rgba(" + obj.r + "," +
                              obj.g + "," +
                              obj.b + ", " +
                              obj.a + ")";
    ctx.fillStyle = fillStyle;
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}
