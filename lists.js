function hd(arr){
  return arr[0];
}

function tl(arr){
  return arr.slice(1);
}

function tlTest(){
  var arr = [1,2,3];
  var tail = tl(arr);
  return arr[0] == 1 &&
         arr[1] == 2 &&
         arr[2] == 3 &&
         arr.length == 3 &&
         tail[0] == 2 &&
         tail[1] == 3 &&
         tail.length == 2;
}

function cons(arr, elem){
  copy = arr.slice(0);
  copy.unshift(elem);
  return copy;
}

function consTest(){
  var arr = [1,2,3];
  var arr2 = cons(arr, 0);
  return arr.length == 3 &&
         arr[0] == 1 &&
         arr[1] == 2 &&
         arr[2] == 3 &&
         arr2.length == 4 &&
         arr2[0] == 0 &&
         arr2[1] == 1 &&
         arr2[2] == 2 &&
         arr2[3] == 3;
}

function reverse(arr){
  copy = arr.slice(0);
  copy.reverse();
  return copy;
}

function reverseTest(){
  var arr = [1,2,3];
  var rev = reverse(arr);
  return arr[0] == 1 &&
         arr[1] == 2 &&
         arr[2] == 3 &&
         rev[0] == 3 &&
         rev[1] == 2 &&
         rev[2] == 1;
}

function concat(arr1, arr2){
  return arr1.concat(arr2);
}

function map(fun, arr, maybe_results){
  var results = (maybe_results == undefined ? [] : maybe_results.slice(0));
  var next;
  if(arr.length == 0){
    return reverse(results);
  }else{
    return map(fun, tl(arr), cons(results, fun(hd(arr))));
  }
}

function mapTest(){
  var result = map(function(x){ return x + 1 }, seq(3));
  return result[0] == 2 &&
         result[1] == 3 &&
         result[2] == 4;
}

function seq(maybe_next, maybe_end, maybe_sequence){
  var next;
  var end;
  var sequence;
  if(maybe_end == undefined){
    end = maybe_next;
    next = 1;
  }else{
    next = maybe_next;
    end = maybe_end;
  }
  if(maybe_sequence == undefined){
    sequence = [];
  }else{
    sequence = maybe_sequence.slice(0);
  }
  if(next > end){
    return sequence;
  }else{
    sequence.push(next);
    return seq(next + 1, end, sequence);
  }
}

function seqTest(){
  var seq1 = seq(3);
  var seq2 = seq(4,6);
  return seq1[0] == 1 &&
         seq1[1] == 2 &&
         seq1[2] == 3 &&
         seq1.length == 3 &&
         seq2[0] == 4 &&
         seq2[1] == 5 &&
         seq2[2] == 6 &&
         seq2.length == 3;
}

function seqBy(start, end, step, maybe_sequence){
  var sequence;
  if(maybe_sequence == undefined){
    sequence = [];
  }else{
    sequence = maybe_sequence;
  }
  if(start > end){
    return reverse(sequence);
  }
  var next = parseFloat((start + step).toFixed(6));
  return seqBy(next, end, step, cons(sequence, start));
}

function seqByTest(){
  var seq = seqBy(3, 3.3, 0.1);
  return seq[0] == 3 &&
         seq[1] == 3.1 &&
         seq[2] == 3.2 &&
         seq[3] == 3.3 &&
         seq.length == 4;
}

function repeat(elem, count){
  var sequence = seq(count);
  return map(function(x){ return elem }, sequence);
}

function repeatTest(){
  var arr = repeat('x', 4);
  return arr[0] == 'x' &&
         arr[1] == 'x' &&
         arr[2] == 'x' &&
         arr[3] == 'x';
}

function filter(fun, arr){
  return filter_(fun, arr, []);
}

function filter_(fun, arr, results){
  if(arr.length == 0){
    return reverse(results);
  }

  if(fun(hd(arr))){
    return filter_(fun, tl(arr), cons(results, hd(arr)));
  } else {
    return filter_(fun, tl(arr), results.slice(0));
  }
}

function filterTest(){
  var even = function(x){return x % 2 == 0};
  var results = filter(even, [1,2,3,4]);
  return results[0] == 2 &&
         results[1] == 4;
}

function foldl(fun, arr, acc){
  if(arr.length == 0){
    return acc;
  }
  return foldl(fun, tl(arr), fun(hd(arr), acc));
}

function zip(arr1, arr2){
  return zip_(arr1, arr2, []);
}

function zip_(arr1, arr2, zips){
  if(arr1.length == 0 ||
     arr2.length == 0){
    return reverse(zips);
  }

  return zip_(tl(arr1),
              tl(arr2),
              cons(zips, [hd(arr1), hd(arr2)]));

}

function zip3(arr1, arr2, arr3){
  return zip3_(arr1, arr2, arr3, []);
}

function zip3_(arr1, arr2, arr3, zips){
  if(arr1.length == 0 ||
     arr2.length == 0 ||
     arr3.length == 0){
    return reverse(zips);
  }

  return zip3_(tl(arr1),
              tl(arr2),
              tl(arr3),
              cons(zips, [hd(arr1), hd(arr2), hd(arr3)]));
}

function zip3Test(){
  var arr1 = [1,2,3];
  var arr2 = [4,5,6];
  var arr3 = [7,8,9];

  var zipped = zip3(arr1, arr2, arr3);
  return zipped[0][0] == 1 &&
         zipped[0][1] == 4 &&
         zipped[0][2] == 7 &&
         zipped[1][0] == 2 &&
         zipped[1][1] == 5 &&
         zipped[1][2] == 8 &&
         zipped[2][0] == 3 &&
         zipped[2][1] == 6 &&
         zipped[2][2] == 9 &&
         zipped.length == 3 &&
         zipped[0].length == 3 &&
         zipped[1].length == 3 &&
         zipped[2].length == 3;
}

function pairs(arr){
  return pairs_(arr);
}

function pairs_(arr, maybe_pairs){
  var pairs;
  if(maybe_pairs == undefined){
    pairs = [];
  }else{
    pairs = maybe_pairs;
  }

  if(arr.length < 2){
    return pairs;
  }

  return pairs_(tl(arr), cons(pairs, [hd(arr), hd(tl(arr))]));
}

function pairsTest(){
  var arr = [1,2,3,4,5];
  pairs1 = reverse(pairs([1,2,3,4,5]));
  pairs2 = pairs([1,2]);
  return pairs1[0][0] == 1 &&
         pairs1[0][1] == 2 &&
         pairs1[1][0] == 2 &&
         pairs1[1][1] == 3 &&
         pairs1[2][0] == 3 &&
         pairs1[2][1] == 4 &&
         pairs1[3][0] == 4 &&
         pairs1[3][1] == 5 &&
         pairs1.length == 4 &&
         pairs2[0][0] == 1 &&
         pairs2[0][1] == 2 &&
         pairs2.length == 1 &&
         pairs([]).length == 0 &&
         pairs([1]).length == 0;
}

function rotate(arr){
  if(arr.length == 0){
    return [];
  }else if(arr.length == 1){
    return arr.slice(0);
  }
  return reverse(cons(reverse(tl(arr)), hd(arr)));
}

function rotateTest(){
  var result = rotate([1,2,3]);
  return result[0] == 2 &&
         result[1] == 3 &&
         result[2] == 1 &&
         result.length == 3 &&
         rotate([]).length == 0 &&
         rotate([1])[0] == 1 &&
         rotate([1]).length == 1;
}
