class User{
    constructor(userId, username, email, password, roles, status){
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.status = status;
    }
}

exports.User = User;