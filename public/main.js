let user = getCookie("username");
let ver = getCookie("verified");
const socket = io({ query: { name: user } });
document.getElementById('settingspanel').style.display = 'none';
document.getElementById('wlpanel').style.display = "none";
document.getElementById('notificationpanel').style.display = 'none';
document.getElementById('bullish').style.border = '0px';
document.getElementById('bearish').style.border = '0px';
document.getElementById('Cbullish').style.border = '0px';
document.getElementById('Cbearish').style.border = '0px';
document.getElementById('homebtn').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
document.getElementById('mainfeed').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
document.getElementById('ec').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
document.getElementsByClassName('prbtn')[0].style.borderBottom = '2px solid #007bff';
let activetab = "homebtn";
let activeFeedtab = "mainfeed";
let activetool = "ec";
let watchlists = [];
let deleting = false;
let sentiment = " ";
let file;
let fileName = "";
let uploadedFileName;
let pid = " ";
let Cpost=" ";
let Rpost= " ";
let commentPost=" ";
let lastPost= "0";
let np  = false; 
let options = {
    series: [{
    name: 't',
    data: [1]
  }],
    chart: {
    height: 10,
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    categories: ["2024-01-01"]
  }
};
let cichart = new ApexCharts(document.querySelector("#cichart"), options);
cichart.render();
cichart.destroy();
document.getElementById('financialcont').style.display='none';
document.getElementById('chartcont').style.display='block';
Window.onload = Initialize( );
// create stock chart
var chart = anychart.stock();

//function that returns a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) {
        c = c.substring(1);
        }
        if (c.startsWith(name)) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

let uname = getCookie("username");

//Opening settings panel
let html2 = '';
html2 += '<img class="contactavatarsmall" src="./img/avatar.png" alt="contact avatar"></img>'+
'<span class="contactname">'+uname+'</span>'
document.getElementById('user').innerHTML = html2;
document.getElementById('settings').addEventListener('click', () => {
    let sp = document.getElementById('settingspanel');
    if (sp.style.display === 'none') {
        sp.style.display = 'flex';
    }
    else {
        sp.style.display = 'none';
    }
})

//signout button
const signoutbtn = document.getElementById('SignoutBtn');
signoutbtn.addEventListener('click', async () => {
    deleteCookie('username');
    
    try{
        const res = await fetch("/logout", {
        method: 'GET'})

        const status = await res.status
        if(status == 200){
          location.assign('/login')
        }

      }catch(err) {
        console.log(err)
      }

})

//function that deletes a cookie
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
//Setting the theme of the page
const expirationDate = new Date();
expirationDate.setFullYear(expirationDate.getFullYear() + 1);
// Format the date to the UTC string format expected by the cookie
const expires = expirationDate.toUTCString();
let theme = getCookie("theme");
if (theme === 'darkmode') {
    document.body.classList.toggle('dark-mode');
    document.getElementById('radio-2').checked = true;
    document.getElementById('radio-1').checked = false;
    document.getElementById('mainlogo').src = "./img/Wlogo22.png";
    document.getElementById('home').src = "./img/WhomeIcon.png";
    document.getElementById('tools').src = "./img/WtoolsIcon.png";
    document.getElementById('sf').src = "./img/WsocialsIcon.png";
    document.getElementById('mf').src="./img/Wmfeed.png";
    document.getElementById('pr').src="./img/Wprofileicon.png";
    document.getElementById('homebtn').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
    document.getElementById('mainfeed').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
    document.getElementById('ec').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
}
else {
    document.getElementById('radio-2').checked = false;
    document.getElementById('radio-1').checked = true;
    document.cookie = 'theme=lightmode; expires=' + expires + '; path=/';
}
//Changing from light mode to dark mode
const Thr1 = document.getElementById('radio-1');
const Thr2 = document.getElementById('radio-2');
Thr1.addEventListener('click' , () => {
    if (getCookie('theme') == 'darkmode') {
        document.body.classList.toggle('dark-mode');
        document.cookie = 'theme=lightmode; expires=' + expires + '; path=/';
        document.getElementById('mainlogo').src = "./img/logo22.png";
        document.getElementById('home').src = "./img/homeIcon.png";
        document.getElementById('tools').src = "./img/toolsIcon.png";
        document.getElementById('sf').src = "./img/socialsIcon.png";
        document.getElementById('mf').src="./img/mfeed.png";
        document.getElementById('pr').src="./img/profileicon.png";
        chart.background().fill(getComputedStyle(document.body).getPropertyValue('--panel-color'));
        document.getElementById(activetab).style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
        document.getElementById(activeFeedtab).style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
        document.getElementById(activetool).style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
    }
} )

Thr2.addEventListener('click' , () => {
    if (getCookie('theme') == 'lightmode') {
        document.body.classList.toggle('dark-mode');
        document.cookie = 'theme=darkmode; expires=' + expires+ '; path=/';
        document.getElementById('mainlogo').src = "./img/Wlogo22.png";
        document.getElementById('home').src = "./img/WhomeIcon.png";
        document.getElementById('tools').src = "./img/WtoolsIcon.png";
        document.getElementById('sf').src = "./img/WsocialsIcon.png";
        document.getElementById('mf').src="./img/Wmfeed.png";
        document.getElementById('pr').src="./img/Wprofileicon.png";
        chart.background().fill(getComputedStyle(document.body).getPropertyValue('--panel-color'));
        document.getElementById(activetab).style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
        document.getElementById(activeFeedtab).style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
        document.getElementById(activetool).style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
    }
} )
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// DATA
// Create a new WebSocket connection to receive market prices
let ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

// Handle incoming messages from the WebSocket server
ws.onmessage = function(event) {
    // Parse the JSON message
    let data = JSON.parse(event.data);
    data.forEach(tr => {
        if (document.getElementById(tr.S) != null) {
            if (document.getElementById(tr.S).innerHTML.replace('$', '') > tr.bp) {document.getElementById(tr.S).style.color = '#e41212';}
            else (document.getElementById(tr.S).style.color = '#16c934')
            document.getElementById(tr.S).innerHTML = "$"+tr.bp;
        }
    });
};

// Send a subscription message to the WebSocket server
ws.onopen = function() {
    ws.send(JSON.stringify({"action": "auth", "key": "PKP8SY1YXAG14AIPOHJ9", "secret": "ULmtitLaF2lTfWtFmc2qjHJsIzUmiugTdcR1mLg5"}));
    ws.send(JSON.stringify({"action":"subscribe","quotes":["SPY", "DIA", "NDAQ", "VIXY"]}));
};

// Create a new WebSocket connection to receive market news
let wsn = new WebSocket('wss://stream.data.alpaca.markets/v1beta1/news');

// Handle incoming messages from the WebSocket server
wsn.onmessage = function(event) {
    // Parse the JSON message
    let data = JSON.parse(event.data);
    data.forEach(tr => {
        createnewsItem(tr, 'n');
    });
};

// Send a subscription message to the WebSocket server
wsn.onopen = function() {
    wsn.send(JSON.stringify({"action": "auth", "key": "PKP8SY1YXAG14AIPOHJ9", "secret": "ULmtitLaF2lTfWtFmc2qjHJsIzUmiugTdcR1mLg5"}));
    wsn.send(JSON.stringify({"action":"subscribe","news":["*"]}));
};


async function Initialize () {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    fetch("/news", init)
    .then(response => response.json())
    .then(news => {
        news.forEach(n => {
            createnewsItem(n, 'r');
        });
        
    })
    .catch(err => console.log(err));
    createChart('SPY');
    setMarkets('DIA'); ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setMarkets('SPY');
    setMarkets('NDAQ');///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setMarkets('VIXY');
    //Creating watchlists
    setWatchlists("");
    //Set earnings

    // Get the current date
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    let currentFormattedDate = year + '-' + month + '-' + day;
    let oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1); 
    let yearOneMonthFromNow = oneMonthFromNow.getFullYear();
    let monthOneMonthFromNow = oneMonthFromNow.getMonth() + 1; 
    let dayOneMonthFromNow = oneMonthFromNow.getDate();
    monthOneMonthFromNow = (monthOneMonthFromNow < 10) ? '0' + monthOneMonthFromNow : monthOneMonthFromNow;
    dayOneMonthFromNow = (dayOneMonthFromNow < 10) ? '0' + dayOneMonthFromNow : dayOneMonthFromNow;
    oneMonthFromNowFormatted = yearOneMonthFromNow + '-' + monthOneMonthFromNow + '-' + dayOneMonthFromNow;
    getEarnings(currentFormattedDate, oneMonthFromNowFormatted)
    getDividents(currentFormattedDate, oneMonthFromNowFormatted)
    document.getElementById('fromEC').value = currentFormattedDate;
    document.getElementById('toEC').value = oneMonthFromNowFormatted;
    document.getElementById('fromGI').value = currentFormattedDate;
    document.getElementById('toGI').value = oneMonthFromNowFormatted;


    //send posts request to the server
    socket.emit('feedrequest', {
        user: user
    })

}

