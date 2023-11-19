const ethers = require('ethers');

const mediscanAbi = require("@/abis/mediscan.json");
const erc20Abi = require("@/abis/erc20.json");

const ghoAddress = "0x35Ec07c86cE7641e23096FD7F493b96E528fB090";
const usdcAddress = "0xEbCC972B6B3eB15C0592BE1871838963d0B94278"
const mediscanAddress = "0xA1C0D7D78f6716BE785F08f4Dd56039c7285E700";

class Ethers {
    constructor() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.provider = provider
        this.signer = this.provider.getSigner();

        this.gho = new ethers.Contract(ghoAddress, erc20Abi, this.signer);
        this.usdc = new ethers.Contract(usdcAddress, erc20Abi, this.signer);
        this.mediscan = new ethers.Contract(mediscanAddress, mediscanAbi, this.signer);

        window.ethereum.on("accountsChanged", async () => {
            await this.connect();
            this.address = await this.signer.getAddress();
            window.location.reload();
        })
    }

    connect = async function () {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.provider = provider
        this.signer = this.provider.getSigner();

        await this.provider.send("eth_requestAccounts", []);
        this.address = await this.signer.getAddress();
    }

    approveGho = async function (amount) {
        try {
            const tx = await this.gho.approve(mediscanAddress, amount);
            await tx.wait();
            return true;
        } catch (err) {
            alert(err.reason);
            return err;
        }
    }

    approveUsdc = async function (amount) {
        try {
            const tx = await this.usdc.approve(mediscanAddress, amount);
            await tx.wait();
            return true;
        } catch (err) {
            alert(err.reason);
            return err;
        }
    }

    sendGhoToFaceHash = async function (faceHash, amount) {
        try {
            const tx = await this.mediscan.sendTokenToFaceHash(faceHash, ghoAddress, amount);
            await tx.wait();
            return true;
        } catch (err) {
            alert(err.reason);
            return err;
        }
    }
    sendUsdcToFaceHash = async function (faceHash, amount) {
        try {
            const tx = await this.mediscan.sendTokenToFaceHash(faceHash, usdcAddress, amount);
            await tx.wait();
            return true;
        } catch (err) {
            alert(err.reason);
            return err;
        }
    }

    payoutGhoForFaceHash = async function(faceHash, to) {
        try {
            console.log("face hash:_ ", faceHash, "gho: ", ghoAddress, "to: ", to)
            const tx = await this.mediscan.payoutTokenForFaceHash(faceHash, ghoAddress, to);
            await tx.wait();
            return true;
        } catch (err) {
            alert(err.reason);
            return err;
        }
    }

    payoutUsdcForFaceHash = async function(faceHash, to) {
        try {
            const tx = await this.mediscan.payoutTokenForFaceHash(faceHash, usdcAddress, to);
            await tx.wait();
            return true;
        } catch (err) {
            alert(err.reason);
            return err;
        }
    }

    toWei = function(amount) {
        return ethers.utils.parseUnits(amount, "ether") 
    }
}

export default Ethers;