import { Response, Request } from "express";
import User, { IUser } from "../models/User";

const postData = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const user: IUser = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
}

const getAllData = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

const getTotalAmount = async (userId: number) => {
    const currentDate = new Date();
    const startOfLastYear = new Date(currentDate.getFullYear() - 1, 0, 1);
    const realUser = await User.findOne({ user_id: userId });
    const result = await User.aggregate([
        {
            $match: {
                user_id: userId,
                date: { $gte: startOfLastYear }
            }
        },
        {
            $group: {
                _id: "$user_id",
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);
    return { realUser, result };
}

const getStatus = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.user_id);
        const { realUser, result } = await getTotalAmount(userId);

        if (!realUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Please add transactions." });
        }

        const totalAmount = result[0].totalAmount;
        let status = "regular";

        if (totalAmount >= 30000) {
            status = "gold";
        } else if (totalAmount >= 20000 && totalAmount < 30000) {
            status = "silver";
        } else if (totalAmount < 20000) {
            status = "bronze";
        }

        res.json({ user_id: userId, status, totalAmount });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

const forNextStatus = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.user_id);
        const { realUser, result } = await getTotalAmount(userId);
        const totalAmount = result[0].totalAmount;
        let forNext = 0;
        if (totalAmount < 20000) {  forNext = 20000 - totalAmount; res.json({user_id: userId, currentState: "bronze", upState : "silver", forNext: forNext}) ;}
        else if( totalAmount > 20000 && totalAmount < 30000) { forNext = 30000 - totalAmount; res.json({user_id: userId, currentState: "silver", upState : "gold", forNext: forNext}); }
        else (res.json({user_id: userId, currentState: "gold", upState : "you are rich"}))
    } catch (error) {
        console.log("error is :", error);
    }
}

export { postData, getAllData, getStatus, forNextStatus };