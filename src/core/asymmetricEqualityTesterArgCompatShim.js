getJasmineRequireObj().asymmetricEqualityTesterArgCompatShim = function(j$) {
  var likelyArrayProps = [
    'concat',
    'constructor',
    'copyWithin',
    'entries',
    'every',
    'fill',
    'filter',
    'find',
    'findIndex',
    'flat',
    'flatMap',
    'forEach',
    'includes',
    'indexOf',
    'join',
    'keys',
    'lastIndexOf',
    'length',
    'map',
    'pop',
    'push',
    'reduce',
    'reduceRight',
    'reverse',
    'shift',
    'slice',
    'some',
    'sort',
    'splice',
    'toLocaleString',
    'toSource',
    'toString',
    'unshift',
    'values'
  ];

  function asymmetricEqualityTesterArgCompatShim(
    matchersUtil,
    customEqualityTesters
  ) {
    var self = Object.create(matchersUtil),
      props,
      i,
      k;

    copyAndDeprecate(self, customEqualityTesters, 'length');

    for (i = 0; i < customEqualityTesters.length; i++) {
      copyAndDeprecate(self, customEqualityTesters, i);
    }

    var props = arrayProps();

    for (i = 0; i < props.length; i++) {
      k = props[i];
      if (k !== 'length') {
        copyAndDeprecate(self, Array.prototype, k);
      }
    }

    return self;
  }

  function copyAndDeprecate(dest, src, propName) {
    Object.defineProperty(dest, propName, {
      get: function() {
        j$.getEnv().deprecated(
          'The second argument to asymmetricMatch is now a ' +
            'MatchersUtil. Using it as an array of custom equality testers is ' +
            'deprecated and will stop working in a future release. ' +
            'See <https://jasmine.github.io/tutorials/upgrading_to_3.6> for details.'
        );
        return src[propName];
      }
    });
  }

  function arrayProps() {
    var props, a, k;

    if (!Object.getOwnPropertyDescriptors) {
      return likelyArrayProps.filter(function(k) {
        return Array.prototype.hasOwnProperty(k);
      });
    }

    props = Object.getOwnPropertyDescriptors(Array.prototype);
    a = [];

    for (k in props) {
      a.push(k);
    }

    return a;
  }

  return asymmetricEqualityTesterArgCompatShim;
};
