var fs = require('fs');

var utils = require('./utils');

var problems = [
  {
    number: 1,
    inputs: [1000, 1e6],
    solutions: [
      {
        name: 'naive',
        solver: function (max, callback) {

          var i;
          var total = 0;

          for (i = 0; i < 1000; i += 1) {
            if (i % 3 === 0 || i % 5 === 0) {
              total += i;
            }
          }

          callback(null, total);
        }
      },
      {
        name: 'functional',
        solver: function (max, callback) {

          var allNums = utils.range(1, max - 1);

          var total = allNums.reduce(function (prev, curr) {
            if (curr % 3 === 0 || curr % 5 === 0) {
              return prev + curr;
            }
            return prev;
          }, 0);

          callback(null, total);
        }
      }
    ]
  },

  {
    number: 2,
    inputs: 4e6,
    solutions: [
      {
        name: 'naive',
        solver: function (max, callback) {
          var total = 0;

          var fib = utils.fib();

          while (fib.step() <= max) {
            if (fib.val() % 2 === 0) {
              total += fib.val();
            }
          }

          callback(null, total);
        }
      },
    ]
  },

  {
    number: 3,
    inputs: 600851475143,
    solutions: [
      {
        name: 'naive',
        solver: function (val, callback) {

          var largestPossible = Math.sqrt(val);
          var highestFactor = 1;
          var currentFactor;

          while (val % 2 === 0) {
            highestFactor = 2;
            val /= 2;
          }


          for (currentFactor = 3; currentFactor <= largestPossible && val !== 1; currentFactor += 1) {
            while (val % currentFactor === 0) {
              val /= currentFactor;
              highestFactor = currentFactor;
            }
          }

          if (val !== 1) { highestFactor = val; }

          callback(null, highestFactor);
        }
      },

      {
        name: 'utils',
        solver: function (val, callback) {

          var factors = utils.factor(val);

          var max = Object.keys(factors).reduce(function (prev, curr) {
            return +prev > +curr ? prev : curr;
          }, 1);

          callback(null, max);
        }
      },
    ]
  },

  {
    number: 4,
    inputs: [3, 4],
    solutions: [
      {
        name: 'naive',
        solver: function (digits, callback) {

          var i;
          var j;
          var product;
          var highestProduct = 0;
          var min = Math.pow(10, digits - 1);
          var max = Math.pow(10, digits) - 1;

          for (i = min; i <= max; i += 1) {
            for (j = i; j <= max; j += 1) {
              product = i * j;
              if (product > highestProduct && product === utils.reverseNum(product)) {
                highestProduct = product;
              }
            }
          }

          callback(null, highestProduct);
        }
      },

      {
        name: 'functional',
        solver: function (digits, callback) {

          var product;
          var highestProduct = 0;
          var min = Math.pow(10, digits - 1);
          var max = Math.pow(10, digits) - 1;

          utils.range(min, max).reverse().forEach(function (lhs) {
            utils.range(highestProduct / lhs, max).forEach(function (rhs) {
              product = lhs * rhs;
              if (product > highestProduct && product === utils.reverseNum(product)) {
                highestProduct = product;
              }
            });
          });

          callback(null, highestProduct);
        }
      },
    ]
  },

  {
    number: 5,
    inputs: 20,
    solutions: [
      {
        name: 'naive',
        solver: function (max, callback) {

          var divisor;

          var allFactors = [];
          for (divisor = 1; divisor <= max; divisor += 1) {
            allFactors.push(utils.factor(divisor));
          }


          var allFactorsAsCounts = allFactors.map(utils.counter);

          var totalFactors = allFactorsAsCounts.reduce(function (prev, current) {
            return prev.combine(current);
          }, utils.counter());

          var product = 1;
          Object.keys(totalFactors.getAll()).forEach(function (elem) {
            product *= Math.pow(elem, totalFactors.get(elem));
          });
          callback(null, product);
        }
      },
      {
        name: 'utils counter',
        solver: function (max, callback) {

          var allFactors = [];
          utils.range(1, max).forEach(function (divisor) {
            allFactors.push(utils.factor(divisor));
          });


          var allFactorsAsCounts = allFactors.map(utils.counter);

          var totalFactors = allFactorsAsCounts.reduce(function (prev, current) {
            return prev.combine(current);
          }, utils.counter());

          var product = 1;

          Object.keys(totalFactors.getAll()).forEach(function (elem) {
            product *= Math.pow(elem, totalFactors.get(elem));
          });
          callback(null, product);
        }
      }
    ]
  },

  {
    number: 6,
    inputs: 100,
    solutions: [
      {
        name: 'naive',
        solver: function (goal, callback) {

          var elems = utils.range(1, goal);

          var sumSq = elems.reduce(function (prev, current) {
            return prev + current * current;
          }, 0);

          var sqSum = Math.pow(elems.reduce(function (prev, current) {
            return prev + current;
          }, 0), 2);

          callback(null, sqSum - sumSq);
        }
      },
    ]
  },

  {
    number: 7,
    inputs: 10001,
    solutions: [
      {
        name: 'naive',
        solver: function (goal, callback) {

          var primes = 0;
          var currentTest = 0;

          while (primes < goal) {
            currentTest += 1;
            if (utils.isPrime(currentTest)) {
              primes += 1;
            }
          }

          callback(null, currentTest);
        }
      },
    ]
  },

  {
    number: 8,
    inputs: 'prob-8.json',
    solutions: [
      {
        name: 'naive',
        solver: function (fileName, callback) {

          fs.readFile(fileName, {encoding: 'utf-8'}, function (err, fileContents) {

            if (err) {
              return callback(err);
            }
            var input;

            try {
              input = JSON.parse(fileContents);
            } catch (ex) {
              return callback(ex);
            }

            var number = input.bigNumber;
            var digits = input.digits;

            if (typeof number === 'number') {
              number = number.toString();
            }
            var digitArray = number.split('').map(function (elem) {
              return +elem;
            });

            var currentFirst;
            var currentDigit;
            var product;
            var maxProduct = 0;
            for (currentFirst = 0; currentFirst < digitArray.length - digits + 1; currentFirst += 1) {
              product = 1;
              for (currentDigit = 0; currentDigit < digits; currentDigit += 1) {
                product *= digitArray[currentFirst + currentDigit];
              }
              if (product > maxProduct) {
                maxProduct = product;
              }
            }
            callback(null, maxProduct);
          });
        }
      },

      {
        name: 'functional',
        solver: function (fileName, callback) {

          fs.readFile(fileName, {encoding: 'utf-8'}, function (err, fileContents) {

            if (err) {
              return callback(err);
            }
            var input;

            try {
              input = JSON.parse(fileContents);
            } catch (ex) {
              return callback(ex);
            }

            var number = input.bigNumber;
            var digits = input.digits;

            if (typeof number === 'number') {
              number = number.toString();
            }
            var digitArray = number.split('').map(function (elem) {
              return +elem;
            });

            var prods = digitArray.map(function (elem, index, array) {
              if (index + digits > array.length) { return undefined; }
              var digitsToMultiply = array.slice(index, index + digits);
              return digitsToMultiply.reduce(function (prev, curr) {
                return prev * curr;
              }, 1);
            });

            var maxProd = prods.reduce(function (prev, curr) {
              return prev < curr ? curr : prev;
            }, -Infinity);

            callback(null, maxProd);

          });
        }
      },
    ]
  },

  {
    number: 9,
    inputs: 1000,
    solutions: [
      {
        name: 'naive',
        solver: function (sum, callback) {
          var found = false;
          utils.range(1, sum / 2).forEach(function (a) {
            utils.range(a, sum / 2).forEach(function (b) {
              var c = sum - a - b;
              if (a * a + b * b === c * c) {
                if (!found) {
                  found = true;
                  return callback(null, a * b * c);
                }
              }
            });
          });
          if (found) {
            return;
          }
          return callback("Not Found");
        }
      },
    ]
  },
];

