import UserList from "../models/users.models.js";

export const addUser = async (req, res) => {
    const user = req.body;

    if (
        typeof user.userId !== 'string' || 
        typeof user.userName !== 'string' ||
        typeof user.email !== 'string' ||
        typeof user.Password !== 'string'
    ) {
        return res.status(400).json({ 
            success: false, 
            message: "Please provide valid fields to create a user" 
        });
    }

    try {
        // Check if email already exists
        const existingUser = await UserList.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is already registered" 
            });
        }

        const newUser = new UserList(user);
        await newUser.save();
        res.status(200).json({ success: true, message: `User created successfully with email: ${user.email}` });

    } catch (error) {
        console.error("Error in creating user:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, Password } = req.body;

    try {
        const userLogin = await UserList.findOne({ email });

        if (userLogin) {
                // Check if the password matches
                if (Password === userLogin.Password) {
                    // Return the user details if password is correct
                    return res.status(200).json({
                        success: true,
                        message: "User found and authenticated",
                        userId: userLogin.userId,
                        email: userLogin.email,
                        userName: userLogin.userName,
                    });
                } else {
                    // Password is incorrect
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials"
                    });
                }
         }else {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
    } catch (error) {
        console.error("Error in fetching user:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};