function setMarkets(t) {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    fetch("https://financialmodelingprep.com/api/v3/quote-short/"+t+"?apikey=uAtInsaQOLW61PEm8hwsefAammoqeIk3", init)
    .then(response => response.json())
    .then(price => {
        document.getElementById(t).innerHTML = "$"+price[0].price;
    })
    .catch(err => console.log(err));
}

function createnewsItem(n, r) {
    let container = document.getElementById('newspanel');
    let url;
    if (n.hasOwnProperty("images")) {
        if (n.images.length == 0) {
            url = "./img/default.png"
        }
        else {
            url = n.images[1].url;
        }
    }
    else {
        url = "./img/default.png"
    }
    if (n.hasOwnProperty("headline")){
        const formattedDate = getTimeDiff(n.created_at);
        const newdiv = document.createElement("div");
        newdiv.className = "livenews";
        let html = '';
        html += 
        '<div class="nwrapper" onclick="openarticle(this)">'+
            '<img class="nimg" src='+url+' alt="">'+
            '<h1 class="url">'+n.url+'</h1>'+
            '<div class="ndetails">'+
                '<h2 class="ntitle">'+n.headline+'</h2>'+
                '<h4 class="nmetadata">'+n.author+", "+formattedDate+'</h4>'+
            '</div>'+
        '</div>';
        newdiv.innerHTML = html;
        if (r == 'r') {
            container.append(newdiv);
        }
        else {
            container.prepend(newdiv);
        }
    }
}

///Function that redirects to the artcle when clicked on
function openarticle(t) {
    window.open(t.getElementsByClassName('url')[0].innerHTML, "_blank");
}

///Function that returns the time in the users timezone
function getTimeDiff(t) {
    const date = new Date(t);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const localDateString = date.toLocaleString(undefined, options);
    return localDateString;
}

///Checking the market status once a minute
function checkMarketStatus() {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    fetch("https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=demo", init)
    .then(response => response.json())
    .then(data => {
        if (data.markets[0].current_status == 'closed') {
            document.getElementById('dot').style.backgroundColor = '#ff0000';
            document.getElementById('status').innerHTML = 'closed';
            document.getElementById('status').style.color = '#ff0000';
        }
        else {
            document.getElementById('dot').style.backgroundColor = '#14c92c';
            document.getElementById('status').innerHTML = 'open';
            document.getElementById('status').style.color = '#14c92c';
        }
        
    })
    .catch(err => console.log(err));
}
checkMarketStatus();
// Call the function every minute (60 seconds)
setInterval(checkMarketStatus, 60000);

///Ticker Search function
function search(t) {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header};
    return fetch('https://ticker-2e1ica8b9.now.sh/keyword/'+t, init)
    .then(response => response.json())
    .catch(err => console.log(err));
}

document.getElementById('searchbar').addEventListener('input', () => {
    let term = document.getElementById('searchbar').value;
    if (term != '') {
        search(term)
        .then(data => {
            document.getElementById('searchbox').replaceChildren();
            data.forEach(t => {
                createSearchItem(t);
            });
            document.getElementById('searchcont').style.display = 'flex';
        })
        .catch(error => {
        });
    }
    else {
        document.getElementById('searchcont').style.display = 'none';
    }
})

// Add event listener for the form's submit event
document.getElementById('sform').addEventListener('submit', (event) => {
    event.preventDefault();
});

///Function that creates search item
function createSearchItem(t){
    let container = document.getElementById('searchbox');
    const newdiv = document.createElement("div");
    newdiv.className = "searchterm";
    let html = '';
    html += 
        '<div class="searchwrapper" onclick="loadchart(this)">'+
            '<h1 class="sticker">'+t.symbol+'</h1>'+
            '<h1 class="sname">'+t.name+'</h1>'+
        '</div>'
    newdiv.innerHTML = html;
    container.append(newdiv);
    
}

const searchInput = document.getElementById('searchbar');

// Add event listener for blur event
searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        document.getElementById('searchcont').style.display = 'none';
        searchInput.value = '';
    }, 500);
});

/////////////Charting code///////////////////////////
async function createChart(t) {
        // Clear the existing chart container
        document.getElementById('chartcont').innerHTML = '';
        // Show the loading spinner
        document.getElementById('loadingSpinner').style.display = 'block';

        // Create a new chart instance
        chart = anychart.stock();

        let data = await getCandlesticks(t);
        const mappedData = data.map(obj => [
            new Date(obj.t).getTime(), // x (timestamp)
            obj.o, // open
            obj.h, // high
            obj.l, // low
            obj.c  // close
        ]);

        let table = anychart.data.table();
        table.addData(mappedData);

        let mapping = table.mapAs();
        mapping.addField('open', 1, 'first');
        mapping.addField('high', 2, 'max');
        mapping.addField('low', 3, 'min');
        mapping.addField('close', 4, 'last');
        mapping.addField('value', 4, 'last');

        // create first plot on the chart
        let plot = chart.plot(0);

        // set grid settings
        plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

        let series = plot.candlestick(mapping)
                .name(t);

        series.legendItem().iconType('rising-falling');

        // create scroller series with mapped data
        chart.scroller().candlestick(mapping);

        // create range picker
        let rangePicker = anychart.ui.rangePicker();

        // init range picker
        rangePicker.render(chart);

        // create range selector
        let rangeSelector = anychart.ui.rangeSelector();

        // init range selector
        rangeSelector.render(chart);
        let customRanges = [
            {
                'text': '1min',
                'type': 'unit',
                'unit': 'min',
                'count': 500,
                'anchor': 'last-date'
            },
            {
                'text': '5min',
                'type': 'unit',
                'unit': 'min',
                'count': 2500,
                'anchor': 'last-date'
            },
            {
                'text': '15min',
                'type': 'unit',
                'unit': 'min',
                'count': 7500,
                'anchor': 'last-date'
            },
            {
                'text': '30min',
                'type': 'unit',
                'unit': 'min',
                'count': 15000,
                'anchor': 'last-date'
            },
            {
                'text': '1Hour',
                'type': 'unit',
                'unit': 'min',
                'count': 30000,
                'anchor': 'last-date'
            },
            {
                'text': 'Max',
                'type': 'max'
            },
        ];
        
        // Set custom ranges for the range selector.
        rangeSelector.ranges(customRanges);

        // sets the title of the chart
        chart.title(t);

        // set container id for the chart
        chart.container('chartcont');

        chart.background().fill(getComputedStyle(document.body).getPropertyValue('--panel-color'));
        series.risingFill("#0dc47e"); // Green color
        series.fallingFill("#dc1f38"); // Red color
        series.risingStroke("#0dc47e"); // Green color
        series.fallingStroke("#dc1f38"); // Red color

        // Hide the loading spinner once the chart is created
        document.getElementById('loadingSpinner').style.display = 'none';
        // initiate chart drawing #0db787 #dc1f4e
        chart.draw();
    /////////////////////////LOAD FINANCIALS////////////////////////////////////////////////////////////////////////////////////////////////
    let BalanceSheetdata = await getBalanceSheetData(t);
    if (BalanceSheetdata.length > 0) {
        document.getElementById('finner').style.display = 'flex';
        document.getElementById('nda').style.display = 'none';
        let iterationCount = 0;
        BalanceSheetdata.forEach(t => {
            createBlancesheet(t, iterationCount);
            iterationCount++;
        });
    }
    else {
        document.getElementById('finner').style.display = 'none';
        document.getElementById('nda').style.display = 'block';
    }

}

function createBlancesheet(t, c) {
    let cont = document.getElementsByClassName('numbers')[c];
    cont.replaceChildren();
    let div = document.getElementById('bl');
    div.childNodes.forEach(child => {
        if (child.innerHTML != undefined) {
            let newH3 = document.createElement('h3');
            newH3.classList.add('ndai');
            newH3.textContent = t[child.innerHTML.replace(/\s/g, '')];
            cont.appendChild(newH3);
        }
        
    });

}

