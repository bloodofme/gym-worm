import AuthService from "../services/auth.service";


// use these data 

const [email, setEmail] = useState('');
const [tempPassword, setTempPassword] = useState('');
const [newPassword, setNewPassword] = useState('');

const onSubmit = (e) => {
    console.log("Changing Password for " + email);
    AuthService.changePasswordSet(email, tempPassword, newPassword).then(
        (res) => {
            if (res.message === "No account with that email found") {
                alert("No account with that email found. Please check your email and try again.");
                console.log("Unable to reset password, no account found.");
            } else if (res.message === "Reset code is invalid") {
                alert("Reset code given is invalid. Please check and try again.")
                console.log("Unable to reset password, reset code invalid.");
            } else if (res.message === "New Password needs to be at least 6 characters!") {
                alert("New Password needs to be longer than 6 characters. Please try again.")
                console.log("Unable to reset password, new password too short.");
            } else {
                alert("Password has been reset. Please refer to your email on how to set your new password.");
                console.log("Successfully Reset");
            }
        },
        error => {
            alert("Unable to Change Password");
            console.log("Unable to Change Password");
            console.log(error);
        }
    )
    console.log("Change Password Request Done");
}
