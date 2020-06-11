class User {

    constructor(password, salt, email, username, enabled, permissions) {
        this.id = "";
        this.enabled = enabled;
        this.password = password;
        this.salt = salt;
        this.permissions = permissions;
        this.username = username;
        this.email = email;
        this.phone = null;
        this.firstname = null;
        this.lastname = null;
        this.gender = null;
        this.creation_date = `${new Date().getMonth}/${new Date().getDate}/${new Date().getFullYear}-${new Date().getHours}:${new Date().getMinutes}:${new Date().getSeconds}`;
    }
}