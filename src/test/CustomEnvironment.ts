import NodeEnvironment from "jest-environment-node"

export default class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()
    // mock navigator.language
    this.global.navigator = {
      language: "en",
    } as Navigator
  }
}
