<<<<<<< HEAD
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { start } = require('repl');
// import { open } from 'node:fs/promises';
const app = express()
const port = 3000
var services = [];
var peopleLS = [];
loadServices();
loadPeople();

function loadServices() {
  services = [];
  let fs = require('fs');
  let filename = "db/services.txt";
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    data = data.split("\n");
    for (let i = 0; i < data.length; i++) {
      services.push({date: data[i].split("|")[0], link: data[i].split("|")[1], performers: data[i].split("|")[2]});
    }
    // console.log(services);
  });
}

function loadPeople() {
  peopleLS = [];
  let fs = require('fs');
  let filename = "db/people.txt";
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    data = data.split("\n");
    for (let i = 0; i < data.length; i++) {
      peopleLS.push(data[i].toLowerCase());
    }
    // console.log(peopleLS);
  });
}

function pickPeople(name) {
  let namesContainingTxt = [];
  for (i in peopleLS) {
    if (peopleLS[i].includes(name)) {
      namesContainingTxt.push(peopleLS[i])
    }
  }
  return namesContainingTxt;
}

function addService(date, url, people) {
  date = date.split("-");
  date.push(date.shift())
  date = date.join('/');
  const fs = require('fs')
  fs.appendFile("db/services.txt", "\n" + date + "|" + url + "|" + people, err => {
    if (err) {
      throw err
    }
  })
}

function addPeople(people) {
  const fs = require('fs')
  fs.appendFile("db/people.txt", "\n" + people.replace(new RegExp(",", 'g'), "\n"), err => {
    if (err) {
      throw err
    }
  })
}

function pickServicesAccordingToFilters(startDate, endDate, people) {
  let mes = false;
  let servicesUnderFilters = [];
  startDate = startDate.split("-");
  startDate.push(startDate.shift());
  endDate = endDate.split("-");
  endDate.push(endDate.shift());
  people = people.split(",").map(element => {
    return element.toLowerCase();
  });
  // console.log(startDate, endDate);
  for (i in services) {
      let startDateTotalValue = parseInt(startDate[0] * 35 + startDate[1] + startDate[2] * 5);
      let evaluatingDateTotalValue = parseInt(services[i].date.split("/")[0] * 35 + services[i].date.split("/")[1] + services[i].date.split("/")[2] * 5);
      let endDateTotalValue = parseInt(endDate[0] * 35 + endDate[1] + endDate[2] * 5);
      if ((startDate == "" && evaluatingDateTotalValue <= endDateTotalValue) || (endDate == "" && evaluatingDateTotalValue >= startDateTotalValue) || (startDate == "" && endDate == "") || (evaluatingDateTotalValue >= startDateTotalValue && evaluatingDateTotalValue <= endDateTotalValue)) {
          let performers = services[i].performers.replace("\r", "").toLowerCase();
          // console.log(performers, people);
          // console.log(people.every(elem => performers.includes(elem)));
          mes = false;
          for (j in people) {
            if (performers.includes(people[j]) == false) {
              mes = true;
              break
            }
          }
          if (mes == false) {
            servicesUnderFilters.push(services[i]);
          }
      }
  }
  // console.log(servicesUnderFilters, "wow")
  return servicesUnderFilters;
}

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// let filehandle;
// try {
//   filehandle = await open('thefile.txt', 'r');
// } finally {
//   await filehandle?.close();
// }

