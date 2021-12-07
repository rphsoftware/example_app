(async function run() {
    const { username } = await fetch(API_ENDPOINT + "/whoami", {
        headers: {
            "Authorization": acquiredJwt
        }
    }).then(res => res.json());

    const usernameHtml = await fetch("/viewpart/hellotext?username=" + encodeURIComponent(username)).then(res => res.text());
    $('#welcome-holder').html(usernameHtml);

    const { data } = await fetch(API_ENDPOINT + "/data", {
        headers: {
            "Authorization": acquiredJwt
        }
    }).then(res => res.json());

    const renderedHtml = await fetch("/viewpart/renderData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: data.users
        })
    }).then(res=>res.text());

    $('#data-holder').html(renderedHtml);

    console.log(data);
})();