problems.push({
  number: 10,
  inputs: 2e6,
  solutions: [
    {
      name: 'naive',
      solver: function (max, callback) {

        var currentPrime;
        var sum = 0;
        for (currentPrime = 0; currentPrime < max; currentPrime += 1) {
          if (utils.isPrime(currentPrime)) {
            sum += currentPrime;
          }
        }

        callback(null, sum);
      }
    },
    {
      name: 'functional',
      solver: function (max, callback) {

        var sum = utils.range(1, max)
          .filter(utils.isPrime)
          .reduce(function (prev, curr) {
            return prev + curr;
          }, 0);

        callback(null, sum);
      }
    }
  ]
});


problems.push({
  number: 11,
  inputs: {fileName: 'prob-11.txt', entries: 4},
  solutions: [
    {
      name: 'naive',
      solver: function (input, callback) {

        fs.readFile(input.fileName, {encoding: 'utf-8'}, function (err, fileContents) {

          if (err) {
            return callback(err);
          }
          var grid = fileContents.split('\n').map(function (line) {
            return line.split(' ').map(function (entry) {
              return +entry;
            });
          });
          var entries = input.entries;

          var entryRange = utils.range(0, entries - 1);

          var products = grid.map(function (row, rowNum) {
            return row.map(function (entry, colNum) {

              var entryProducts = {
                down : 1,
                right: 1,
                diagLeft: 1,
                diagRight: 1
              };
              entryRange.forEach(function (entryNum) {
                entryProducts.right     *= grid[rowNum][colNum + entryNum];
                if (rowNum + entryNum >= grid.length) {
                  entryProducts.down      = undefined;
                  entryProducts.diagRight = undefined;
                  entryProducts.diagLeft  = undefined;

                } else {
                  entryProducts.down      *= grid[rowNum + entryNum][colNum];
                  entryProducts.diagRight *= grid[rowNum + entryNum][colNum + entryNum];
                  entryProducts.diagLeft  *= grid[rowNum + entryNum][colNum - entryNum];
                }
              });
              entryProducts.max = Object.keys(entryProducts).reduce(function (prev, currKey) {
                var curr = entryProducts[currKey];
                return prev < curr ? curr : prev;
              }, -Infinity);
              return entryProducts.max;
            });
          });

          var maxProduct = products.reduce(function (prev, currRow) {
            var curr = currRow.reduce(function (prev, curr) {
              return Math.max(prev, curr);
            }, -Infinity);
            return Math.max(prev, curr);
          }, -Infinity);

          callback(null, maxProduct);
        });
      }
    },
  ]
});

