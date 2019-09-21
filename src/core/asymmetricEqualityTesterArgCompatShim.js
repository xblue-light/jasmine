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

    copy(self, customEqualityTesters, 'length');

    for (i = 0; i < customEqualityTesters.length; i++) {
      copy(self, customEqualityTesters, i);
    }

    var props = arrayProps();

    for (i = 0; i < props.length; i++) {
      k = props[i];
      if (k !== 'length') {
        copy(self, Array.prototype, k);
      }
    }

    return self;
  }

  function copy(dest, src, propName) {
    Object.defineProperty(dest, propName, {
      get: function() {
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
