const form = document.getElementById("vote-form");
const keys = {
  pusherKey: "29e069446f8d6c4be626",
  pusherCluster: "ap2"
};

//Form submit listener
const chartContainer = document.querySelector("#chartContainer");

form.addEventListener("submit", e => {
  const choice = document.querySelector("input[name=os]:checked").value;
  const data = { os: choice };
  fetch("http://localhost:3000/poll", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
  e.preventDefault();
});
let dataPoints = [];
fetch("http://localhost:3000/poll")
  .then(res => res.json())
  .then(dataPt => {
    dataPoints = dataPt.votes.map(dataobj => {
      const newVal = {};
      newVal.y = parseInt(dataobj.points);
      newVal.label = dataobj.os;
      return newVal;
    });
    const totalVotes = dataPoints.reduce((acc, curr) => {
      return acc + curr.y;
    }, 0);
    if (chartContainer) {
      const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "theme2",
        title: {
          text: `Total Votes ${totalVotes}`
        },
        data: [
          {
            type: "column",
            dataPoints
          }
        ]
      });

      chart.render();

      var pusher = new Pusher(keys.pusherKey, {
        cluster: keys.pusherCluster
      });
      var channel = pusher.subscribe("os-poll");
      channel.bind("os-vote", function(data) {
        dataPoints = dataPoints.map(x => {
          if (x.label == data.os) {
            x.y += data.points;
          }
          return x;
        });

        chart.render();
      });
    }
  })

  .catch(err => console.log(err));
