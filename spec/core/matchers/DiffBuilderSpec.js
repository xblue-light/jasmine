describe("DiffBuilder", function () {
  it("records the actual and expected objects", function () {
    var diffBuilder = jasmineUnderTest.DiffBuilder();
    diffBuilder.setRoots({x: 'actual'}, {x: 'expected'});
    diffBuilder.recordMismatch();

    expect(diffBuilder.getMessage()).toEqual("Expected Object({ x: 'actual' }) to equal Object({ x: 'expected' }).");
  });

  it("prints the path at which the difference was found", function () {
    var diffBuilder = jasmineUnderTest.DiffBuilder();
    diffBuilder.setRoots({foo: {x: 'actual'}}, {foo: {x: 'expected'}});

    diffBuilder.withPath('foo', function () {
      diffBuilder.recordMismatch();
    });

    expect(diffBuilder.getMessage()).toEqual("Expected $.foo = Object({ x: 'actual' }) to equal Object({ x: 'expected' }).");
  });

  it("prints multiple messages, separated by newlines", function () {
    var diffBuilder = jasmineUnderTest.DiffBuilder();
    diffBuilder.setRoots({foo: 1, bar: 3}, {foo: 2, bar: 4});

    diffBuilder.withPath('foo', function () {
      diffBuilder.recordMismatch();
    });
    diffBuilder.withPath('bar', function () {
      diffBuilder.recordMismatch();
    });

    var message =
      "Expected $.foo = 1 to equal 2.\n" +
      "Expected $.bar = 3 to equal 4.";

    expect(diffBuilder.getMessage()).toEqual(message);
  });

  it("allows customization of the message", function () {
    var diffBuilder = jasmineUnderTest.DiffBuilder();
    diffBuilder.setRoots({x: 'bar'}, {x: 'foo'});

    function darthVaderFormatter(actual, expected, path) {
      return "I find your lack of " + expected + " disturbing. (was " + actual + ", at " + path + ")"
    }

    diffBuilder.withPath('x', function () {
      diffBuilder.recordMismatch(darthVaderFormatter);
    });

    expect(diffBuilder.getMessage()).toEqual("I find your lack of foo disturbing. (was bar, at $.x)");
  });

  it("uses the injected pretty-printer", function () {
    var prettyPrinter = function (val) {
        return '|' + val + '|';
      },
      diffBuilder = jasmineUnderTest.DiffBuilder({prettyPrinter: prettyPrinter});
    prettyPrinter.customFormat_ = function () {
    };

    diffBuilder.setRoots({foo: 'actual'}, {foo: 'expected'});
    diffBuilder.withPath('foo', function () {
      diffBuilder.recordMismatch();
    });

    expect(diffBuilder.getMessage()).toEqual("Expected $.foo = |actual| to equal |expected|.");
  });

  it("passes the injected pretty-printer to the diff formatter", function () {
    var diffFormatter = jasmine.createSpy('diffFormatter'),
      prettyPrinter = function () {
      },
      diffBuilder = jasmineUnderTest.DiffBuilder({prettyPrinter: prettyPrinter});
    prettyPrinter.customFormat_ = function () {
    };

    diffBuilder.setRoots({x: 'bar'}, {x: 'foo'});
    diffBuilder.withPath('x', function () {
      diffBuilder.recordMismatch(diffFormatter);
    });

    diffBuilder.getMessage();

    expect(diffFormatter).toHaveBeenCalledWith('bar', 'foo', jasmine.anything(), prettyPrinter);
  });

  it("uses custom object formatters", function () {
    var formatter = function (x) {
      if (x.hasOwnProperty('a')) {
        return '[thing with a=' + x.a + ', b=' + JSON.stringify(x.b) + ']';
      }
    };
    prettyPrinter = jasmineUnderTest.makePrettyPrinter([formatter]);
    var diffBuilder = new jasmineUnderTest.DiffBuilder({prettyPrinter: prettyPrinter});
    var expectedMsg = 'Expected $[0].foo = [thing with a=1, b={"x":42}] to equal [thing with a=1, b={"x":43}].\n' +
      "Expected $[0].bar = 'yes' to equal 'no'.";

    diffBuilder.setRoots(
      [{foo: {a: 1, b: {x: 42}}, bar: 'yes'}],
      [{foo: {a: 1, b: {x: 43}}, bar: 'no'}]
    );

    diffBuilder.withPath(0, function () {
      diffBuilder.withPath('foo', function () {
        diffBuilder.withPath('b', function () {
          diffBuilder.withPath('x', function () {
            diffBuilder.recordMismatch();
          });
        });
      });

      diffBuilder.withPath('bar', function () {
        diffBuilder.recordMismatch();
      });
    });

    expect(diffBuilder.getMessage()).toEqual(expectedMsg);
  });
});
