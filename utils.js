require('./polyfill');

module.exports.fib = function () {
  var prev = 0;
  var current = 1;

  return {
    val : function () { return current; },
    step : function () {
      var temp = current;
      current += prev;
      prev = temp;
      return current;
    }
  };

};

module.exports.max = function (lhs, rhs) {
  if (lhs === undefined) {
    return rhs;
  }
  if (rhs === undefined) {
    return lhs;
  }
  return Math.max(lhs, rhs);
};

module.exports.min = function (lhs, rhs) {
  if (lhs === undefined) {
    return rhs;
  }
  if (rhs === undefined) {
    return lhs;
  }
  return Math.min(lhs, rhs);
};

module.exports.reverseNum = function (num) {
  num = +num;
  if (isNaN(num)) { return undefined; }
  var forwards = num.toString();
  var backwards = forwards.split('').reverse().join('');
  return +backwards;
};

module.exports.counter = function (init) {
  var counts = init || {};

  var mod =  {
    add: function (elem) {
      if (typeof counts[elem] === 'number') {
        counts[elem] += 1;
      } else {
        counts[elem] = 1;
      }
    },

    toString: function () {
      var result = "Counts = [";
      Object.keys(counts).forEach(function (elem) {
        result += elem + ':' + counts[elem] + ', ';
      });
      result += ']';
      return result;
    },

    put: function (elem, value) {
      value = +value;
      counts[elem] = value;
    },

    get: function (elem) {
      if (counts[elem]) {
        return counts[elem];
      }
      return 0;

    },

    getAll: function () {
      return counts;
    },

    combine : function (rhs, combiner) {
      combiner = combiner || module.exports.max;
      var totals = module.exports.counter();


      var lhsKeys = Object.keys(mod.getAll());
      var rhsKeys = Object.keys(rhs.getAll());
      var allKeys = lhsKeys.concat(rhsKeys);

      allKeys.forEach(function (key) {
        var value = combiner(mod.get(key), rhs.get(key));
        totals.put(key, value);
      });
      return totals;
    }
  };

  return mod;

};

module.exports.factor =  function (number) {
  var factors = module.exports.counter();
  var maxFactor = Math.sqrt(number);
  var currentFactor;
  while (number % 2 === 0) {
    factors.add(2);
    number /= 2;
  }
  for (currentFactor = 3; currentFactor <= maxFactor && number !== 1; currentFactor += 2) {
    while (number % currentFactor === 0) {
      factors.add(currentFactor);
      number /= currentFactor;
    }
  }
  if (number !== 1) {
    factors.add(number);
  }

  return factors.getAll();
};

module.exports.isPrime = function (number) {
  var maxFactor = Math.sqrt(number);
  var currentFactor;

  if (number <= 1) { return false; }
  if (number === 2) { return true; }
  if (number === 3) { return true; }

  if (number % 2 === 0) {
    return false;
  }
  for (currentFactor = 3; currentFactor <= maxFactor; currentFactor += 2) {
    if (number % currentFactor === 0) {
      return false;
    }
  }
  return true;
};

module.exports.primeCalc = function () {
  var primes = [2, 3];
  var maxChecked = 3;
  var isPrime = function (number) {
    if (primes.indexOf(number) !== -1) {
      return true;
    }
    var calcTo = Math.sqrt(number);
    while (maxChecked < calcTo) {
      maxChecked += 2;
      if (isPrime(maxChecked)) {
        primes.push(maxChecked);
      }
    }
    var i;
    for (i = 0; i < primes.length; i += 1) {
      if (number % primes[i] === 0) {
        return false;
      }
    }
    return true;
  };
  isPrime.primes = function () {
    return primes;
  };
  return isPrime;
};


module.exports.range = function (begin, end) {
  if (end === undefined) {
    end = begin;
    begin = 1;
  }
  begin = Math.floor(begin);
  end = Math.ceil(end);

  var result = [];
  var iter;
  for (iter = begin; iter <= end; iter += 1) {
    result.push(iter);
  }
  return result;
};

