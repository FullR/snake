const controls = {
  up(keyCode) {
    return keyCode === 38 || keyCode === 87;
  },

  down(keyCode) {
    return keyCode === 40 || keyCode === 83;
  },

  left(keyCode) {
    return keyCode === 37 || keyCode === 65
  },

  right(keyCode) {
    return keyCode === 39 || keyCode === 68
  }
};

export default controls;
