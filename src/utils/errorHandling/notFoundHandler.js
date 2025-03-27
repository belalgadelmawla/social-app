const notFoundHandler = (req, res,next) => {
    return next(new Error("route not found", {cause: 400}))
}

export default notFoundHandler