async function getCandlesticks(t) {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3);
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month as it is zero-based
    let day = String(currentDate.getDate()).padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;
    const url = 'https://api.polygon.io/v2/aggs/ticker/'+t+'/range/1/minute/'+formattedDate+'/2077-04-07?adjusted=true&sort=asc&limit=60000&apiKey=KAvaZvBgJFkRvHVNf4VhN2jpnA8fVkz7';
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
    };
    
    return fetch(url, options)
    .then(response => response.json())
    .then(response => response.results)
    .catch(err => console.error(err));
}

async function getBalanceSheetData(t) {
    const url = 'https://financialmodelingprep.com/api/v3/balance-sheet-statement/'+t+'?period=annual&limit=4&apikey=C4aCpDqiWM1dttxbSozsAaBpw49YgPNi';
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
    };
    
    return fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));
}

function loadchart(t) {
    if (!deleting) {
        createChart(t.getElementsByTagName('h1')[0].innerHTML);
    }
    deleting = false;
}


function changeTab(t, s){
    activetab = s.id;
    document.getElementById('mainpanel').style.display = 'none';
    document.getElementById('rtools').style.display ='none';
    document.getElementById('feed').style.display ='none';
    document.getElementById(t).style.display ='grid';
    document.getElementById('homebtn').style.backgroundColor = '';
    document.getElementById('tbtn').style.backgroundColor = '';
    document.getElementById('fbtn').style.backgroundColor = '';
    s.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
    if (document.getElementById('feed').style.display != 'none' || document.getElementById('rtools').style.display != 'none') document.getElementById('sform').style.display = 'none';
    else document.getElementById('sform').style.display = 'block';
}

async function addToWatchlist(id, t) {
    try{
        const res = await fetch("/addtowatchlist", {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({
          "id": id,
          "ticker": t
        } )})
        const status = await res.status
        if(status == 200){
            let er = await res.text();
            ShowError(er)
            setWatchlists(id)
        }
    }catch(err) {
        console.log(err)
    }
}

async function createWatchlist(name, t) {
    try{
        const res = await fetch("/createwatchlist", {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({
          "user": user,
          "name": name,
          "ticker": t
        } )})
        const status = await res.status
        if(status == 200){
          ShowError("Watchlist successfully created")
        }
        else {
            ShowError("An error occurred while creating the watchlist")
        }
    }catch(err) {
        console.log(err)
    }
}


function ShowError(v) {
    let x = document.getElementById("snackbar");
    x.innerHTML = v;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

async function setWatchlists(wlid) {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET",
                headers: header}

    fetch("/getwatchlists?user="+user, init)
    .then(response => response.json())
    .then(wls => {
        if (wls.length > 0) {
            let sdiv = document.getElementById("wlselect");
            sdiv.replaceChildren();
            wls.forEach(l => {
                let opt = document.createElement("option");
                opt.className = "opt";
                opt.value = l._id;
                opt.innerHTML = l.name;
                sdiv.appendChild(opt);
            })

            let wlcont = document.getElementById("wlcontainer");
            wlcont.replaceChildren();
            let tid = document.getElementById('wlselect').value;
            if (wlid != "") {
                tid = wlid;
                document.getElementById('wlselect').value = wlid;
            }
            wls.forEach(l => {
                if (l._id == tid) {
                    l.tickers.forEach(async (l) => {
                        let p = await getTickerPrice(l);
                        let html = '<div class="wliwrapper" onclick="loadchart(this)">'+
                        '<h1 class="wliticker">'+l+'</h1>'+
                        '<h1 class="wlp">$'+p+'</h1>'+
                        '<img src="./img/x.png" alt="xicon" class="close-btn" onclick="delWLI(this)">'+
                        '</div>'
                        let t = document.createElement("div");
                        t.className = "wlitem";
                        t.innerHTML = html
                        wlcont.appendChild(t);
                    })
                }
            })
        }
    })
    .catch(err => console.log(err));
}

function getTickerPrice(t) {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    let url = "https://financialmodelingprep.com/api/v3/quote-short/"+t+"?apikey=3y8mnFMqcilRIFHEngmunMCaBzPjwjZJ";
    return fetch(url, init)
    .then(response => response.json())
    .then(response => response[0].price)
    .catch(err => console.error(err));
}


function fillWatchlist(id){
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    let url = "/getWatchlist?id="+id;
    return fetch(url, init)
    .then(response => response.json())
    .then(wl => {
        let wlcont = document.getElementById("wlcontainer");
        wlcont.replaceChildren();
        wl[0].tickers.forEach(async (l) => {
            let p = await getTickerPrice(l);
            let html = '<div class="wliwrapper" onclick="loadchart(this)">'+
                '<h1 class="wliticker">'+l+'</h1>'+
                '<h1 class="wlp">$'+p+'</h1>'+
                '<img src="./img/x.png" alt="xicon" class="close-btn" onclick="delWLI(this)">'+
                '</div>'
            let t = document.createElement("div");
            t.className = "wlitem";
            t.innerHTML = html
            wlcont.appendChild(t);
        })
    })
    .catch(err => console.error(err));
}

document.getElementById('wlselect').addEventListener('change', () => {
    fillWatchlist(document.getElementById('wlselect').value);
})

document.getElementById('addtolist').addEventListener('click', () => {
    if (document.getElementById('wlpanel').style.display == 'none') {
        let header = new Headers().append('Accept', 'application/json');
        let init = {method: "GET",
                    headers: header}
        fetch("/getwatchlists?user="+user, init)
        .then(response => response.json())
        .then(wls => {
            if (wls.length > 0) {
                let wldiv = document.getElementById("wls");
                wldiv.replaceChildren();
                watchlists = [];
                wls.forEach(l => {
                    watchlists.push(l.name)
                    let html = '<div class="wliwrapper" onclick="addWL(this)">'+
                        '<h1 class="wlp">'+l.name+'</h1>'+
                        '<h1 class="wlid">'+l._id+'</h1>'+
                        '</div>'
                    let t = document.createElement("div");
                    t.className = "wlitem2";
                    t.innerHTML = html
                    wldiv.appendChild(t);
                })
            }
        })
        .catch(err => console.log(err));
        
        document.getElementById('wlpanel').style.display = "flex";
    }
    else {
        document.getElementById('wlpanel').style.display = "none";
    }
})

function addWL(t){
    addToWatchlist(t.getElementsByTagName("h1")[1].innerHTML, chart.title().text())
}

document.addEventListener("click", function(event) {
    if (!document.getElementById('addtolist').contains(event.target)) {
        document.getElementById('wlpanel').style.display = "none";
    }
    if (!document.getElementById('notificationpanel').contains(event.target) && !document.getElementById('notificon').contains(event.target) && !np) {
        document.getElementById('notificationpanel').style.display = "none";
    }
    np = false;
});

document.getElementById('nwlbtn').addEventListener('click', () => {
    document.getElementById('wlpanel').style.display = "none";
    document.getElementById('nwlpanel').style.display = "flex"
})

document.getElementById('exitNewWLCr').addEventListener('click', () => {
    document.getElementById('nwlpanel').style.display = "none"
    document.getElementById('nwlt').value = "";
})

document.getElementById('submitnwl').addEventListener('click', () => {
    if (document.getElementById('watchlistname').value != "" && !watchlists.includes(document.getElementById('watchlistname').value)) {
        createWatchlist(document.getElementById('watchlistname').value, chart.title().text())
        document.getElementById('watchlistname').value = "";
        document.getElementById('nwlpanel').style.display = "none";
        setWatchlists("");
    }
    else if (watchlists.includes(document.getElementById('watchlistname').value)) {
        ShowError("Watchlist name already exists")
    }
    else {
        ShowError("Please enter a name")
    }
})

document.getElementById('deleteWL').addEventListener('click', () => {
    document.getElementById('delWL').style.display = "flex";
})


document.getElementById('DeleteYes').addEventListener('click', async () => {
    try{
        const res = await fetch("/deletewatchlist", {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({
          "id": document.getElementById('wlselect').value
        } )})
        const status = await res.status
        if(status == 200){
            let er = await res.text();
            ShowError(er)
            const selectElement = document.getElementById('wlselect');
            const optionToRemove = selectElement.querySelector('option[value="'+document.getElementById('wlselect').value+'"]');
            if (optionToRemove) {
                optionToRemove.remove();
            }
            setWatchlists("");
        }
        else {
            ShowError("An error occurred while deleting the watchlist")
        }
    }catch(err) {
        console.log(err)
    }   

    document.getElementById('delWL').style.display = "none";
})

