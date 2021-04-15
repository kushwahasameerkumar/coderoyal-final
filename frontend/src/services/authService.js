export const currentUser = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken.length > 0) {
        props.setToken(accessToken);
        props.setLogin(true);
    }
    if (loggedIn) {
        console.log("Login effect: user logged in");
    }
}