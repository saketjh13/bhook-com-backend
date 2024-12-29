import { Request, Response } from "express";
import User from "../models/user";


const getCurrentUser = async (req: Request, res: Response):Promise<any> => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      res.status(200).send(); // Send success response
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject()); // Respond with the new user object
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error creating user" }); // Respond with error
  }
};

const updateCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      console.log("User Not Found")
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  createCurrentUser, 
  updateCurrentUser,
  getCurrentUser
};
