describe('AsyncExpectation', function() {
  beforeEach(function() {
    jasmineUnderTest.Expectation.addAsyncCoreMatchers(
      jasmineUnderTest.asyncMatchers
    );
  });

  describe('Factory', function() {
    it('throws an Error if promises are not available', function() {
      var thenable = { then: function() {} },
        options = { global: {}, actual: thenable };
      function f() {
        jasmineUnderTest.Expectation.asyncFactory(options);
      }
      expect(f).toThrowError(
        'expectAsync is unavailable because the environment does not support promises.'
      );
    });
  });

  describe('#not', function() {
    it('converts a pass to a fail', function() {
      jasmine.getEnv().requirePromises();

      var addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = Promise.resolve(),
        pp = jasmineUnderTest.makePrettyPrinter(),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          util: new jasmineUnderTest.MatchersUtil({ pp: pp }),
          actual: actual,
          addExpectationResult: addExpectationResult
        });

      return expectation.not.toBeResolved().then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(
          false,
          jasmine.objectContaining({
            passed: false,
            message: 'Expected [object Promise] not to be resolved.'
          })
        );
      });
    });

    it('converts a fail to a pass', function() {
      jasmine.getEnv().requirePromises();

      var addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = Promise.reject(),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          util: new jasmineUnderTest.MatchersUtil({ pp: function() {} }),
          actual: actual,
          addExpectationResult: addExpectationResult
        });

      return expectation.not.toBeResolved().then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(
          true,
          jasmine.objectContaining({
            passed: true,
            message: ''
          })
        );
      });
    });
  });

  it('propagates rejections from the comparison function', function() {
    jasmine.getEnv().requirePromises();
    var error = new Error('ExpectationSpec failure');

    var addExpectationResult = jasmine.createSpy('addExpectationResult'),
      actual = dummyPromise(),
      expectation = jasmineUnderTest.Expectation.asyncFactory({
        actual: actual,
        addExpectationResult: addExpectationResult
      });

    spyOn(expectation, 'toBeResolved').and.returnValue(Promise.reject(error));

    return expectation.toBeResolved().then(
      function() {
        fail('Expected a rejection');
      },
      function(e) {
        expect(e).toBe(error);
      }
    );
  });

  describe('#withContext', function() {
    it('prepends the context to the generated failure message', function() {
      jasmine.getEnv().requirePromises();

      var util = {
          buildFailureMessage: function() {
            return 'failure message';
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          actual: Promise.reject('rejected'),
          addExpectationResult: addExpectationResult,
          util: util
        });

      return expectation
        .withContext('Some context')
        .toBeResolved()
        .then(function() {
          expect(addExpectationResult).toHaveBeenCalledWith(
            false,
            jasmine.objectContaining({
              message: 'Some context: failure message'
            })
          );
        });
    });

    it('prepends the context to a custom failure message', function() {
      jasmine.getEnv().requirePromises();

      var util = {
          buildFailureMessage: function() {
            return 'failure message';
          },
          pp: jasmineUnderTest.makePrettyPrinter()
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          actual: Promise.reject('b'),
          addExpectationResult: addExpectationResult,
          util: util
        });

      return expectation
        .withContext('Some context')
        .toBeResolvedTo('a')
        .then(function() {
          expect(addExpectationResult).toHaveBeenCalledWith(
            false,
            jasmine.objectContaining({
              message:
                "Some context: Expected a promise to be resolved to 'a' but it was rejected."
            })
          );
        });
    });

    it('prepends the context to a custom failure message from a function', function() {
      pending('should actually work, but no custom matchers for async yet');
      jasmine.getEnv().requirePromises();

      var util = {
          buildFailureMessage: function() {
            return 'failure message';
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = Promise.reject(),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          actual: actual,
          addExpectationResult: addExpectationResult,
          util: util
        });

      return expectation
        .withContext('Some context')
        .toBeResolved()
        .then(function() {
          expect(addExpectationResult).toHaveBeenCalledWith(
            false,
            jasmine.objectContaining({
              message: 'Some context: msg'
            })
          );
        });
    });

    it('works with #not', function() {
      jasmine.getEnv().requirePromises();

      var addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = Promise.resolve(),
        pp = jasmineUnderTest.makePrettyPrinter(),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          actual: actual,
          addExpectationResult: addExpectationResult,
          util: new jasmineUnderTest.MatchersUtil({ pp: pp })
        });

      return expectation
        .withContext('Some context')
        .not.toBeResolved()
        .then(function() {
          expect(addExpectationResult).toHaveBeenCalledWith(
            false,
            jasmine.objectContaining({
              message:
                'Some context: Expected [object Promise] not to be resolved.'
            })
          );
        });
    });

    it('works with #not and a custom message', function() {
      jasmine.getEnv().requirePromises();

      var addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = Promise.resolve('a'),
        expectation = jasmineUnderTest.Expectation.asyncFactory({
          actual: actual,
          addExpectationResult: addExpectationResult,
          util: new jasmineUnderTest.MatchersUtil({
            pp: jasmineUnderTest.makePrettyPrinter()
          })
        });

      return expectation
        .withContext('Some context')
        .not.toBeResolvedTo('a')
        .then(function() {
          expect(addExpectationResult).toHaveBeenCalledWith(
            false,
            jasmine.objectContaining({
              message:
                "Some context: Expected a promise not to be resolved to 'a'."
            })
          );
        });
    });
  });

  describe('async matchers', function() {
    it('makes custom matchers available to this expectation', function() {
      jasmine.getEnv().requirePromises();

      var asyncMatchers = {
          toFoo: function() {},
          toBar: function() {}
        },
        expectation;

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: asyncMatchers
      });

      expect(expectation.toFoo).toBeDefined();
      expect(expectation.toBar).toBeDefined();
    });

    it("wraps matchers's compare functions, passing in matcher dependencies", function() {
      jasmine.getEnv().requirePromises();

      var fakeCompare = function() {
          return Promise.resolve({ pass: true });
        },
        matcherFactory = jasmine
          .createSpy('matcher')
          .and.returnValue({ compare: fakeCompare }),
        matchers = {
          toFoo: matcherFactory
        },
        util = {
          buildFailureMessage: jasmine.createSpy('buildFailureMessage')
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        expectation;

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        util: util,
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(matcherFactory).toHaveBeenCalledWith(util);
      });
    });

    it("wraps matchers's compare functions, passing the actual and expected", function() {
      jasmine.getEnv().requirePromises();

      var fakeCompare = jasmine
          .createSpy('fake-compare')
          .and.returnValue(Promise.resolve({ pass: true })),
        matchers = {
          toFoo: function() {
            return {
              compare: fakeCompare
            };
          }
        },
        util = {
          buildFailureMessage: jasmine.createSpy('buildFailureMessage')
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        expectation;

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        util: util,
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(fakeCompare).toHaveBeenCalledWith('an actual', 'hello');
      });
    });

    it('reports a passing result to the spec when the comparison passes', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({ pass: true });
              }
            };
          }
        },
        util = {
          buildFailureMessage: jasmine.createSpy('buildFailureMessage')
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        util: util,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(true, {
          matcherName: 'toFoo',
          passed: true,
          message: '',
          error: undefined,
          expected: 'hello',
          actual: 'an actual',
          errorForStack: errorWithStack
        });
      });
    });

    it('reports a failing result to the spec when the comparison fails', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({ pass: false });
              }
            };
          }
        },
        util = {
          buildFailureMessage: function() {
            return '';
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        util: util,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: 'an actual',
          message: '',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it('reports a failing result and a custom fail message to the spec when the comparison fails', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({
                  pass: false,
                  message: 'I am a custom message'
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        actual: 'an actual',
        customAsyncMatchers: matchers,
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: 'an actual',
          message: 'I am a custom message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it('reports a failing result with a custom fail message function to the spec when the comparison fails', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({
                  pass: false,
                  message: function() {
                    return 'I am a custom message';
                  }
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: 'an actual',
          message: 'I am a custom message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it('reports a passing result to the spec when the comparison fails for a negative expectation', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({ pass: false });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = 'an actual',
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(true, {
          matcherName: 'toFoo',
          passed: true,
          message: '',
          error: undefined,
          expected: 'hello',
          actual: actual,
          errorForStack: errorWithStack
        });
      });
    });

    it('reports a failing result to the spec when the comparison passes for a negative expectation', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({ pass: true });
              }
            };
          }
        },
        util = {
          buildFailureMessage: function() {
            return 'default message';
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = 'an actual',
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        actual: 'an actual',
        util: util,
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: actual,
          message: 'default message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it('reports a failing result and a custom fail message to the spec when the comparison passes for a negative expectation', function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({
                  pass: true,
                  message: 'I am a custom message'
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = 'an actual',
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: actual,
          message: 'I am a custom message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it("reports a passing result to the spec when the 'not' comparison passes, given a negativeCompare", function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({ pass: true });
              },
              negativeCompare: function() {
                return Promise.resolve({ pass: true });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = 'an actual',
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(true, {
          matcherName: 'toFoo',
          passed: true,
          expected: 'hello',
          actual: actual,
          message: '',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it("reports a failing result and a custom fail message to the spec when the 'not' comparison fails, given a negativeCompare", function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({ pass: true });
              },
              negativeCompare: function() {
                return Promise.resolve({
                  pass: false,
                  message: "I'm a custom message"
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        actual = 'an actual',
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        customAsyncMatchers: matchers,
        actual: 'an actual',
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: actual,
          message: "I'm a custom message",
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it('reports errorWithStack when a custom error message is returned', function() {
      jasmine.getEnv().requirePromises();

      var customError = new Error('I am a custom error');
      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({
                  pass: false,
                  message: 'I am a custom message',
                  error: customError
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        actual: 'an actual',
        customAsyncMatchers: matchers,
        addExpectationResult: addExpectationResult
      });

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: 'an actual',
          message: 'I am a custom message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it("reports a custom message to the spec when a 'not' comparison fails", function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({
                  pass: true,
                  message: 'I am a custom message'
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        actual: 'an actual',
        customAsyncMatchers: matchers,
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: 'an actual',
          message: 'I am a custom message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });

    it("reports a custom message func to the spec when a 'not' comparison fails", function() {
      jasmine.getEnv().requirePromises();

      var matchers = {
          toFoo: function() {
            return {
              compare: function() {
                return Promise.resolve({
                  pass: true,
                  message: function() {
                    return 'I am a custom message';
                  }
                });
              }
            };
          }
        },
        addExpectationResult = jasmine.createSpy('addExpectationResult'),
        errorWithStack = new Error('errorWithStack'),
        expectation;

      spyOn(jasmineUnderTest.util, 'errorWithStack').and.returnValue(
        errorWithStack
      );

      expectation = jasmineUnderTest.Expectation.asyncFactory({
        actual: 'an actual',
        customAsyncMatchers: matchers,
        addExpectationResult: addExpectationResult
      }).not;

      return expectation.toFoo('hello').then(function() {
        expect(addExpectationResult).toHaveBeenCalledWith(false, {
          matcherName: 'toFoo',
          passed: false,
          expected: 'hello',
          actual: 'an actual',
          message: 'I am a custom message',
          error: undefined,
          errorForStack: errorWithStack
        });
      });
    });
  });

  function dummyPromise() {
    return new Promise(function(resolve, reject) {});
  }
});
