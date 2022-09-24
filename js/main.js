let wrapper = document.querySelector(".wrapper");
let arrowBack = wrapper.querySelector("header i");

let inputPart = document.querySelector(".inputPart");
let infoTxt = inputPart.querySelector(".infoTxt");
let input = inputPart.querySelector("input");
let locationBtn = inputPart.querySelector("button");

let weatherPart = wrapper.querySelector(".weatherPart");
let weatherIcon = weatherPart.querySelector("img");

let api;


input.addEventListener("keyup", e =>
{
    if (e.key == "Enter" && input.value != "")
    {
        requestApi(input.value);
    }
});

locationBtn.addEventListener("click", () =>
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else
    {
        alert("Your browser not support geolocation api");
    }
});


function requestApi (city)
{

    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${"f1b841616ab7a1fc9f148fa2e41553a7"}`;

    fetchData();
}


function onSuccess (position)
{
    let { latitude, longitude } = position.coords;

    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${"f1b841616ab7a1fc9f148fa2e41553a7"}`;

    fetchData();
}


function onError (error)
{

    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


function fetchData ()
{
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>
    {
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}


function weatherDetails (info)
{
    if (info.cod == "404")
    {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${input.value} isn't a valid city name`;
    }
    else
    {

        let city = info.name;
        let country = info.sys.country;
        let { description, id } = info.weather[0];
        let { temp, feels_like, humidity } = info.main;


        if (id == 800)
        {
            weatherIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232)
        {
            weatherIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622)
        {
            weatherIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781)
        {
            weatherIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804)
        {
            weatherIcon.src = "icons/cloud.svg";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321))
        {
            weatherIcon.src = "icons/rain.svg";
        }


        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        input.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () =>
{
    wrapper.classList.remove("active");
});