document.getElementById('DeleteNo').addEventListener('click', () => {
    document.getElementById('delWL').style.display = "none";
})

async function delWLI(t) {
    deleting = true;
    let ticker = t.parentNode.getElementsByTagName('h1')[0].innerHTML;
    let wlid = document.getElementById('wlselect').value;
    const res = await fetch("/deleteticker", {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({
          "id": wlid,
          "ticker": ticker
        } )})
        const status = await res.status
        if(status == 200){
            let er = await res.text();
            ShowError(er)
            setWatchlists(wlid);
        }
        else {
            ShowError("An error occurred while removing the ticker")
        }
    
}

document.getElementById('chartbtn').addEventListener('click', () => {
    if (document.getElementById('chartcont').style.display == 'none') {
        document.getElementById('chartbtn').style.backgroundColor = '#3b6b8b';
        document.getElementById('finbtn').style.backgroundColor = '#0099ff';
        document.getElementById('chartcont').style.display = 'block'
        document.getElementById('financialcont').style.display = 'none'
    }
})

document.getElementById('finbtn').addEventListener('click', () => {
    if (document.getElementById('financialcont').style.display == 'none') {
        document.getElementById('finbtn').style.backgroundColor = '#3b6b8b';
        document.getElementById('chartbtn').style.backgroundColor = '#0099ff';
        document.getElementById('chartcont').style.display = 'none'
        document.getElementById('financialcont').style.display = 'flex'
    }
})

///////////////////// feed ////////////////////////

document.getElementById('bullish').addEventListener('click', () => {
    if (document.getElementById('bullish').style.border != '0px') {
        document.getElementById('bullish').style.border = '0px';
        sentiment = " ";
    }
    else {
        document.getElementById('bullish').style.border = '1px solid #00e239';
        sentiment = "Bullish";
    }
    document.getElementById('bearish').style.border = '0px';
})
document.getElementById('bearish').addEventListener('click', () => {
    if (document.getElementById('bearish').style.border != '0px') {
        document.getElementById('bearish').style.border = '0px';
        sentiment = " ";
    }
    else {
        document.getElementById('bearish').style.border = '1px solid #eb0000';
        sentiment = "Bearish";
    }
    document.getElementById('bullish').style.border = '0px';
})

////////////////////COMMNENTS///////////////////////////////////////////////////////////////
function comment(t) {
    document.getElementById('commentpanel').style.display = 'flex';
    document.getElementById('rt1').innerHTML = "Replying to: "+t.parentNode.parentNode.parentNode.getElementsByClassName('postername')[0].innerHTML;
    pid = t.parentNode.parentNode.getElementsByClassName('postid')[0].innerHTML;
    Cpost = t;
}

document.getElementById('Cbullish').addEventListener('click', () => {
    if (document.getElementById('Cbullish').style.border != '0px') {
        document.getElementById('Cbullish').style.border = '0px';
        sentiment = " ";
    }
    else {
        document.getElementById('Cbullish').style.border = '1px solid #00e239';
        sentiment = "Bullish";
    }
    document.getElementById('Cbearish').style.border = '0px';
})
document.getElementById('Cbearish').addEventListener('click', () => {
    if (document.getElementById('Cbearish').style.border != '0px') {
        document.getElementById('Cbearish').style.border = '0px';
        sentiment = " ";
    }
    else {
        document.getElementById('Cbearish').style.border = '1px solid #eb0000';
        sentiment = "Bearish";
    }
    document.getElementById('Cbullish').style.border = '0px';
})
document.getElementById('discardcomment').addEventListener('click', () => {
    document.getElementById('commentpanel').style.display = 'none';
    document.getElementById('cominput').value = "";
    sentiment = " ";
    document.getElementById('Cbullish').style.border = '0px';
    document.getElementById('Cbearish').style.border = '0px';
    document.getElementById('Cremovepic').click();
})
document.getElementById('Caddimg').addEventListener('click', () => {
    inp[1].click();
})
document.getElementById('Cremovepic').addEventListener('click', () => {
    document.getElementById('Cpostimgpreview').src= "";
    fileName = "";
    file="";
    document.getElementById('Cprevpic').style.display= 'none';
    inp[1].value = "";
})
document.getElementById('reply').addEventListener('click', () => {

    if (document.getElementById('cominput').value == "") {
        ShowError("Please type something before posting")
    }
    else if (fileName != ""){
        document.getElementById('postloading').style.display = 'flex';
        uploadImg("c", document.getElementById('cominput').value, "p");
    }
    else {
        document.getElementById('postloading').style.display = 'flex';
        socket.emit('newpost', {
            username: user,
            content: document.getElementById('cominput').value,
            url: " ",
            verified: ver,
            likes: "0",
            reposts: "0",
            sentiment: sentiment,
            type: "c",
            postid: pid
        })
    }
})

function viewComments(t) {
    let id = t.parentNode.getElementsByClassName('postid')[0].innerHTML;
    document.getElementById('profileTab').style.display = "none";

    let newdiv = document.createElement("div");
    newdiv.className = "feedpost";
    newdiv.innerHTML = t.parentNode.innerHTML;
    commentPost = newdiv;
    commentPost.getElementsByClassName('pbtn')[1].style.display = "none";
    commentPost.getElementsByClassName('likes')[0].style.display = "none";
    commentPost.getElementsByClassName('likes')[1].style.display = "none";
    commentPost.getElementsByClassName('vc')[0].style.display = "none";
    commentPost.getElementsByClassName('likes')[2].style.marginLeft = "auto";

    socket.emit('getcomments', {
        id: id,
        user: user
    })
}

function viewNotification(t) {
    if (t.parentNode.getElementsByClassName('nottextinner')[0].innerHTML.includes("following")) {
        changeProfileTab('0' , 'profilePosts');
        socket.emit('getProfileinfo', {
            user: t.parentNode.getElementsByClassName('notdets')[3].innerHTML,
            mainuser: user
        })
    }
    else {
        let id = t.parentNode.getElementsByClassName('notdets')[0].innerHTML;
        socket.emit('getpost', {
            id: id,
            user: user
        })
    }
    document.getElementById('notificationpanel').style.display = "none";
}


////////////////////COMMNENTS///////////////////////////////////////////////////////////////

document.getElementById('post').addEventListener('click', () => {

    if (document.getElementById('npinput').value == "") {
        ShowError("Please type something before posting")
    }
    else if (fileName != ""){
        document.getElementById('postloading').style.display = 'flex';
        uploadImg("0", document.getElementById('npinput').value, "p");
    }
    else {
        document.getElementById('postloading').style.display = 'flex';
        socket.emit('newpost', {
            username: user,
            content: document.getElementById('npinput').value,
            url: " ",
            verified: ver,
            likes: "0",
            reposts: "0",
            sentiment: sentiment,
            type: "0",
            postid: " "
        })
    }
})


//////////////Sockets////////////////////////////
socket.on('ngf' , async (data) => {

});

socket.on('newposts' , () => { 
    let count = parseInt(npIndicator.textContent.match(/\d+/)[0]);
    count++;
    npIndicator.textContent = `Show ${count} new posts`;
    document.getElementById('npIndicator').style.display = 'block';
});

socket.on('postsaved' , (data) => { 
    document.getElementById('postloading').style.display = 'none';
    ShowError(data.msg)
    if (data.msg != "An error occurred while saving post") {
        document.getElementById('npinput').value = "";
        fileName = "";
        sentiment = " ";
        document.getElementById('bullish').style.border = '0px';
        document.getElementById('bearish').style.border = '0px';
        document.getElementById('postimgpreview').src= "";
        document.getElementById('prevpic').style.display= 'none';
        document.getElementById('discardcomment').click();
    }
    if (data.msg == "Your comment is now live!") {
        let n = parseInt(Cpost.parentNode.getElementsByClassName('cc')[0].innerHTML) + 1;
        Cpost.parentNode.getElementsByClassName('cc')[0].innerHTML = n;

        let h1Element = document.createElement('h1');
        h1Element.innerHTML = 'View comments';
        h1Element.className = 'vc'; 
        h1Element.onclick = function() {
            viewComments(this);
        }
        Cpost.parentNode.parentNode.parentNode.append(h1Element);
    }
    if (data.msg == "Your repost is now live!") {
        let n = parseInt(Rpost.parentNode.getElementsByClassName('cc')[0].innerHTML) + 1;
        Rpost.parentNode.getElementsByClassName('cc')[0].innerHTML = n;
    }
});

