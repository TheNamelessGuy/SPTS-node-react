function translate(lang) {
    let langs = [
        {
            locale: 'eng',
            words: {
                Home: 'Home',
                News: 'News',
                Login: 'Login',
                Firstname: 'Firstname',
                Lastname: 'Lastname',
                Age: 'Age',
                Gender: 'Gender',
                Email_address: 'Email address',
                R_email_address: 'Repeat email address',
                Password: 'Password',
                R_password: 'Repeat password',
                Register: 'Register',
                Stay_logged_in: 'Stay logged in',
                Register_now: 'Register now',
                Logout: 'Logout',
            }
        },
        {
            locale: 'slo',
            words: {
                Home: 'Domov',
                News: 'Novice',
                Login: 'Prijava',
                Firstname: 'Ime',
                Lastname: 'Priimek',
                Age: 'Starost',
                Gender: 'Spol',
                Email_address: 'Email naslov',
                R_email_address: 'Ponovite email naslov',
                Password: 'Geslo',
                R_password: 'Ponovite geslo',
                Register: 'Registriraj',
                Stay_logged_in: 'Ostani prijavljen',
                Register_now: 'Registriraj se zdaj',
                Logout: 'Odjava',
            }
        },
        {
            locale: 'deu',
            words: {
                Home: 'Zuhause',
                News: 'Nachrichten',
                Login: 'Einloggen',
                Firstname: 'Vorname',
                Lastname: 'Familienname / Nachname',
                Age: 'Alter',
                Gender: 'Geschlecht',
                Email_address: 'Email adresse',
                R_email_address: 'Wiederholen email adresse',
                Password: 'Passwort',
                R_password: 'Wiederholen passwort',
                Register: 'Registrieren',
                Stay_logged_in: 'Bleibe eingeloggt',
                Register_now: 'Jetzt registrieren',
                Logout: 'Ausloggen',
            }
        }
    ];
    let translation = '';
    for (let language of langs) {
        if (language.locale === lang)
            translation = language.words;
    }
    return(translation);
}

export default translate;