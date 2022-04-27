const formatLambdaResponse = ({ statusCode, data, route = null }) => ({
  statusCode,
  body: JSON.stringify({
    route,
    data,
  }),
});

/**
 * Some basic routes do not require specific actions,
 * so we can define a generic behaviour for each of them.
 * This concerns: $connect and $default. You can find them in src/network/requiredWebsockets.js
 * @param route
 * @returns {function(*=): {body: string, statusCode: *}}
 */

export const placeHolderLambdaBuilder = (route) => async (event) => {
  console.log(`${route}: \n${JSON.stringify(event, null, 2)}`);
  return formatLambdaResponse({ statusCode: 200, data: 'OK', route });
};
