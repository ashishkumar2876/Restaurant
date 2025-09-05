import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        // If there's no token, respond with an authentication error
        if (!token) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return; // exit here, do not continue to next() since a response has been sent
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

        // If the token is invalid, respond with an error
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return; // exit here, do not continue to next() since a response has been sent
        }

        // Attach the user ID to the request object for further use
        req.id = decoded.userId;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        // In case of an error, respond with a 500 internal server error
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
