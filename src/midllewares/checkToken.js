import { AuthorizationError } from '../utils/errors.js'
import JWT from '../utils/jwt.js'

export default async (req, res, next) => {
    try {
        let token = req.headers.token
        
        if (!token) {
            throw new AuthorizationError(403,"Sizga ruxsat yo'q")
        }

        const { userId } = JWT.verify(token)

        const user = await req.models.User.findOne({ where: { userId } })

        if (!user) {
            throw new AuthorizationError("invalid token")
        }

        req.userId = userId
        next()
    } catch (error) {
        next(error)
    }
}