getJasmineRequireObj().MismatchTree = function (j$) {

  function MismatchTree(path) {
    this.path = path || new j$.ObjectPath([]);
    this.formatter = undefined;
    this.children = [];
    this.isMismatch = false;
  }

  MismatchTree.prototype.add = function (path, formatter) {
    var key, child;

    if (path.depth() === 0) {
      this.formatter = formatter;
      this.isMismatch = true;
    } else {
      key = path.components[0];
      path = path.shift();
      child = this.child(key);

      if (!child) {
        child = new MismatchTree(this.path.add(key));
        this.children.push(child);
      }

      child.add(path, formatter);
    }
  };

  MismatchTree.prototype.traverse = function (visit) {
    var hasChildren = Object.keys(this.children).length > 0;

    if (this.isMismatch || hasChildren) {
      if (visit(this.path, !hasChildren, this.formatter)) {
        Object.values(this.children).forEach(function (child) {
          child.traverse(visit);
        });
      }
    }
  };

  MismatchTree.prototype.child = function(key) {
    var i, pathEls;

    for (i = 0; i < this.children.length; i++) {
      pathEls = this.children[i].path.components;
      if (pathEls[pathEls.length - 1] === key) {
        return this.children[i];
      }
    }
  };

  return MismatchTree;
};