module.exports.bigInt = function (init) {
  var digits;
  var sign;
  if (typeof init === 'number' || typeof init === 'string') {
    digits = String(init);
    sign = 1;
    if (digits[0] === '-') {
      digits = digits.substring(1);
      sign = -1;
    }

    while (digits[0] === '0') {
      digits = digits.substring(1);
    }
    if (digits === '') {
      digits = '0';
    }

  } else {
    digits = init.digits;
    sign = init.sign;
  }

  var normalize = function (array) {
    var answer = [];
    var prefix = '';
    var carry = array.reverse().reduce(function (carryIn, digit) {
      digit += carryIn;
      var carryOut = Math.floor(digit / 10);
      answer.push(digit - carryOut * 10);
      return carryOut;
    }, 0);
    if (carry < 0) {

      answer = answer.map(function (digit) {
        return 9 - digit;
      });
      answer[0] += 1;
      carry += 1;
      prefix = '-';
    }
    if (carry !== 0) {
      answer.push(carry);
    }

    answer = answer.reverse().join('');
    return module.exports.bigInt(prefix + answer);

  };

  var bigIntMod = {

    sign: sign,

    digits: digits,

    add: function (rhs) {
      rhs = module.exports.bigInt(rhs);
      var rhSign = rhs.sign;

      var lhs = digits.split('');
      rhs = rhs.digits.split('');

      while (lhs.length < rhs.length) {
        lhs.unshift('0');
      }
      while (lhs.length > rhs.length) {
        rhs.unshift('0');
      }

      var answer = lhs.map(function (digit, index) {
        var rhDigit = +rhs[index];
        return +digit * sign + (rhDigit * rhSign);
      });
      return normalize(answer);

    },

    plus: function (rhs) {
      return bigIntMod.add(rhs);
    },

    subtract: function (rhs) {
      rhs = module.exports.bigInt(rhs);

      if (rhs.sign > 0) {
        return bigIntMod.add('-' + rhs.toString());
      }
      return bigIntMod.add(rhs.digits);

    },

    minus: function (rhs) {
      return bigIntMod.subtract(rhs);
    },

    multiply: function (rhs) {
      rhs = module.exports.bigInt(rhs);
      var prefix = sign * rhs.sign > 0 ? '' : '-';

      var lhs = digits.split('').reverse();
      rhs = rhs.digits.split('').reverse();
      var answer = [];
      var newLength;
      for (newLength = 0; newLength < lhs.length + rhs.length; newLength += 1) {
        answer.push(0);
      }

      lhs.forEach(function (digit, index) {
        rhs.forEach(function (rhDigit, rhIndex) {
          answer[index + rhIndex] += digit * rhDigit;
        });
      });

      answer = answer.reverse();

      var normal = normalize(answer);
      return module.exports.bigInt(prefix + normal);
    },

    times: function (rhs) {
      return bigIntMod.multiply(rhs);
    },

    divide: function (rhs) {
      rhs = module.exports.bigInt(rhs);
      var prefix = sign * rhs.sign > 0 ? '' : '-';

      var lhs = module.exports.bigInt(digits);
      rhs = module.exports.bigInt(rhs.digits);

      var powers = [];
      while (rhs.lte(lhs)) {
        powers.push(rhs);
        rhs = rhs.multiply(2);
      }

      var answer = module.exports.bigInt(0);

      rhs = powers.pop();

      while (rhs !== undefined) {
        answer = answer.multiply(2);
        if (rhs.lte(lhs)) {
          answer = answer.add(1);
          lhs = lhs.minus(rhs);
        }
        rhs = powers.pop();
      }

      return module.exports.bigInt(prefix + answer.toString());
    },

    power: function (rhs) {
      rhs = module.exports.bigInt(rhs);
      if (rhs.sign < 0) {
        return module.exports.bigInt(0);
      }
      var lhs = module.exports.bigInt({
        digits: digits,
        sign: sign
      });

      var power = module.exports.bigInt(1);
      var powers = [lhs];
      while (power.lt(rhs)) {
        power = power.times(2);
        lhs = lhs.times(lhs);
        powers.push(lhs);
      }

      var answer = module.exports.bigInt(1);
      lhs = powers.pop();
      while (lhs !== undefined) {
        if (power.lte(rhs)) {
          answer = answer.times(lhs);
          rhs = rhs.minus(power);
        }
        power = power.dividedBy(2);
        lhs = powers.pop();
      }
      return answer;
    },

    toThe: function (rhs) {
      return bigIntMod.power(rhs);
    },

    pow: function (rhs) {
      return bigIntMod.power(rhs);
    },

    to: function (rhs) {
      return bigIntMod.power(rhs);
    },

    over: function (rhs) {
      return bigIntMod.divide(rhs);
    },

    dividedBy: function (rhs) {
      return bigIntMod.divide(rhs);
    },

    equals: function (rhs) {
      return digits === rhs.digits && sign === rhs.sign;
    },

    lessThan: function (rhs) {
      rhs = module.exports.bigInt(rhs);
      if (sign !== rhs.sign) {
        return sign < rhs.sign;
      }
      if (digits.length !== rhs.digits.length) {
        return digits.length < rhs.digits.length;
      }

      var result = digits.split('').reduce(function (answer, digit, index) {
        if (answer !== undefined) {
          return answer;
        }
        if (digit !== rhs.digits[index]) {
          return (+digit) < (+rhs.digits[index]);
        }
        return undefined;
      }, undefined);

      if (result === undefined) {
        //Equal
        return false;
      }

      if (sign < 0) {
        return !result;
      }
      return result;
    },

    lt: function (rhs) {
      return bigIntMod.lessThan(rhs);
    },

    lte: function (rhs) {
      return bigIntMod.equals(rhs) || bigIntMod.lessThan(rhs);
    },

    greaterThan: function (rhs) {
      return !bigIntMod.lte(rhs);
    },

    gt: function (rhs) {
      return !bigIntMod.lte(rhs);
    },

    gte: function (rhs) {
      return !bigIntMod.lt(rhs);
    },

    toString: function () {
      var prefix = sign > 0 ? '' : '-';
      return prefix + digits;
    }
  };

  return Object.freeze(bigIntMod);
};

