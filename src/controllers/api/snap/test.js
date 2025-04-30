export function controllerApiSnapTest(req, res, next) {
  try {
    res.send()
  } catch (error) {
    next(error);
  };
};