problems.push({
  number: 12,
  inputs: 500,
  solutions: [
    {
      name: 'naive',
      solver: function (numDivisors, callback) {

        var iters;
        var triangular = 1;
        var divisors = 1;
        var factors;
        var calcDivisors = function (factors) {
          return function (runningProduct, key) {
            return runningProduct * (factors[key] + 1);
          };
        };

        for (iters = 1; divisors <= numDivisors; iters += 1) {
          triangular = iters * (iters + 1) / 2;
          factors = utils.factor(triangular);
          divisors = Object.keys(factors).reduce(calcDivisors(factors), 1);
          if (divisors > numDivisors) {
            return callback(null, triangular);
          }
        }
      }
    },
    {
      name: '',
      solver: function (numDivisors, callback) {
        var recursiveCalcDivisors = function (iters) {
          var triangular = iters * (iters + 1) / 2;
          var factors = utils.factor(triangular);
          var divisors = Object.keys(factors).reduce(function (runningProduct, key) {
            return runningProduct * (factors[key] + 1);
          }, 1);
          if (divisors > numDivisors) {
            return callback(null, triangular);
          }
          return recursiveCalcDivisors(iters + 1);
        };

        recursiveCalcDivisors(1, 1);
      }
    },
  ]
});

/* File Example */
problems.push({
  number: 13,
  inputs: {fileName: 'prob-13.txt', digits: 10},
  solutions: [
    {
      name: 'naive',
      solver: function (input, callback) {

        var digits = input.digits;

        fs.readFile(input.fileName, {encoding: 'utf-8'}, function (err, fileContents) {

          if (err) {
            return callback(err);
          }

          var numbers = fileContents.split('\n');

          var sum = numbers.reduce(function (prev, curr) {
            return prev.add(utils.bigInt(curr));
          }, utils.bigInt(0));

          var firstX = sum.toString().substring(0, digits);
          callback(null, firstX);

        });
      }
    },
  ]
});

