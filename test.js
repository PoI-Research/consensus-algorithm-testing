const Web3 = require("web3");
const prompt = require("prompt-sync")();
const url = "http://localhost:8545";
const web3 = new Web3(url);
const address = "0x9Ab9B10D246B27fe07f1346580C1CEF59070AF6c";
const abi = [
    {
        inputs: [],
        name: "increment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        inputs: [],
        name: "getCounter",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];

const contract = new web3.eth.Contract(abi, address);
contract.methods
    .getCounter()
    .call()
    .then((counter) => {
        console.log(counter);
    });

web3.eth.personal.newAccount("123").then(async (pubKey) => {
    console.log("Send ether to: ", pubKey);
    await web3.eth.personal.unlockAccount(pubKey, "123", 600);
    prompt("Hit enter once done...");

    let counter = await contract.methods.getCounter().call();
    console.log("Counter: ", counter);
    const time = [];
    for (let i = 0; i < 100; i++) {
        const startTime = new Date().getTime();

        let latestCounter = await contract.methods.getCounter().call();
        await contract.methods
            .increment()
            .send({ from: pubKey }).then(async (receipt) => {
                while (counter === latestCounter) {
                    latestCounter = await contract.methods.getCounter().call();
                }
                const endTime = new Date().getTime();
                const timeTaken = endTime - startTime;
                console.log("Time taken:", timeTaken);
                counter = latestCounter;
                time.push(timeTaken);
            }).catch((error) => {
                console.log(error);
            });
    }

    console.log("Average time: ", time.reduce((a, b) => a + b, 0) / time.length);
});
