// eslint-disable-next-line no-unused-vars
var getJasmineRequireObj = (function(jasmineGlobal) {
  var jasmineRequire;

  if (
    typeof module !== 'undefined' &&
    module.exports &&
    typeof exports !== 'undefined'
  ) {
    if (typeof global !== 'undefined') {
      jasmineGlobal = global;
    } else {
      jasmineGlobal = {};
    }
    jasmineRequire = exports;
  } else {
    if (
      typeof window !== 'undefined' &&
      typeof window.toString === 'function' &&
      window.toString() === '[object GjsGlobal]'
    ) {
      jasmineGlobal = window;
    }
    jasmineRequire = jasmineGlobal.jasmineRequire = {};
  }

  function getJasmineRequire() {
    return jasmineRequire;
  }

  getJasmineRequire().core = function(jRequire) {
    var j$ = {};

    jRequire.base(j$, jasmineGlobal);
    j$.util = jRequire.util(j$);
    j$.errors = jRequire.errors();
    j$.formatErrorMsg = jRequire.formatErrorMsg();
    j$.Any = jRequire.Any(j$);
    j$.Anything = jRequire.Anything(j$);
    j$.CallTracker = jRequire.CallTracker(j$);
    j$.MockDate = jRequire.MockDate();
    j$.getClearStack = jRequire.clearStack(j$);
    j$.Clock = jRequire.Clock();
    j$.DelayedFunctionScheduler = jRequire.DelayedFunctionScheduler(j$);
    j$.Env = jRequire.Env(j$);
    j$.StackTrace = jRequire.StackTrace(j$);
    j$.ExceptionFormatter = jRequire.ExceptionFormatter(j$);
    j$.ExpectationFilterChain = jRequire.ExpectationFilterChain();
    j$.Expector = jRequire.Expector(j$);
    j$.Expectation = jRequire.Expectation(j$);
    j$.buildExpectationResult = jRequire.buildExpectationResult();
    j$.noopTimer = jRequire.noopTimer();
    j$.JsApiReporter = jRequire.JsApiReporter(j$);
    j$.asymmetricEqualityTesterArgCompatShim = jRequire.asymmetricEqualityTesterArgCompatShim(
      j$
    );
    j$.makePrettyPrinter = jRequire.makePrettyPrinter(j$);
    j$.basicPrettyPrinter_ = j$.makePrettyPrinter();
    Object.defineProperty(j$, 'pp', {
      get: function() {
        j$.getEnv().deprecated(
          'jasmine.pp is deprecated and will be removed in a future release. ' +
            'Use the pp method of the matchersUtil passed to the matcher factory ' +
            "or the asymmetric equality tester's `asymmetricMatch` method " +
            'instead. See ' +
            '<https://jasmine.github.io/tutorials/upgrading_to_3.6> for details.'
        );
        return j$.basicPrettyPrinter_;
      }
    });
    j$.MatchersUtil = jRequire.MatchersUtil(j$);
    var staticMatchersUtil = new j$.MatchersUtil({
      customTesters: [],
      pp: j$.basicPrettyPrinter_
    });
    Object.defineProperty(j$, 'matchersUtil', {
      get: function() {
        j$.getEnv().deprecated(
          'jasmine.matchersUtil is deprecated and will be removed ' +
            'in a future release. Use the instance passed to the matcher factory or ' +
            "the asymmetric equality tester's `asymmetricMatch` method instead. " +
            'See <https://jasmine.github.io/tutorials/upgrading_to_3.6> for details.'
        );
        return staticMatchersUtil;
      }
    });

    j$.ObjectContaining = jRequire.ObjectContaining(j$);
    j$.ArrayContaining = jRequire.ArrayContaining(j$);
    j$.ArrayWithExactContents = jRequire.ArrayWithExactContents(j$);
    j$.MapContaining = jRequire.MapContaining(j$);
    j$.SetContaining = jRequire.SetContaining(j$);
    j$.QueueRunner = jRequire.QueueRunner(j$);
    j$.ReportDispatcher = jRequire.ReportDispatcher(j$);
    j$.Spec = jRequire.Spec(j$);
    j$.Spy = jRequire.Spy(j$);
    j$.SpyFactory = jRequire.SpyFactory(j$);
    j$.SpyRegistry = jRequire.SpyRegistry(j$);
    j$.SpyStrategy = jRequire.SpyStrategy(j$);
    j$.StringMatching = jRequire.StringMatching(j$);
    j$.UserContext = jRequire.UserContext(j$);
    j$.Suite = jRequire.Suite(j$);
    j$.Timer = jRequire.Timer();
    j$.TreeProcessor = jRequire.TreeProcessor();
    j$.version = jRequire.version();
    j$.Order = jRequire.Order();
    j$.DiffBuilder = jRequire.DiffBuilder(j$);
    j$.NullDiffBuilder = jRequire.NullDiffBuilder(j$);
    j$.ObjectPath = jRequire.ObjectPath(j$);
    j$.MismatchTree = jRequire.MismatchTree(j$);
    j$.GlobalErrors = jRequire.GlobalErrors(j$);

    j$.Truthy = jRequire.Truthy(j$);
    j$.Falsy = jRequire.Falsy(j$);
    j$.Empty = jRequire.Empty(j$);
    j$.NotEmpty = jRequire.NotEmpty(j$);

    j$.matchers = jRequire.requireMatchers(jRequire, j$);
    j$.asyncMatchers = jRequire.requireAsyncMatchers(jRequire, j$);

    return j$;
  };

  return getJasmineRequire;
})(this);