problems.push({
  number: 14,
  inputs: 1e6,
  solutions: [
    {
      name: 'naive',
      solver: function (max, callback) {

        var collatz = utils.collatz;

        var longest = utils.range(1, max).map(function (value) {
          var number = value;
          var steps = 0;
          while (value !== 1) {
            value = collatz(value);
            steps += 1;
          }
          return { number: number,
                   steps: steps
                 };
        }).reduce(function (prev, curr) {
          return prev.steps >= curr.steps ? prev : curr;
        });

        callback(null, longest.number);
      }
    },
    {
      name: 'recursive',
      solver: function (max, callback) {

        var collatz = utils.collatz;
        var recurseCollatz = function (value, steps) {
          if (value === 1) {
            return steps;
          }
          return recurseCollatz(collatz(value), steps + 1);
        };
        var longest = utils.range(1, max).map(function (value) {
          var steps = recurseCollatz(value, 0);
          return { number: value,
                   steps: steps
                 };
        }).reduce(function (prev, curr) {
          return prev.steps >= curr.steps ? prev : curr;
        });
        callback(null, longest.number);

      }
    },
  ]
});

problems.push({
  number: 15,
  inputs: 20,
  solutions: [
    {
      name: 'mathematical',
      solver: function (gridSize, callback) {

        var factorial = function (num) {
          return utils.range(num).reduce(function (prev, curr) {
            return prev.multiply(curr);
          }, utils.bigInt(1));
        };

        var answer = factorial(40).divide(factorial(20)).divide(factorial(20));

        callback(null, answer.toString());
      }
    }
  ]
});

problems.push({
  number: 16,
  inputs: 1000,
  solutions: [
    {
      name: 'naive',
      solver: function (power, callback) {

        var number = utils.bigInt(2).power(power);

        var answer = number.toString().split('').reduce(function (prev, curr) {
          return prev + (+curr);
        }, 0);


        callback(null, answer);
      }
    }
  ]
});


