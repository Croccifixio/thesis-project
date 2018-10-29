const symmetricalParams = [
  'outerGapHorizontal',
  'innerGapHorizontal',
  'capWidth',
  'cellWidth',
]

/**
 * Halves the parameter if it crosses the axis of symmetry
 */
const handleSymmetricalParams = (paramName, params) =>
  symmetricalParams.includes(paramName)
    ? params[paramName] / 2
    : params[paramName]

/**
 * Negates the parameter if the name starts with a hyphen
 */
const handleNegativeParams = (paramName, params) =>
  paramName.startsWith('-')
    ? params[paramName.replace('-', '')] * -1
    : params[paramName]

/**
 * Modifies the parameters as necessary
 */
const handleParams = (paramName, params) =>
  handleSymmetricalParams(paramName, {
    ...params,
    [paramName]: handleNegativeParams(paramName, params),
  })

/**
 * Calculates the maximum value that a parameter can have
 */
export const getConstraint = (paramConstraint, currentParams) =>
  paramConstraint.max.reduce((acc, cur) =>
    acc + handleParams(cur, currentParams), 0)
