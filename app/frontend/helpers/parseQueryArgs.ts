const parseQueryArgs = (str: string) =>
  str
    ? str
      .replace(/\?/g, '')
      .split('&')
      .reduce((acc, arg) => {
        if (arg.includes('=')) {
          const tokens = arg.split('=')
          acc[tokens[0]] = tokens[1]
        } else {
          acc[arg] = true
        }
        return acc
      }, {})
    : {}

export default parseQueryArgs