app.use(express.static('src'));
app.use(express.static('db'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.post('/serviceURLs', (req, res) => {
  // console.log(req.body);
  // console.log(pickServicesAccordingToFilters(req.body.startDate, req.body.endDate, req.body.people));
  if (services.slice(10 * req.body.x, 10 * req.body.x + 10).length == 0) {
    res.status(404).send(["No more"]);
  } else {
    res.status(404).send(pickServicesAccordingToFilters(req.body.startDate, req.body.endDate, req.body.people).slice(10 * req.body.x, 10 * req.body.x + 10));
  }
})

app.post('/giveMePeople', (req, res) => {
  console.log(req.body);
  console.log(pickPeople(req.body.name));
  if (req.body.name == "") {
    res.status(404).send([]);
  } else {
    res.status(404).send(pickPeople(req.body.name));
  }
})

app.post('/hereIsNewService', (req, res) => {
  addService(req.body.date, req.body.url, req.body.people);
  addPeople(req.body.people);
  loadServices();
  loadPeople();
  // console.log(services, peopleLS);
  res.status(404).send([]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
=======
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { start } = require('repl');
// import { open } from 'node:fs/promises';
const app = express()
const port = 3000
var services = [];
var peopleLS = [];
loadServices();
loadPeople();

function loadServices() {
  services = [];
  let fs = require('fs');
  let filename = "db/services.txt";
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    data = data.split("\n");
    for (let i = 0; i < data.length; i++) {
      services.push({date: data[i].split("|")[0], link: data[i].split("|")[1], performers: data[i].split("|")[2]});
    }
    // console.log(services);
  });
}

function loadPeople() {
  peopleLS = [];
  let fs = require('fs');
  let filename = "db/people.txt";
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    data = data.split("\n");
    for (let i = 0; i < data.length; i++) {
      peopleLS.push(data[i].toLowerCase());
    }
    // console.log(peopleLS);
  });
}

function pickPeople(name) {
  let namesContainingTxt = [];
  for (i in peopleLS) {
    if (peopleLS[i].includes(name)) {
      namesContainingTxt.push(peopleLS[i])
    }
  }
  return namesContainingTxt;
}

function addService(date, url, people) {
  date = date.split("-");
  date.push(date.shift())
  date = date.join('/');
  const fs = require('fs')
  fs.appendFile("db/services.txt", "\n" + date + "|" + url + "|" + people, err => {
    if (err) {
      throw err
    }
  })
}

function addPeople(people) {
  const fs = require('fs')
  fs.appendFile("db/people.txt", "\n" + people.replace(new RegExp(",", 'g'), "\n"), err => {
    if (err) {
      throw err
    }
  })
}

function pickServicesAccordingToFilters(startDate, endDate, people) {
  let servicesUnderFilters = [];
  startDate = startDate.split("-");
  startDate.push(startDate.shift());
  endDate = endDate.split("-");
  endDate.push(endDate.shift());
  people = people.split(",").map(element => {
    return element.toLowerCase();
  });
  // console.log(startDate, endDate);
  for (i in services) {
      let startDateTotalValue = parseInt(startDate[0] * 35 + startDate[1] + startDate[2] * 5);
      let evaluatingDateTotalValue = parseInt(services[i].date.split("/")[0] * 35 + services[i].date.split("/")[1] + services[i].date.split("/")[2] * 5);
      let endDateTotalValue = parseInt(endDate[0] * 35 + endDate[1] + endDate[2] * 5);
      if ((startDate == "" && evaluatingDateTotalValue <= endDateTotalValue) || (endDate == "" && evaluatingDateTotalValue >= startDateTotalValue) || (startDate == "" && endDate == "") || (evaluatingDateTotalValue >= startDateTotalValue && evaluatingDateTotalValue <= endDateTotalValue)) {
          let performers = services[i].performers.replace("\r", "").split(",").map(element => {
            return element.toLowerCase();
          });
          // console.log(performers, people);
          // console.log(people.every(elem => performers.includes(elem)));
          if (people.every(elem => performers.includes(elem)) == true || people == "")  {
            servicesUnderFilters.push(services[i]);
          }
      }
  }
  // console.log(servicesUnderFilters)
  return servicesUnderFilters;
}

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// let filehandle;
// try {
//   filehandle = await open('thefile.txt', 'r');
// } finally {
//   await filehandle?.close();
// }

app.use(express.static('src'));
app.use(express.static('db'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/src/index.html")
})

app.post('/serviceURLs', (req, res) => {
  // console.log(req.body);
  // console.log(pickServicesAccordingToFilters(req.body.startDate, req.body.endDate, req.body.people));
  if (services.slice(10 * req.body.x, 10 * req.body.x + 10).length == 0) {
    res.status(404).send(["No more"]);
  } else {
    res.status(404).send(pickServicesAccordingToFilters(req.body.startDate, req.body.endDate, req.body.people).slice(10 * req.body.x, 10 * req.body.x + 10));
  }
})

app.post('/giveMePeople', (req, res) => {
  console.log(req.body);
  console.log(pickPeople(req.body.name));
  if (req.body.name == "") {
    res.status(404).send([]);
  } else {
    res.status(404).send(pickPeople(req.body.name));
  }
})

app.post('/hereIsNewService', (req, res) => {
  addService(req.body.date, req.body.url, req.body.people);
  addPeople(req.body.people);
  loadServices();
  loadPeople();
  // console.log(services, peopleLS);
  res.status(404).send([]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
>>>>>>> ed2f3da5dc17b818a629a66ff2e7fb3311587eab
