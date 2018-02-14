export default class IPSMessage {
  constructor(message) {
    this.message = message['Message'];
    this.senderID = Number.parseInt(message['SenderID']);
    this.data = message['Data'];
  }
}