socket.on('posts' , (data) => { 
    let pictures = data.profilepics[0].pictures;
    if (pictures[user] != undefined) {
        document.getElementsByClassName('contactavatarsmall')[0].src = pictures[user];
        document.getElementsByClassName('npavatar')[0].src = pictures[user];
    }
    let container = document.getElementById('recentposts');
    data.posts.forEach(p => {
        let liked = false;
        if (p.type === 'repost' && p.username !=user && p.date > lastPost) {
            let foundPost = data.posts.find(function(obj) {
                return obj._id === p.postid;
            });
            let fp = {
                _id: foundPost._id,
                username: p.username+"/"+foundPost.username,
                content: foundPost.content,
                imgURL: foundPost.imgURL,
                verified: foundPost.verified,
                likes: foundPost.likes,
                reposts: foundPost.reposts,
                sentiment: foundPost.sentiment,
                type: "repost/"+foundPost.type,
                postid: " ",
                date: foundPost.date
            }
            if (data.likes.includes(foundPost._id)) liked = true;
            container.prepend(createPost(fp, liked, pictures[foundPost.username]));
            lastPost = p.date;
        }
        else if (p.username !=user && p.date > lastPost) {
            if (data.likes.includes(p._id)) liked = true;
            container.prepend(createPost(p, liked, pictures[p.username]));
            lastPost = p.date;
        }
    })
    let notif = document.getElementById('notcontainer');
    notif.replaceChildren();
    document.getElementById('notcounter').innerHTML = "0";
    data.notifications.forEach(n => {
        document.getElementById('notcounter').innerHTML = parseInt(document.getElementById('notcounter').innerHTML) + 1;
        notif.prepend(createNotification(n));
    })
});

socket.on('comments' , (data) => { 
    let container = document.getElementById('commentSection');
    container.replaceChildren();
    const newd = document.createElement("div");
    newd.onclick = function() {
        if (activeFeedtab == "mainfeed") {
            document.getElementById('posts').style.display = 'flex';
        }
        else if (activeFeedtab == "profile") document.getElementById('profileTab').style.display = 'flex';
        document.getElementById('commentSection').style.display = 'none';
    }
    newd.className = "gb";
    let html = '<img class="gbicon" src="./img/gb.png" alt="go back">' +
    '<h1 class="gbheader">Go Back</h1>'
    newd.innerHTML = html;
    container.append(newd);
    container.append(commentPost)

    if (data.comments != "none") {
        let pictures = data.profilepics[0].pictures;
        let h1Element = document.createElement('h1');
        h1Element.innerHTML = 'Comments:';
        h1Element.id = 'nrecentt3';
        container.appendChild(h1Element);
        data.comments.forEach(c => {
            let liked = false;
            if (data.likes.includes(c._id)) liked = true;
            container.append(createPost(c, liked, pictures[c.username]));
        })
    }
    document.getElementById('posts').style.display = 'none';
    document.getElementById('commentSection').style.display = 'block';
});

socket.on('profile' , (data) => { 
    let pictures = data.profilepics[0].pictures;
    if (data.info == "error") {
        ShowError("There was an error while loading profile, refresh the page")
    }
    else {
        document.getElementById('prver').style.display = 'none';
        document.getElementById('prName').innerHTML = data.info.name;
        document.getElementById('ppic').src = './img/avatarb.png';
        if (pictures[data.user] != undefined) document.getElementById('ppic').src = pictures[data.user];
        document.getElementsByClassName('prfollow')[0].innerHTML = "Followers: "+data.info.followers.length;
        document.getElementsByClassName('prfollow')[1].innerHTML = "Follows: "+data.info.follows.length;
        document.getElementById('unfollow').style.display = 'none';
        document.getElementById('follow').style.display = 'none'
        if (data.info.verified == "y") document.getElementById('prver').style.display = 'block';
        if (data.info.name != user && data.mainuser.follows.includes(data.info.name)) document.getElementById('unfollow').style.display = 'block';
        else if (data.info.name != user) document.getElementById('follow').style.display = 'block';
        let myposts = document.getElementById('profilePosts');
        let myreposts = document.getElementById('profileReposts');
        let mylikedposts = document.getElementById('profileLikedposts');
        myposts.replaceChildren();
        myreposts.replaceChildren();
        mylikedposts.replaceChildren();
        data.posts.forEach(p => {
            let liked = false;
            if (p.type === 'repost' && p.username == data.user) {
                let foundPost = data.posts.find(function(obj) {
                    return obj._id === p.postid;
                });
                let fp = {
                    _id: foundPost._id,
                    username: p.username+"/"+foundPost.username,
                    content: foundPost.content,
                    imgURL: foundPost.imgURL,
                    verified: foundPost.verified,
                    likes: foundPost.likes,
                    reposts: foundPost.reposts,
                    sentiment: foundPost.sentiment,
                    type: "repost/"+foundPost.type,
                    postid: " ",
                    date: foundPost.date
                }
                if (data.mainuser.likedposts.includes(foundPost._id)) liked = true;
                myreposts.prepend(createPost(fp, liked, pictures[foundPost.username]));
            }
            else if (p.username == data.user) {
                if (data.mainuser.likedposts.includes(p._id)) liked = true;
                myposts.prepend(createPost(p, liked, pictures[p.username]));
            }
            else if (data.info.likedposts.includes(p._id)) {
                if (data.mainuser.likedposts.includes(p._id)) liked = true;
                mylikedposts.prepend(createPost(p, liked, pictures[p.username]));
            }
        })
        let followers = document.getElementById('prfollowers');
        let follows = document.getElementById('prfollows');
        followers.replaceChildren();
        follows.replaceChildren();
        data.info.followers.forEach(f => {
            followers.append(createFollower(f, data.mainuser.follows.includes(f), pictures[f]));
        })
        data.info.follows.forEach(f => {
            follows.append(createFollower(f, data.mainuser.follows.includes(f), pictures[f]));
        })

    }
    if (data.user == user) {
        document.getElementById('profile').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
        document.getElementById('mainfeed').style.backgroundColor = '';
    }
    document.getElementById('posts').style.display = 'none';
    document.getElementById('profileTab').style.display ='flex';
});

socket.on('followResult' ,  (data) => {
    ShowError(data.info)
    if (data.info.includes("unfollowed") && data.type == 'main') {
        document.getElementById('follow').style.display = 'block';
        document.getElementById('unfollow').style.display = 'none';
        let c = parseInt(document.getElementsByClassName('prfollow')[0].innerHTML.match(/\d+/)[0]) - 1;
        document.getElementsByClassName('prfollow')[0].innerHTML = "Followers "+c;
    }
    else if (data.info.includes("followed") && data.type == 'main'){
        document.getElementById('follow').style.display = 'none';
        document.getElementById('unfollow').style.display = 'block';
        let c = parseInt(document.getElementsByClassName('prfollow')[0].innerHTML.match(/\d+/)[0]) + 1;
        document.getElementsByClassName('prfollow')[0].innerHTML = "Followers "+c;
    }
    if (document.getElementById(data.type).innerHTML == "Follow") {
        document.getElementById(data.type).innerHTML = "Unfollow";
    }
    else {
        document.getElementById(data.type).innerHTML = "Follow";
    }
});

socket.on('newPP' , (data) => {
    document.getElementById('nploading').style.display = 'none';
    ShowError(data.info);
    fileName = "";
    file="";
});

socket.on('notification' , (data) => {
    document.getElementById('notcounter')
    document.getElementById('notcounter').innerHTML = parseInt(document.getElementById('notcounter').innerHTML) + 1;
    let notif = document.getElementById('notcontainer');
    notif.prepend(createNotification(data));
});

socket.on('post' , (data) => {
    if (data.info != 'ok') ShowError(data.info)
    else {
        commentPost = createPost(data.post, data.liked, data.ppurl)
    }
    document.getElementById('profileTab').style.display = "none";
    commentPost.getElementsByClassName('pbtn')[1].style.display = "none";
    commentPost.getElementsByClassName('likes')[0].style.display = "none";
    commentPost.getElementsByClassName('likes')[1].style.display = "none";
    commentPost.getElementsByClassName('vc')[0].style.display = "none";
    commentPost.getElementsByClassName('likes')[2].style.marginLeft = "auto";
});

