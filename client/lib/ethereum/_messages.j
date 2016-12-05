import {BlockChat, MessageStorePromise} from './deployed';
import {keyManager as keys} from './keys';

MessageCollection = new Mongo.Collection('bc_messages', {connection: null});
ConversationCollection = new Mongo.Collection('bc_conversations', {connection: null});

if(typeof PersistentMinimongo !== 'undefined') {
  new PersistentMinimongo(MessageCollection);
  new PersistentMinimongo(ConversationCollection);
}

class MessagesManager {
  constructor(address) {
    this.address = address;
    MessageStorePromise.then((ms) => this.messageStore = ms);

    this.reloadMessageFilter();
  }

  sendMessage(recipient, payload) {
    var address;
    var timestamp;
    return keys.getAddressForRecipient(recipient)
      .then((a) => {
        address = a;
        return keys.encryptPayload(address, payload)
      })
      .then((encrypted) => {
        timestamp = Math.floor(+new Date()/1000);
        const hash = this.recipientHash(timestamp, address);

        return BlockChat.sendMessage(encrypted, timestamp, hash, {from: this.address, gas: 1000000});
      })
      .then(() => {
        return this.saveMessage({sender: this.address, recipient: address, payload: payload, timestamp: timestamp});
      });
  }

  reloadMessageFilter(addedConversation) {
    if (this.messagesFilter)
      this.messagesFilter.stopWatching();

    // var conversations = Conversations.find().fetch().map(c => { return c.address; });
    // Is it performant without filtering to only known conversations?
    this.messagesFilter = BlockChat.NewMessage({}, {fromBlock: this.lastWatchedBlock, toBlock: 'latest'});
    this.listenForMessages();
    this.fetchPastMessages();
  }

  listenForMessages() {
    this.messagesFilter.watch((err, ev) => {
      if (err)
        return console.log('ERROR', err);
      this.processEvent(ev);
      lastWatchedBlock = ev.blockNumber;
    });
  }

  fetchPastMessages() {
    this.messagesFilter.get((err, ev) => this.processEvent(ev));
  }

  processEvent(ev) {
    if (ev && ev.args && this.recipientHash(ev.args.timestamp, this.address) == ev.args.recipientHash) {
      this.getMessage(ev.args.messageID);
    }
  }

  getMessage(messageID, hash) {
    this.messageStore.getMessage(messageID)
      .then(([sender, payload, timestamp, _hash]) => {
        if (hash != hash)
          throw new Error("Unexpected message hash");

        var promisedMessage = {
            payload: keys.decryptPayload(payload, this.address),
            sender: sender,
            recipient: this.address,
            timestamp: parseInt(timestamp.valueOf())}

        return Promise.allProperties(promisedMessage);
      })
      .then((m) => this.saveMessage(m));
  }

  saveMessage(message) {
    var _id = CryptoJS.SHA256(message.payload+message.sender+message.timestamp).toString();

    message.incoming = message.recipient == this.address;
    const conv = message.incoming ? message.sender : message.recipient;
    message.conversationId = `c_${conv}`;

    MessageCollection.upsert(`m_${_id}`, message);
    ConversationCollection.upsert(message.conversationId, {address: conv, lastMessage: message.timestamp});
    return Promise.resolve();
  }

  get lastBlockKey() {
    return `lB_${this.address}`;
  }

  get lastWatchedBlock() {
    return Session.get(this.lastBlockKey) || EthBlocks.latest.number;
  }

  set lastWatchedBlock(block) {
    return Session.setPersistent(this.lastBlockKey, block);
  }

  recipientHash(timestamp, recipient) {
    return '0x'+CryptoJS.SHA256(timestamp+recipient).toString();
  }
}

export const Messages = MessageCollection;
export const MessageManager = MessagesManager;
export const Conversations = ConversationCollection;
