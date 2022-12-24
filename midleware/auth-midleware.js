const tokenService = require('../service/Token');
const userDB = require('../dto/user');

module.exports = async function (req, res, next) {
    try {
        let {authorization} = req.headers;
        const { userId } = req.body;
        authorization = authorization.split(' ')[1];
        let isUser = await tokenService.validateAccessToken(authorization);
        console.log(authorization);
        if(!isUser){
            throw Error();
        }
        let user = await userDB.getUserById(userId);

        next(user);
    } catch(e) {
        res.status(401).json({
            error: {}
        });
    }
}