///////////////////////////////////////////////////////////////////////////Image upload////////////////////////////////////////////////////////////////////////
//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDg78xn8syiOR-zqHgT0taUY8m80QuiBTs",
    authDomain: "clearcall-4a28a.firebaseapp.com",
    projectId: "clearcall-4a28a",
    storageBucket: "clearcall-4a28a.appspot.com",
    messagingSenderId: "1049857542821",
    appId: "1:1049857542821:web:51c636237f4c7cd18c5b4c"
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const inp = document.querySelectorAll(".inp");


document.getElementById('addimg').addEventListener('click', () => {
    inp[0].click();
})

document.getElementById('ppic').addEventListener('click', () => {
    document.querySelector(".inp2").click();
})


//Getting image path from explorer
async function getImageData(e, t) {
    file = e.target.files[0];
    if (t == "prp") {
        file = await cropImage(file);
        fileName = Math.round(Math.random() * 9999) + file.name;
        uploadImg("","","prp")
        document.getElementById('nploading').style.display = 'flex';
    }
    else {
        let reader = new FileReader();
        reader.onload = function(e) {
            if (t == "p") {
                document.getElementById('postimgpreview').src = e.target.result;
                document.getElementById('prevpic').style.display = 'flex';
            }
            else {
                document.getElementById('Cpostimgpreview').src = e.target.result;
                document.getElementById('Cprevpic').style.display = 'flex';
            }
        };
        reader.readAsDataURL(file);
        fileName = Math.round(Math.random() * 9999) + file.name;
    }
};


//Uploading file to firebase bucket
function uploadImg(type, content, option){
    const storageRef = storage.ref().child("Files");
    const folderRef = storageRef.child(fileName);
    const uploadtask = folderRef.put(file);
    uploadtask.on(
    "state_changed",
    (snapshot) => {
        uploadedFileName = snapshot.ref.name;
    },
    (error) => {
        console.log(error);
    },
    () => {
        storage
        .ref("Files")
        .child(uploadedFileName)
        .getDownloadURL()
        .then((url) => {
            if (option == "p") {
                //send post to the server
                socket.emit('newpost', {
                    username: user,
                    content: content,
                    url: url,
                    verified: ver,
                    likes: "0",
                    reposts: "0",
                    sentiment: sentiment,
                    type: type,
                    postid: pid
                })
            }
            else {
                socket.emit('newProfilePic', {
                    username: user,
                    url: url
                })
            }
        });
    }
    );
}
///////////////////////////////////////////////////////////////////////////Image upload////////////////////////////////////////////////////////////////////////
    
document.getElementById('removepic').addEventListener('click', () => {
    document.getElementById('postimgpreview').src= "";
    fileName = "";
    file="";
    document.getElementById('prevpic').style.display= 'none';
    inp[0].value = "";
})

function createPost(p, liked, ppurl) {
    const newdiv = document.createElement("div");
    newdiv.className = "feedpost";
    let sentiment = '';
    let image = '';
    let verified = '';
    let comment = '';
    let repost = '';
    let vc = '';
    let rp = '';
    let user = '';
    let like = '<img src="./img/like.png" alt="" class="pbtn" onclick="like(this)">';
    let profilepicture = '<img src="./img/avatarb.png" alt="" class="postavatar">';
    if (ppurl != undefined) profilepicture = '<img src="'+ppurl+'" alt="" class="postavatar">'
    if (p.sentiment == "Bullish") sentiment = '<h1 class="sent">'+p.sentiment+'</h1>';
    else if (p.sentiment == "Bearish") sentiment = '<h1 class="sent2">'+p.sentiment+'</h1>';
    if (p.imgURL != " ") image = '<img src='+p.imgURL+' alt="" class="postpic">';
    if (p.verified == "y") verified = '<img src="./img/ver.png" alt="" class="verified">';
    if (liked) like = '<img src="./img/Rlike.png" alt="" class="pbtn" onclick="like(this)">';
    if (p.type != "c") {
        let c = p.type;
        if (p.type.includes('repost')) {
            c = p.type.split("/")[1]
        }
        comment = '<div class="likes">'+'<img src="./img/com.png" alt="" class="pbtn" onclick="comment(this)">'+'<h1 class="cc">'+c+'</h1>'+'</div>'
        if (c != "0") vc = '<h1 class="vc" onclick="viewComments(this)">View comments</h1>';
        repost = '<div class="likes">'+'<img src="./img/rp.png" alt="" class="pbtn" onclick="repost(this)">'+'<h1 class="cc">'+p.reposts+'</h1>'+'</div>'
    } 
    if (p.type.includes('repost')) {
        user = p.username.split("/")[1]
        rp = '<h1 class="rp">'+p.username.split("/")[0]+ ' reposted</h1>'
    }
    else {
        user = p.username
    }
    let html = '';
    html += rp+
    profilepicture+
            '<div class="ptop">'+
              '<h1 class="postername" onclick="viewProfile(this)">'+user+'</h1>'+
              verified+
              sentiment+
              '<h1 class="pdate">'+getDate(p.date)+'</h1>'+
            '</div>'+
            '<div class="content">'+
              '<h1 class="text">'+p.content+'</h1>'+
              image+
            '</div>'+
            '<div class="postbtns">'+
              comment+
              repost+
              '<div class="likes">'+
                like+
                '<h1 class="lc">'+p.likes+'</h1>'+
              '</div>'+
              '<h1 class="postid">'+p._id+'</h1>'+
            '</div>'+vc
    newdiv.innerHTML = html;
    if (p.type == "c") {
        newdiv.getElementsByClassName('likes')[0].style.marginLeft = 'auto';
    }
    return newdiv;
}

function createFollower(f, t, ppurl) {
    const newdiv = document.createElement("div");
    newdiv.className = "follower";
    let image = '<img src="./img/avatarb.png" alt="" class="postavatar">';
    if (ppurl != undefined) image = '<img src="'+ppurl+'" alt="" class="postavatar">'
    let unfollow = '<button id="'+f+'"class="unfollow" onclick="userFollow(this)">Follow</button>';
    let html = '';
    if (t) unfollow = '<button id="'+f+'"class="unfollow" onclick="userFollow(this)">Unfollow</button>';
    if (f == user) unfollow = '';
    html += 
        image+
        '<h1 class="postername" onclick="viewProfile(this)">'+f+'</h1>'+
        unfollow
    newdiv.innerHTML = html;
    return newdiv;
}

function createNotification(n) {
    const newdiv = document.createElement("div");
    newdiv.className = "notifw";
    let text = n.name+" started following you"
    if (n.type == "comment") text = n.name+" commented on your post";
    else if (n.type == "like") text = n.name+" liked your post";
    else if (n.type == "repost") text = n.name+" reposted your post";
    let html = 
    '<img src="./img/avatarb.png" alt="" class="postavatar2">'+
        '<h1 class="nottextinner" onclick="viewNotification(this)">'+text+'</h1>'+
        '<span class="deletenot" onclick="deleteNotification(this)">x</span>'+
        '<h2 class="notdets">'+n.postid+'</h1>'+
        '<h2 class="notdets">'+n.type+'</h1>'+
        '<h2 class="notdets">'+n._id+'</h1>'+
        '<h2 class="notdets">'+n.name+'</h1>'
    newdiv.innerHTML = html;
    return newdiv;
}

function getDate(d) {
    let date = new Date(d);
    let time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let day = date.getDate();
    let month = date.getMonth() + 1; 
    let year = date.getFullYear();
    let dateFormatted = `${time} ${day}/${month}/${year}`;
    return dateFormatted;
}

function like(t) {
    if (!t.src.endsWith('Rlike.png')) {
        t.src = "./img/Rlike.png"
        let n = parseInt(t.parentNode.getElementsByTagName('h1')[0].innerHTML) + 1;
        t.parentNode.getElementsByTagName('h1')[0].innerHTML = n;
        //Updating like counter
        socket.emit('updateLikes', {
            id: t.parentNode.parentNode.getElementsByClassName('postid')[0].innerHTML,
            amount: n,
            user: user,
            name: t.parentNode.parentNode.parentNode.getElementsByClassName('postername')[0].innerHTML,
            add: "y"
        })
    }
    else {
        t.src = "./img/like.png"
        let n = parseInt(t.parentNode.getElementsByTagName('h1')[0].innerHTML) - 1;
        t.parentNode.getElementsByTagName('h1')[0].innerHTML = n;
        //Updating like counter
        socket.emit('updateLikes', {
            id: t.parentNode.parentNode.getElementsByClassName('postid')[0].innerHTML,
            amount: n,
            user: user,
            add: "n"
        })
    }
}

