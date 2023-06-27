import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

function nasumicnoIme() {
  const pridjevi = [
    "šumski", "skriveni", "gorki", "magloviti", "tihi", "prazni", "suhi", "tamni",
    "ljetni", "ledeni", "nježni", "tih", "bijeli", "svježi", "proljetni", "zimski",
    "strpljivi", "sumrak", "svitanje", "grimizni", "zamagljeni", "otrovali", "plavi",
    "naduvani", "slomljeni", "hladni", "vlažni", "padajući", "mrzli", "zelene", "dugi",
    "kasni", "postojan", "hrabar", "mali", "jutarnji", "blatnjavi", "stari", "crveni",
    "grubi", "miran", "mali", "sjajni", "tucajući", "stidljiv", "lutajući",
    "venuli", "divlji", "crni", "mladi", "sveti", "usamljen", "mirisan",
    "stari", "snježni", "ponosni", "cvjetni", "nemiran", "božanski", "poliran",
    "drevni", "ljubičasti", "živahni", "bezimeni"
  ];
  const biljke = [
    "vodopad", "rijeka", "povjetarac", "mjesec", "kiša", "vjetar", "more", "jutro",
    "snijeg", "jezero", "sumrak", "bor", "sjena", "list", "svitanje", "sjaj",
    "šuma", "brdo", "oblak", "livada", "sunce", "čistina", "ptica", "potok",
    "leptir", "grm", "rosa", "prašina", "polje", "vatra", "cvijet", "svjetlok",
    "pero", "trava", "magla", "led", "planina", "noć", "ribnjak", "tama",
    "pahulja", "tišina", "zvuk", "nebo", "oblik", "val", "voda", "divlji cvijet",
    "val", "voda", "rezonanca", "sunce", "drvo", "san", "trešnja", "drvo", "magla", "mraz", "glas", "papir", "žaba",
    "dim", "zvijezda"
  ];
  const pridjev = pridjevi[Math.floor(Math.random() * pridjevi.length)];
  const biljka = biljke[Math.floor(Math.random() * biljke.length)];
  return pridjev + biljka;
}

function nasumicnaBoja() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: nasumicnoIme(),
      color: nasumicnaBoja(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("WF3VxTLDeJaaDAKd", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Moj Chat</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }
}

export default App;
