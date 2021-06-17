class BootstrapFactory {
  static bootstrappers = [];
  static Register(bootstrapper) {
    this.bootstrappers.push(bootstrapper);
  }
  static async Run(){
    return await Promise.all(this.bootstrappers.map(bootstrapper => bootstrapper.Run()));
  }
}

module.exports = BootstrapFactory;
