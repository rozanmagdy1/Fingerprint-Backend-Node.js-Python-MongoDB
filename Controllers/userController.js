let {UserService} = require("../Services/userService");
let service = new UserService();

class UserController {
    async getAllUsers(req, res) {
        let result = await service.listAllUsers();
        if (result === null) {
            res.json({
                message: "there is error to list all user"
            })
        } else {
            res.json({
                "users": result
            })
        }
    }

    async getUserById(req, res) {
        let id = req.params.id;
        let result = await service.getUserById(id);
        if (result === null) {
            res.status(404).json({
                message: "there is no user found!"
            })
        } else {
            res.json({
                "user": result
            })
        }
    }

    async addUser(req, res) {
        let {username, password, firstname, lastname, age, gender, address, phone} = req.body;
        let result = await service.addUser(
            username, password, firstname, lastname, age, gender, address, phone);

        if (result === "the username already exists use another one!") {
            res.json({
                message: "the username already exists use another one!"
            })
        } else if (result === null) {
            res.json({
                message: "the user creation fail please enter correct data!"
            })
        } else if (result === "there is error in insert user national id is redundant") {
            res.json({
                message: "there is error in insert user national id is redundant"
            })
        } else {
            res.json({
                message: "the user created successfully"
            })
        }
    }

    async login(req, res) {
        let {username, password} = req.body;
        let result = await service.login(username, password);
        if (result === null) {
            res.json({
                message: "login fail try another time"
            })
        } else if (result.message === "user not found") {
            res.status(404).json({
                message: "user not found"
            })
        } else if (result.message === "password wrong") {
            res.json({
                message: "password wrong try another time!"
            })
        } else if (result.message === "user not active") {
            res.json({
                message: "the user cannot login because he is deactivated"
            })
        } else {
            res.json({
                result
            })
        }
    }

    async verify(req, res) {
        let code = req.body;
        let token = req.headers["authorization"];
        let result = await service.verify(token, code);
        if (result === null) {
            res.json({
                result: "fail verification, Code is invalid or has expired.",
            })
        } else {
            if (result.message === "Code is valid and matches the email.") {
                res.json({
                    message: "login successfully",
                    result: {
                        verification: "Successful",
                        loginToken: result.loginToken,
                        username: result.username,
                        userId: result.userId,
                    }
                })
            } else {
                res.json({
                    result: "fail verification, Code is invalid or has expired.",
                })
            }
        }
    }

    async resendCode(req, res) {
        let username = req.body;
        let result = await service.resendCode(username);
        res.json({
            result: result,
        })
    }

    async forgetPassword(req, res) {
        let username = req.body.username;
        let newPassword = req.body.newPassword;
        let result = await service.forgetPassword(username, newPassword);
        if (result === null) {
            res.status(404).json({
                message: "The user not found"
            })
        } else {
            res.json({
                "message": "the password reset successfully",
                "user": result
            })
        }
    }

    async deleteUserById(req, res) {
        let id = req.params.id;
        let result = await service.deleteUserById(id);
        if (result === null) {
            res.status(404).json({
                message: "The user not found"
            })
        } else {
            res.json({
                message: "The user deleted successfully"
            })
        }
    }

    async updateUserById(req, res) {
        let id = req.params.id;
        let data = req.body;
        let result = await service.updateUserById(id, data);
        if (result === null) {
            res.status(404).json({
                message: "The user not found"
            })
        } else {
            res.json({
                message: "The user updated successfully"
            })
        }
    }

    async changeUserStatusById(req, res) {
        let id = req.params.id;
        let result = await service.changeUserStatus(id);
        if (result === null) {
            res.status(404).json({
                message: "user not found"
            })
        } else {
            res.json({
                message: "user status changed"
            })
        }
    }

}

module.exports = {
    UserController
};