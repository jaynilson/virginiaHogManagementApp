import express, { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { postData, getAllData, getStatus, forNextStatus } from "../controller/controller";

const router = express.Router();

router.post('/post', postData);

router.get('/get', getAllData);

router.get('/:user_id/status', getStatus);

router.get('/:user_id/forNextStatus', forNextStatus);


export default router;