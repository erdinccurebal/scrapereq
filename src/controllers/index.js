export function controllerIndex(_req, res, next) {
    try {
        res.send();
    } catch (error) {
        error.message = `${error.message} - Code: ERROR_INDEX_CONTROLLER`;
        next(next);
    };
};