module.exports.factorial = function (num) {
  return module.exports.range(num).reduce(function (prev, curr) {
    return prev.multiply(curr);
  }, module.exports.bigInt(1));
};

module.exports.collatz = function (value) {
  if (value % 2 === 0) {
    return value / 2;
  }
  return 3 * value + 1;
};

module.exports.wordFor = function (number) {
  if (number === 0) {
    return 0;
  }
  var digits = number.toString().split('')
    .map(function (digit) {
      return +digit;
    });
  var result = '';
  var ones = digits.pop();
  var tens = digits.pop();
  if (tens === 1) {
    switch (ones) {
    case 0:
      result = 'ten';
      break;
    case 1:
      result = 'eleven';
      break;
    case 2:
      result = 'twelve';
      break;
    case 3:
      result = 'thirteen';
      break;
    case 4:
      result = 'fourteen';
      break;
    case 5:
      result = 'fifteen';
      break;
    case 6:
      result = 'sixteen';
      break;
    case 7:
      result = 'seventeen';
      break;
    case 8:
      result = 'eighteen';
      break;
    case 9:
      result = 'nineteen';
      break;
    }
  } else {
    switch (tens) {
    case 0:
      result = '';
      break;
    case 2:
      result = 'twenty';
      break;
    case 3:
      result = 'thirty';
      break;
    case 4:
      result = 'forty';
      break;
    case 5:
      result = 'fifty';
      break;
    case 6:
      result = 'sixty';
      break;
    case 7:
      result = 'seventy';
      break;
    case 8:
      result = 'eighty';
      break;
    case 9:
      result = 'ninety';
      break;
    }
    switch (ones) {
    case 0:
      result += '';
      break;
    case 1:
      result += 'one';
      break;
    case 2:
      result += 'two';
      break;
    case 3:
      result += 'three';
      break;
    case 4:
      result += 'four';
      break;
    case 5:
      result += 'five';
      break;
    case 6:
      result += 'six';
      break;
    case 7:
      result += 'seven';
      break;
    case 8:
      result += 'eight';
      break;
    case 9:
      result += 'nine';
      break;
    }
  }
  return result;
};
module.exports.divisors = function (n) {
  var factors = module.exports.factor(n);
  var divs = [1];
  Object.keys(factors).forEach(function (factor) {
    var multiplicity = factors[factor];
    module.exports.range(1, multiplicity).forEach(function (currIter) {
      var divsLength = divs.length;
      var currentIndex;
      var currentDiv;
      for (currentIndex = 0; currentIndex < divsLength; currentIndex += 1) {
        currentDiv = divs[currentIndex] * factor;
        if (currIter === 1 || divs.indexOf(currentDiv) === -1) {
          divs.push(currentDiv);
        }
      }
    });
  });
  divs = divs.sort(function (lhs, rhs) {
    return lhs - rhs;
  });
  //Remove self, not a 'proper' divisor
  divs.pop();
  return divs;
};

module.exports.permute = function (array) {
  if (typeof array === "number") {
    array = array.toString();
  }
  if (typeof array === "string") {
    array = array.split('').map(function (elem) {
      return +elem;
    });
  }
  var idx = array.length - 1;

  while (array[idx - 1] > array[idx]) {
    idx -= 1;
  }

//  console.log(idx);
  var lowers = array.splice(idx - 1);
//  console.log(array);
//  console.log(lowers);

  var currentFirst = lowers[0];

  lowers = lowers.sort();
  var newFirst = lowers.splice(lowers.indexOf(currentFirst) + 1, 1)[0];
  if (newFirst) {
    array.push(newFirst);
  }
  array = array.concat(lowers);
  return array;
};

module.exports.arrayEquals = function (lhs, rhs) {
  if (lhs.length !== rhs.length) {
    return false;
  }
  var i;
  for (i = 0; i < lhs.length; i += 1) {
    if (lhs[i] !== rhs[i]) {
      return false;
    }
  }
  return true;
};

module.exports.sum = function (lhs, rhs) {
  return +lhs + (+rhs);
};

module.exports.overlaps = function (lhs, rhs) {
  var result = [];

  lhs.forEach(function (elem) {
    var overlapped = rhs.some(function (otherElem) {
      return elem === otherElem;
    });
    if (overlapped) {
      result.push(elem);
    }
  });
  return result;
};
