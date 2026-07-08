class TreeMapNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class TreeMap {
  constructor() {
    this.root = null;
  }

  // insert a key-value pair
  insert(key, value) {
    this.root = this._insert(this.root, key, value);
  }

  _insert(node, key, value) {
    if (!node) return new TreeMapNode(key, value);

    if (key < node.key) {
      node.left = this._insert(node.left, key, value);
    } else if (key > node.key) {
      node.right = this._insert(node.right, key, value);
    } else {
      // same key — store as array to handle videos with same view count
      if (!Array.isArray(node.value)) {
        node.value = [node.value];
      }
      node.value.push(value);
    }

    return node;
  }

  // get all values in DESCENDING order (highest views first)
  getDescending() {
    const result = [];
    this._reverseInOrder(this.root, result);
    return result.flat();
  }

  _reverseInOrder(node, result) {
    if (!node) return;
    this._reverseInOrder(node.right, result);
    result.push(node.value);
    this._reverseInOrder(node.left, result);
  }
}

export { TreeMap };