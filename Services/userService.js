const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {ObjectId} = require("mongodb");

const {UsersModel} = require('../Model/users');
const {sendEmail} = require("./twoFactorAuth");
const users = new UsersModel();

class UserService {
    async listAllUsers() {
        try {
            return await users.getAllUsers();
        } catch (e) {
            return null;
        }
    }

    async getUserById(id) {
        try {
            let user = await users.getUser({_id: ObjectId(id)});
            if (!user) {
                return null;
            } else {
                return user;
            }
        } catch (e) {
            return null;
        }
    }

    async addUser(username, password, firstname, lastname, age, gender, address, phone) {
        try {
            //check if username exist before
            let user = await users.getUser({username: username});
            if (!user) {
                //encrypt password
                let hashed_password = await bcrypt.hash(password, 10);

                //insert user
                return await users.addUser({
                    username, password: hashed_password, firstname, lastname, age,
                    gender, address, phone, isActive: true, isAdmin: false
                });
            } else {
                return "the username already exists use another one!"
            }
        } catch (e) {
            return null
        }
    }

    async login(username, password) {
        try {
            let user = await users.getUser({username: username});
            if (!user) {
                return {statues: false, message: "user not found"};
            } else {
                if (!await bcrypt.compare(password, user.password)) {
                    return {statues: false, message: "password wrong"};
                } else if (!user.isActive) {
                    return {statues: false, message: "user not active"};
                } else {
                    const token = await sendEmail(username, password);
                    return {
                        statues: true,
                        message: "check your gmail and enter the 2fa code",
                        tokenFor2AuthCode: token,
                    };
                }
            }
        } catch (e) {
            return null;
        }
    }

    async verify(token, userEnteredCode) {
        try {
            const decoded = jwt.verify(token, 'authzzzz');
            const {email, password, code} = decoded;

            // Check if the code is valid and hasn't expired
            if (userEnteredCode.code === code) {
                let time = new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.');
                await users.saveLoginLogs({username: email, password:password, date:time});
                let user = await users.getUser({username: email});
                let loginToken = jwt.sign({username: user.username, id: user._id, isAdmin: user.isAdmin}
                    , 'shhhhh');
                console.log('Code is valid and matches the email.');
                return {
                    message: "Code is valid and matches the email.",
                    loginToken: loginToken,
                    username: user.username,
                    userId: user._id,
                }
            } else {
                console.log('Code is invalid or has expired.');
                return 'Code is invalid or has expired.'
            }
        } catch (error) {
            console.log('Error: Invalid or expired token.');
            return null;
        }
    }

    async resendCode(username) {
        const token = await sendEmail(username.username);
        return {
            statues: true,
            message: "check your gmail and enter the 2fa code",
            tokenFor2AuthCode: token,
        };
    }

    async forgetPassword(username, newPassword) {
        try {
            let user = await users.getUser({username: username});
            if (!user) {
                return null;
            } else {
                //encrypt new password
                let hashed_password = await bcrypt.hash(newPassword, 10);
                await users.updateUser({username: username}, {password: hashed_password})
                return {username: user.username, password: newPassword}
            }
        } catch (e) {
            return null;
        }
    }

    async deleteUserById(id) {
        try {
            let user = await users.getUser({_id: ObjectId(id)});
            if (!user) {
                return null;
            } else {
                return await users.deleteUser(id);
            }
        } catch (e) {
            return null;
        }
    }

    async updateUserById(id, data) {
        try {
            let user = await users.getUser({_id: ObjectId(id)});
            if (!user) {
                return null;
            } else {
                return await users.updateUser({_id: ObjectId(id)}, data);
            }
        } catch (e) {
            return null;
        }
    }

    async changeUserStatus(id) {
        try {
            let user = await users.getUser({_id: ObjectId(id)});
            if (!user) {
                return null;
            } else {
                if (!user.isActive || user.isActive === false) {
                    return await users.updateUser({_id: ObjectId(id)}, {isActive: true});
                } else {
                    return await users.updateUser({_id: ObjectId(id)}, {isActive: false});
                }
            }
        } catch (e) {
            return null
        }
    }
}

module.exports = {
    UserService
}