function repost(t) {
    Rpost = t; 
    socket.emit('newpost', {
        username: user,
        type: "repost",
        postid: t.parentNode.parentNode.getElementsByClassName('postid')[0].innerHTML
    })
}

////////////////////////////////Serchbox code////////////////////////////////
document.getElementById("searchbarfeed").addEventListener("input", () => {
    let searchTerm = document.getElementById("searchbarfeed").value.toLowerCase();
    let items = document.querySelectorAll('.feedpost');
    console.log(items.length, searchTerm)

    items.forEach(function (item) {
      let title = item.querySelector('.postername').innerText.toLowerCase()+item.querySelector('.text').innerText.toLowerCase();

      if (title.includes(searchTerm)) {
        item.style.display = 'grid';
      } else {
        item.style.display = 'none';
      }
    });
})

function changeFeedTab(tab, s) {
    activeFeedtab = s.id;
    if (activeFeedtab == 'mainfeed') {
        //send posts request to the server
        socket.emit('feedrequest', {
            user: user
        })
    }
    else if (activeFeedtab == 'profile') {
        socket.emit('getProfileinfo', {
            user: user,
            mainuser: user
        })
    }
    document.getElementById('posts').style.display = 'none';
    document.getElementById('profileTab').style.display ='none';
    document.getElementById(tab).style.display ='flex';
    document.getElementById('mainfeed').style.backgroundColor = '';
    document.getElementById('profile').style.backgroundColor = '';
    s.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
}

document.getElementById('npIndicator').addEventListener('click', () => {
    socket.emit('feedrequest', {
        user: user
    })
    document.getElementById('npIndicator').style.display = 'none';
    document.getElementById('npIndicator').innerHTML = 'Show 0 new posts';
})

function changeProfileTab(t, id) {
    document.getElementsByClassName('prbtn')[0].style.borderBottom = '';
    document.getElementsByClassName('prbtn')[1].style.borderBottom = '';
    document.getElementsByClassName('prbtn')[2].style.borderBottom = '';
    document.getElementsByClassName('prbtn')[3].style.borderBottom = '';
    document.getElementsByClassName('prbtn')[4].style.borderBottom = '';
    document.getElementsByClassName('prbtn')[t].style.borderBottom = '2px solid #007bff';
    document.getElementById('profilePosts').style.display = 'none';
    document.getElementById('profileReposts').style.display = 'none';
    document.getElementById('profileLikedposts').style.display = 'none';
    document.getElementById('prfollowers').style.display= 'none';
    document.getElementById('prfollows').style.display= 'none';
    document.getElementById(id).style.display = 'block';
}

function viewProfile(t) {
    changeProfileTab('0' , 'profilePosts');
    socket.emit('getProfileinfo', {
        user: t.innerHTML,
        mainuser: user
    })
}

document.getElementById('profileGoBack').addEventListener('click', () => {
    activeFeedtab = 'mainfeed';
    document.getElementById('profileTab').style.display = 'none';
    document.getElementById('posts').style.display = 'flex';
    document.getElementById('mainfeed').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
    document.getElementById('profile').style.backgroundColor = '';
})

document.getElementById('follow').addEventListener('click', () => {
    let name = document.getElementById('prName').innerHTML;
    socket.emit('follow', {
        user: user,
        name: name,
        action: 'follow',
        type: "main"
    })
})

document.getElementById('unfollow').addEventListener('click', () => {
    let name = document.getElementById('prName').innerHTML;
    socket.emit('follow', {
        user: user,
        name: name,
        action: 'unfollow',
        type: "main"
    })
})

function userFollow(t) {
    socket.emit('follow', {
        user: user,
        name: t.parentNode.getElementsByClassName('postername')[0].innerHTML,
        action: t.innerHTML.toLowerCase(),
        type: t.id
    })
}

function cropImage(file) { //Crops the image to the center and converts it to 200x200 px
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const targetWidth = 200;
                const targetHeight = 200;
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                let x = 0, y = 0, w = 200, h = 200, size = 200;
            
                if (img.naturalWidth > img.naturalHeight) {
                    w = (size * img.naturalWidth) / img.naturalHeight;
                    x = -Math.abs(w - size) / 2;
                } else {
                    h = (size * img.naturalHeight) / img.naturalWidth;
                    y = -Math.abs(h - size) / 2;
                }
                
                ctx.drawImage(img, x, y, w, h);

                canvas.toBlob(function(blob) {
                    const croppedImageFile = new File([blob], file.name, { type: file.type });
                    resolve(croppedImageFile);
                }, file.type);
            };
        };

        reader.onerror = function(error) {
            reject(error);
        };
    });
}

document.getElementById('notificon').addEventListener('click', () => {
    if (document.getElementById('notificationpanel').style.display == 'flex') document.getElementById('notificationpanel').style.display = 'none';
    else document.getElementById('notificationpanel').style.display = 'flex';
})

function deleteNotification(t){
    np = true;
    socket.emit('deleteNotification', {
        id: t.parentNode.getElementsByClassName('notdets')[2].innerHTML
    })
    document.getElementById('notcounter').innerHTML = parseInt(document.getElementById('notcounter').innerHTML) - 1;
    t.parentNode.remove();
}

///////////////////////////////////Tools//////////////////////////////////////////////////////////////////
function changeTool(tab, t) {
    activetool = t.id;
    document.getElementById('dcf').style.backgroundColor = '';
    document.getElementById('ci').style.backgroundColor = '';
    document.getElementById('ec').style.backgroundColor = '';
    document.getElementById('gi').style.backgroundColor = '';
    t.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--panel-color');
    document.getElementById('dcft').style.display = 'none';
    document.getElementById('cit').style.display = 'none';
    document.getElementById('ect').style.display = 'none';
    document.getElementById('git').style.display= 'none';
    document.getElementById(tab).style.display = 'flex';
    document.getElementById('theader').innerHTML = t.innerHTML;
}

function calculateDCF() {
    let cashFlowsInput = document.getElementById("cashFlows").value;
    let discountRate = document.getElementById('discountRate').value;
    let terminalValue = document.getElementById('terminalValue').value;
    let cashFlows = cashFlowsInput.split(',').map(Number);
    // Validate inputs
    if (!Array.isArray(cashFlows) || cashFlows.length === 0) {
        ShowError("Fill out the cash flow values before proceeding");
    }
    else if (discountRate == "" || discountRate <= 0) {
        ShowError("Invalid discount rate provided");
    }
    else if (terminalValue == "" || terminalValue <= 0) {
        ShowError("Invalid terminal value provided");
    }
    else {
        let dcf = 0;
        for (var i = 0; i < cashFlows.length; i++) {
            dcf += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
        }
        dcf += terminalValue / Math.pow(1 + discountRate, cashFlows.length);

        document.getElementById('dcfresult').innerHTML = "DCF Value: "+dcf.toFixed(2);
        document.getElementById('dcfresult').style.display = 'block';
    }
}

