const DEBUG = false;
let acquiredJwt; // Set for debugging

(async function run() {
    // Fetch the login screen
    const login = await fetch("/viewpart/login").then(res => res.text());

    $('#viewport').html(login);

    await 0; // cross-platform queueMicrotask

    $('#login-btn').click(async () => {
        const username = $('#username')[0].value;
        const password = $('#password')[0].value;

        $("#login-btn")[0].style.display = "none";
        $("#login-load")[0].style.display = "inline-block";
        const { error, jwt } = await fetch(API_ENDPOINT + "/authenticate", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => res.json());

        if (error) {
            $("#login-btn")[0].style.display = "block";
            $("#login-load")[0].style.display = "none";
            alert("Error logging in:\n"+error);
        } else {
            acquiredJwt = jwt;

            const mainApp = await fetch("/viewpart/app").then(res => res.text());
            $('#viewport').html(mainApp);
        }
    })
})();


if (DEBUG) {
    const base = $('link')[0].href;
    setInterval(function() {
        $('link')[0].href = base + '?v=' + Math.random();
    }, 1000);

    (async function r() {

        const mainApp = await fetch("/viewpart/app").then(res => res.text());
        $('#viewport').html(mainApp);
    })();
}

