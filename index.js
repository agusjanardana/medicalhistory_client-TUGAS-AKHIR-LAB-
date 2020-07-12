// init socket io client / hanya mendengar saja
var io = require('socket.io-client');

// init listening socket / connect ke alamat server 
var socket = io.connect('http://localhost:3000');

const CryptoJS = require("crypto-js");

// import model
const BlockChain = require('./Blockchain.js');
const Block = require('./Block.js');

// init blockchain / model
const blockchain = new BlockChain(); // blockchain mengandung semua yang ada di Blockchain.js

// untuk mengubungkan client ke server
socket.on('connect', function () {
    console.log('connected to server');
    socket.on('clientevent', function (data) { // menerima emit dari server grup client event
        // Decypt
        var bytes = CryptoJS.AES.decrypt(data, 'kunci rahasia');
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        //var block = new Block(data.index, data.data, data.timestamp, data.nonce, data.hash, data.previous_hash); // memasukkan ke fungsi Block.js
        var block = new Block(decryptedData.index, decryptedData.data, decryptedData.timestamp, decryptedData.nonce, decryptedData.hash, decryptedData.previous_hash);
        var previous_block = blockchain.getNewestBlockFromBlockchain();

        if (block.validateBlock(block, previous_block) != 0) {
            console.log('error code : ' + block.validateBlock(block, previous_block));
        } else {
            blockchain.addBlock(block);
            blockchain.showLatestBlock();
        }
    });
});