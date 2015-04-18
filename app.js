var fs = require('fs');
var util = require('util');

var async = require('async');

var problems = require('./problems');

var solutions = {};

var runSolvers = function (problems) {
  async.forEach(problems, function (problem, problemsCb) {

    solutions[problem.number] = {};

    if (!Array.isArray(problem.inputs)) {
      problem.inputs = [problem.inputs];
    }

    async.forEach(problem.inputs, function (input, inputsCb) {

      var inputName = JSON.stringify(input);

      solutions[problem.number][inputName] = {};

      async.forEach(problem.solutions, function (solution, solutionsCb) {

        var start = process.hrtime();
        solution.solver(input, function (err, answer) {

          var end = process.hrtime(start);

          var results = {
            problem: problem.number,
            input: input,
            solver: solution.name,
            time: ((end[0] * 1e9 +  end[1]) / 1e6) + 'ms',
            answer: err || answer
          };
          solutions[problem.number][inputName][solution.name] = results;
          //console.log(results);
          solutionsCb();

        });

      }, function (err) {
        inputsCb();
      });
    }, function (err) {
      console.log('finished problem ', problem.number);
      problemsCb();
    });
  }, function (err) {
    fs.writeFile('solutions.json', JSON.stringify(solutions, null, 2), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('success');
    });
  });
};

runSolvers(problems);