function compoundInterestWithContributions() {
    cichart.destroy();

    let principal = parseFloat(document.getElementById("principal").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let time = parseFloat(document.getElementById("time").value);
    let contribution = parseFloat(document.getElementById("contribution").value);
    let contributionFrequency = document.getElementById("contributionFrequency").value;

    // Validate inputs
    if (typeof principal !== 'number' || isNaN(principal) || principal <= 0) {
        ShowError("Invalid principal amount provided");
    }
    else if (typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
        ShowError("Invalid interest rate provided");
    }
    else if (typeof time !== 'number' || isNaN(time) || time <= 0) {
        showError("Invalid time period provided");
    }
    else if (typeof contribution !== 'number' || isNaN(contribution) || contribution < 0) {
        showError("Invalid contribution amount provided");
    }
    else if (contributionFrequency !== 'monthly' && contributionFrequency !== 'yearly') {
        ShowError("Invalid contribution frequency provided. Use 'monthly' or 'yearly'");
    }
    else {
        // Calculate compound interest with contributions
        let totalAmount = principal;
        let totalInterest = 0;
        let balanceArray = [];

        if (contributionFrequency === 'monthly') {
            var periods = time * 12; // Convert years to months
            for (var i = 1; i <= periods; i++) {
                totalAmount += contribution;
                totalAmount *= (1 + rate / 100 / 12); // Calculate interest compounded monthly
                balanceArray.push(totalAmount.toFixed(2));
            }
            totalInterest = totalAmount - (principal + (contribution * periods));
        } else { // Yearly contributions
            for (var j = 1; j <= time; j++) {
                totalAmount += contribution;
                totalAmount *= (1 + rate / 100); // Calculate interest compounded yearly
                balanceArray.push(totalAmount.toFixed(2));
            }
            totalInterest = totalAmount - (principal + (contribution * time));
        }

        
            console.log(totalAmount.toFixed(2))
            console.log(totalInterest.toFixed(2))
        ///////////////////Creating the chart//////////////////////////////////////
        let options = {
            series: [{
            name: 'Total Balance',
            data: balanceArray
        }],
            chart: {
            height: 480,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: 'Total Balance',
            data: balanceArray
        }],
        yaxis: {
            labels: {
            style: {
                colors: 'var(--text-color)' // Set the color for y-axis labels
            }
            }
        },
        xaxis: {
            type: 'category',
            labels: {
                formatter: function (value) {
                    if (contributionFrequency === 'monthly') {
                        if (value % 12 === 0) { // Display year label every 12 months
                            return value / 12 + ' Years';
                        }
                    } else {
                        if (value % 1 === 0) { // Display each year label
                            return value + ' Years';
                        }
                    }
                    return ''; // Hide other labels
                },
                style: {
                    colors: 'var(--text-color)' // Set the color for y-axis labels
                }
            }
        },
        tooltip: {
            theme: 'dark', // You can use 'light' or 'dark' theme
            fillSeriesColor: true, // Fill the tooltip background with the color of the respective series
            style: {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff', // Text color
                background: '#333333', // Background color
            },
            y: {
                formatter: function (val) {
                    return "$" + val.toFixed(2); // Format y-axis values as currency
                }
            }
        }
        };
        
        cichart = new ApexCharts(document.querySelector("#cichart"), options);
        cichart.render();

        document.getElementById('ciresult').innerHTML = "Total Balance: $"+totalAmount.toFixed(2);
        document.getElementById('ciresult').style.display = 'block';
    }
}

function getEarnings(from, to) {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    let url = "https://financialmodelingprep.com/api/v3/earning_calendar?from="+from+"&to="+to+"&apikey=al1vxXjKBjpR6CJ4Ejuhudd0VuCoNBUC";
    return fetch(url, init)
    .then(response => response.json())
    .then(data => {
        container = document.getElementById('ECcontainer');
        container.replaceChildren();
        document.getElementById('loadingSpinnerEC').style.display = 'none';
        data.forEach(c => {
            if (c.time == 'amc') {
                container.append(createEarningsItem(c));
            }
        })
    })
    .catch(err => console.error(err));
}

function createEarningsItem(c) {
    const newdiv = document.createElement("div");
    newdiv.className = "ecitem";
    let html = '';
    let epsest = "-"
    if (c.epsEstimated != null) epsest = "$"+c.epsEstimated
    let eps = "-"
    if (c.eps != null) epsest = "$"+c.eps
    let revest = "-"
    if (c.revenueEstimated != null) revest = "$"+c.revenueEstimated
    let rev = "-"
    if (c.revenue != null) rev = "$"+c.revenue
    let fiscalDateEnding = new Date(c.fiscalDateEnding);
    let fiscalMonth = fiscalDateEnding.getMonth() + 1;
    let quarter;
    if (fiscalMonth >= 1 && fiscalMonth <= 3) {
        quarter = "Q1";
    } else if (fiscalMonth >= 4 && fiscalMonth <= 6) {
        quarter = "Q2";
    } else if (fiscalMonth >= 7 && fiscalMonth <= 9) {
        quarter = "Q3";
    } else {
        quarter = "Q4";
    }

    html += 
    '<div class="ecsymbol1">'+
      '<h1 class="ecs">'+c.symbol+'</h1>'+
    '</div>'+
    '<span class="lineec"></span>'+
    '<div class="ecsymbol2">'+
      '<h1 class="ecs">EPS</h1>'+
      '<h1 class="ecs3">Estimated: '+epsest+'</h1>'+
      '<h1 class="ecs3">Reported: '+eps+'</h1>'+
    '</div>'+
    '<span class="lineec"></span>'+
    '<div class="ecsymbol3">'+
      '<h1 class="ecs">Revenue</h1>'+
      '<h1 class="ecs3">Estimated: '+revest+'</h1>'+
      '<h1 class="ecs3">Reported: '+rev+'</h1>'+
    '</div>'+
    '<span class="lineec"></span>'+
    '<div class="ecsymbol4">'+
      '<h1 class="ecs">Report Date</h1>'+
      '<h1 class="ecs3">'+c.date+'</h1>'+
    '</div>'+
    '<span class="lineec"></span>'+
    '<div class="ecsymbol">'+
      '<h1 class="ecs">Quarter</h1>' +
      '<h1 class="ecs3">'+quarter+'</h1>' +
    '</div>';
    newdiv.innerHTML = html;
    return newdiv;
}

//////Event listeners for date change on the earnings calendar
document.getElementById('toEC').addEventListener('input', () => {
    if (document.getElementById("toEC").value >= document.getElementById("fromEC").value) {
        document.getElementById('ECcontainer').replaceChildren();
        document.getElementById('loadingSpinnerEC').style.display = 'block';
        getEarnings(document.getElementById("fromEC").value, document.getElementById("toEC").value);
    }
    else {
        ShowError("Please select a 'To' date that is after the 'From' date")
    }
})
document.getElementById('fromEC').addEventListener('input', () => {
    if (document.getElementById("toEC").value >= document.getElementById("fromEC").value) {
        document.getElementById('ECcontainer').replaceChildren();
        document.getElementById('loadingSpinnerEC').style.display = 'block';
        getEarnings(document.getElementById("fromEC").value, document.getElementById("toEC").value);
    }
    else {
        ShowError("Please select a 'From' date that is before the 'To' date")
    }
})

////////////////////Dividents calendar/////////////////////////////////////
function getDividents(from, to) {
    let header = new Headers().append('Accept', 'application/json');
    let init = {method: "GET", headers: header}
    let url = "https://financialmodelingprep.com/api/v3/stock_dividend_calendar?from="+from+"&to="+to+"&apikey=al1vxXjKBjpR6CJ4Ejuhudd0VuCoNBUC";
    return fetch(url, init)
    .then(response => response.json())
    .then(data => {
        container = document.getElementById('GIcontainer');
        container.replaceChildren();
        document.getElementById('loadingSpinnerGI').style.display = 'none';
        data.forEach(c => {
            if (!c.symbol.includes(".")) {
                container.append(createDividendItem(c));
            }
        })
    })
    .catch(err => console.error(err));
}

function createDividendItem(c) {
    const newdiv = document.createElement("div");
    newdiv.className = "ecitem";
    let html = '';
    let div = "-"
    if (c.dividend != null) div = "$"+c.dividend
    let adj = "-"
    if (c.adjDividend != null) adj = "$"+c.adjDividend
    
    html += 
    '<div class="ecsymbol1">'+
      '<h1 class="ecs">'+c.symbol+'</h1>'+
    '</div>'+
    '<span class="lineec"></span>'+
    '<div class="ecsymbol2">'+
      '<h1 class="ecs">Dividend</h1>'+
      '<h1 class="ecs3">Divident: '+div+'</h1>'+
      '<h1 class="ecs3">Adjusted: '+adj+'</h1>'+
    '</div>'+
    '<span class="lineec"></span>'+
    '<div class="ecsymbol4">'+
      '<h1 class="ecs">Payment Date</h1>'+
      '<h1 class="ecs3">'+c.paymentDate+'</h1>'+
    '</div>';
    newdiv.innerHTML = html;
    return newdiv;
}

//////Event listeners for date change on the divident calendar
document.getElementById('toGI').addEventListener('input', () => {
    if (document.getElementById("toGI").value >= document.getElementById("fromGI").value) {
        document.getElementById('GIcontainer').replaceChildren();
        document.getElementById('loadingSpinnerGI').style.display = 'block';
        getDividents(document.getElementById("fromGI").value, document.getElementById("toGI").value);
    }
    else {
        ShowError("Please select a 'To' date that is after the 'From' date")
    }
})
document.getElementById('fromGI').addEventListener('input', () => {
    if (document.getElementById("toGI").value >= document.getElementById("fromGI").value) {
        document.getElementById('GIcontainer').replaceChildren();
        document.getElementById('loadingSpinnerGI').style.display = 'block';
        getDividents(document.getElementById("fromGI").value, document.getElementById("toGI").value);
    }
    else {
        ShowError("Please select a 'From' date that is before the 'To' date")
    }
})