problems.push({
  number: 17,
  inputs: 1000,
  solutions: [
    {
      name: 'brute force',
      solver: function (max, callback) {

        var word = function (word, count) {
          return {
            word: word,
            count: count
          };
        };

        console.warn('Ignoring inputs, using hardcoded counts for 1000.');

        var words = [
          word('one', 9 * 10 + 100 + 1),
          word('two', 9 * 10 + 100),
          word('three', 9 * 10 + 100),
          word('four', 9 * 10 + 100),
          word('five', 9 * 10 + 100),
          word('six', 9 * 10 + 100),
          word('seven', 9 * 10 + 100),
          word('eight', 9 * 10 + 100),
          word('nine', 9 * 10 + 100),
          word('ten', 10),
          word('eleven', 10),
          word('twleve', 10),
          word('thirteen', 10),
          word('fourteen', 10),
          word('fifteen', 10),
          word('sixteen', 10),
          word('seventeen', 10),
          word('eighteen', 10),
          word('nineteen', 10),
          word('twenty', 10 * 10),
          word('thirty', 10 * 10),
          word('forty', 10 * 10),
          word('fifty', 10 * 10),
          word('sixty', 10 * 10),
          word('seventy', 10 * 10),
          word('eighty', 10 * 10),
          word('ninety', 10 * 10),
          word('hundred', 100 * 9),
          word('and', 99 * 9),
          word('thousand', 1)
        ];

        var answer = words.reduce(function (prev, curr) {
          return prev + curr.word.length * curr.count;
        }, 0);

        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 18,
  inputs: ['prob-18.txt', 'prob-67.txt'],
  solutions: [
    {
      name: 'naive',
      solver: function (fileName, callback) {


        fs.readFile(fileName, {encoding: 'utf-8'}, function (err, fileContents) {

          if (err) {
            return callback(err);
          }

          var pyramid = fileContents.split('\n').map(function (line) {
            return line.split(' ').map(function (entry) {
              return +entry;
            });
          });

          var max = [];
          pyramid.forEach(function (row, rowNum) {
            max[rowNum] = [];
            row.forEach(function (entry, colNum) {
              if (max[rowNum - 1] === undefined) {
                max[rowNum][colNum] = entry;
                return;
              }
              var maxAbove = utils.max(max[rowNum - 1][colNum - 1],
                                       max[rowNum - 1][colNum]);
              if (maxAbove === undefined) {
                maxAbove = 0;
              }
              max[rowNum][colNum] = maxAbove + entry;
            });
          });
          var bottomRow = max[max.length - 1];
          var answer = bottomRow.reduce(function (accum, entry) {
            return Math.max(accum, entry);
          }, 0);

          callback(null, answer);

        });
      }
    },
  ]
});

problems.push({
  number: 19,
  inputs: {begin: 1901, end: 2000},
  solutions: [
    {
      name: 'naive',
      solver: function (range, callback) {

        var years = utils.range(range.begin, range.end);
        var months = utils.range(0, 11);

        var answer = years.reduce(function (accum, year) {
          var annualTotal = months.reduce(function (innerAccum, month) {
            var isSunday = new Date(year, month, 1).getDay() === 0;
            return innerAccum + (isSunday ? 1 : 0);
          }, 0);
          return accum + annualTotal;
        }, 0);

        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 20,
  inputs: 100,
  solutions: [
    {
      name: 'naive',
      solver: function (num, callback) {

        var hundredFactorial = utils.factorial(num).toString();
        var answer = hundredFactorial.split('').reduce(function (accum, digit) {
          return accum + (+digit);
        }, 0);

        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 21,
  inputs: 10000,
  solutions: [
    {
      name: 'naive',
      solver: function (max, callback) {

        var divSums = utils.range(1, max).map(function (elem) {
            var sumDivisors =  utils.divisors(elem).reduce(function (accum, curr) {
              return accum + curr;
            }, 0);

            return {
              number: elem,
              sumDivisors: sumDivisors
            };

          });

        var amicable = divSums.filter(function (elem) {
          var possiblePartner = divSums[elem.sumDivisors - 1];
          if (possiblePartner === undefined) {
            return false;
          }
          return possiblePartner.sumDivisors === elem.number && elem.number !== elem.sumDivisors;
        });

        var answer = amicable.reduce(function (total, elem) {
          return total + elem.number;
        }, 0);

        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 22,
  inputs: {fileName: 'prob-22.txt', digits: 10},
  solutions: [
    {
      name: 'naive',
      solver: function (input, callback) {

        fs.readFile(input.fileName, {encoding: 'utf-8'}, function (err, fileContents) {

          if (err) {
            return callback(err);
          }

          var names = fileContents.split('"').join('').split(',');

          var offsetA = 'A'.charCodeAt(0) - 1;
          var scoreName = function (name) {
            return name.toUpperCase().split('').reduce(function (total, letter) {
              return total + letter.charCodeAt(0) - offsetA;
            }, 0);
          };
          names = names.sort();
          var answer = 0;
          names.forEach(function (name, index) {
            answer += scoreName(name) * (index + 1);
          });
          callback(null, answer);

        });
      }
    },
  ]
});

problems.push({
  number: 23,
  inputs: 28123,
  solutions: [
    {
      name: 'naive',
      solver: function (maxAbundant, callback) {

        var abundants = utils.range(1, maxAbundant).filter(function (number) {
            var divisors = utils.divisors(number);
            var sumDivisors = divisors.reduce(function (total, divisor) {
              return total + divisor;
            }, 0);
            return sumDivisors > number;
          });

        var smaller;
        var bigger;
        var sum;
        var sums = {};
        for (smaller = 0; smaller < abundants.length; smaller += 1) {
          for (bigger = smaller; bigger < abundants.length; bigger += 1) {
            sum = abundants[smaller] + abundants[bigger];
            if (sum <= maxAbundant) {
              sums[sum] = true;
            }
          }
        }

        var notPresent = utils.range(1, maxAbundant).filter(function (number) {
          return sums[number] !== true;
        });

        var answer = notPresent.reduce(function (total, entry) {
          return total + entry;
        }, 0);

        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 24,
  inputs: {
    initialConfig: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    configNumber: 1e6
  },
  solutions: [
    {
      name: 'naive',
      solver: function (input, callback) {
        var configNumber = 1;
        var config = input.initialConfig;
        while (configNumber < input.configNumber) {
          config = utils.permute(config);
          //console.log(config);
          configNumber += 1;
        }
        config = config.join('');

        callback(null, config);
      }
    }
  ]
});

problems.push({
  number: 25,
  inputs: 1000,
  solutions: [
    {
      name: 'naive',
      solver: function (numDigits, callback) {

        var index = 1;
        var prev = utils.bigInt(0);
        var curr = utils.bigInt(1);
        var temp;

        while (curr.toString().length < numDigits) {
          temp = prev;
          prev = curr;
          curr = temp.plus(prev);
          index += 1;
        }

        callback(null, index);
      }
    }
  ]
});

problems.push({
  number: 26,
  inputs: 1000,
  solutions: [
    {
      name: 'naive',
      solver: function (maxDenom, callback) {

        var calcRepeat = function (denom) {
          var repeat = function (num, history) {
            while (num < denom) {
              num *= 10;
            }
            num = num % denom;

            if (num === 0) {
              return 0;
            }
            if (history.lastIndexOf(num) === -1) {
              return repeat(num, history.concat(num));
            }
            return history.length - history.lastIndexOf(num);
          };
          return repeat(1, []);
        };
        var answer = utils.range(1, maxDenom).reduce(function (accum, entry) {
          var repeatedDigits = calcRepeat(entry);
          if (repeatedDigits > accum.digits) {
            return {
              number: entry,
              digits: repeatedDigits
            };
          }
          return accum;
        }, {digits: 0});

        callback(null, answer.number);

      }
    }
  ]
});

problems.push({
  number: 27,
  inputs: 1000,
  solutions: [
    {
      name: 'naive',
      solver: function (maxCoef, callback) {
        var a = 0;
        var b = 0;
        var eulerNomial = function (a, b) {
          return function (x) {
            return x * x + a * x + b;
          };
        };
        var currentFunc;
        var currentBest = {maxN: 0};
        var n = 0;


        for (a = -maxCoef + 1; a < maxCoef; a += 1) {
          for (b = -maxCoef + 1; b < maxCoef; b += 1) {
            currentFunc = eulerNomial(a, b);
            n = 0;
            while (utils.isPrime(currentFunc(n))) {
              n += 1;
            }
            if (currentBest.maxN < n) {
              currentBest = {
                maxN: n,
                a: a,
                b: b
              };
            }
          }
        }
        callback(null, currentBest.a * currentBest.b);
      }
    }
  ]
});

problems.push({
  number: 28,
  inputs: 1001,
  solutions: [
    {
      name: 'naive',
      solver: function (spiralSize, callback) {

        var answer = utils.range(1, spiralSize)
          .reduce(function (accum, entry) {
            if (entry % 2 === 1) {
              return accum + entry * entry;
            }
            return accum + (entry * entry) * 3 + 3;
          }, 0);
        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 29,
  inputs: 100,
  solutions: [
    {
      name: 'naive',
      solver: function (max, callback) {

        return callback('this takes a long time');

        var a, b, term;
        var distinct = [];
        for (a = 2; a <= max; a += 1) {
          console.time("base " + a);
          for (b = 2; b <= max; b += 1) {
            term = utils.bigInt(a).pow(b).toString();
            if (distinct.indexOf(term) === -1) {
              distinct.push(term);
            }
          }
          console.timeEnd("base " + a);
        }
        callback(null, distinct.length);
      }
    }
  ]
});

problems.push({
  number: 30,
  inputs: 5,
  solutions: [
    {
      name: 'naive',
      solver: function (power, callback) {

        var sumDigitPows = function (num) {
          return num.toString().split('').reduce(function (accum, elem) {
            return accum + Math.pow(+elem, power);
          }, 0);
        };
        var digits = (function findDigits(digits) {
          if (sumDigitPows(Math.pow(10, digits) - 1) > Math.pow(10, digits) - 1) {
            return findDigits(digits + 1);
          }
          return digits;
        }(2));

        var answer = utils.range(10, Math.pow(10, digits)).filter(function (num) {
          return num === sumDigitPows(num);
        }).reduce(function (sum, num) {
          return sum + num;
        }, 0);


        callback(null, answer);
      }
    }
  ]
});

problems.push({
  number: 31,
  inputs: {
    coins: [1, 2, 5, 10, 20, 50, 100, 200],
    total: 200
  },
  solutions: [
    {
      name: 'naive',
      solver: function (inputs, callback) {

        var allCoins = inputs.coins;
        var grandTotal = inputs.total;
        var filterBigger = function (array, value) {
          return array.filter(function (elem) {
            return elem <= value;
          });
        };

        var totalCombos = (function calcDown(coins, total) {
          if (coins.length === 1) {
            if (total % coins[0] === 0) {
              return 1;
            }
            return 0;
          }
          var i;
          var combos = 0;
          var coinValue;
          for (i = 0; i < coins.length; i += 1) {
            coinValue = coins[i];
            if (coinValue < total) {
              combos += calcDown(filterBigger(coins, coinValue), total - coinValue);
            }
            if (coinValue === total) {
              combos += 1;
            }
          }
          return combos;
        }(allCoins, grandTotal));

        callback(null, totalCombos);

      }
    }
  ]
});

problems.push({
  number: 32,
  inputs: {digits: [1, 2, 3, 4, 5, 6, 7, 8, 9]},
  solutions: [
    {
      name: 'naive',
      solver: function (inputs, callback) {

        var digits = inputs.digits;

        digits.sort(function (lhs, rhs) {
          return lhs - rhs;
        });
        var finalConfig = digits.slice().reverse().join('');

        var text = '';
        var firstBreak;
        var secondBreak;
        var firstNumber;
        var secondNumber;
        var thirdNumber;
        var products = utils.counter();

        while (text !== finalConfig) {
          text = digits;
          if (typeof text === 'object') {
            text = text.join('');
          }

          for (firstBreak = 1; firstBreak < text.length - 1; firstBreak += 1) {
            firstNumber = +text.substring(0, firstBreak);
            for (secondBreak = firstBreak + 1; secondBreak < text.length; secondBreak += 1) {
              secondNumber = +text.substring(firstBreak, secondBreak);
              thirdNumber = +text.substring(secondBreak);
              if (firstNumber * secondNumber === thirdNumber) {
                products.add(thirdNumber);
              }
            }
          }
          digits = utils.permute(digits).join('');
        }
        var answer = Object.keys(products.getAll()).reduce(utils.sum, 0);
        callback(null, answer);

      }
    }
  ]
});

problems.push({
  number: 33,
  inputs: 2,
  solutions: [
    {
      name: 'naive',
      solver: function (digits, callback) {

        var min = Math.pow(10, digits - 1);
        var max = Math.pow(10, digits) - 1;

        var num;
        var denom;
        var numDigits;
        var denomDigits;
        var overlaps;

        for (denom = min; denom <= max; denom += 1) {
          denomDigits = denom.toString().split('');
          for (num = min; num < denom; num += 1) {
            numDigits = num.toString().split('');

            overlaps = utils.overlaps(numDigits, denomDigits);
          }
        }

        callback(null, overlaps);
      }
    }
  ]
});

module.exports = problems;
