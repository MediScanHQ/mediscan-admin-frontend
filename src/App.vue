<template>
  <div v-if="loading" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <button class="wallet-btn" @click="connectWallet">
    {{
      this.address !== ""
        ? `${this.address.substring(0, 12)}...`
        : "Connect wallet"
    }}
  </button>
  <!-- Logo -->
  <img
    class="logo"
    src="md2.png"
    alt="Logo"
    style="display: block; margin: 20px auto"
  />

  <p class="title">{{ label }}</p>
  <!-- Toggle Button -->
  <button class="btn toggle-btn" @click="toggleLabel">Change role</button>

  <!-- Input for "government" -->
  <div v-if="label === 'Insurance'">
    <input v-model="faceHash" type="text" placeholder="faceHash..." />
    <select v-model="selectedOption" class="selection">
      <option value="GHO">GHO</option>
      <option value="DAI">DAI</option>
      <option value="USDC">USDC</option>
      <option value="AAVE">AAVE</option>
    </select>
    <input v-model="amount" type="text" placeholder="amount" />
    <div>
      <button class="btn pay-btn" @click="pay">Pay</button>
    </div>
  </div>
  <div v-if="label === 'Payment Admin'">
    <input v-model="faceHash" type="text" placeholder="faceHash..." />
    <input v-model="to" type="text" placeholder="to..." />
    <select v-model="selectedOption" class="selection">
      <option value="GHO">GHO</option>
      <option value="DAI">DAI</option>
      <option value="USDC">USDC</option>
      <option value="AAVE">AAVE</option>
    </select>
    <div>
      <button class="btn pay-btn" @click="payout">Payout</button>
    </div>
  </div>
</template>

<script>
import Ethers from "@/services/ethers";

export default {
  name: "App",
  data() {
    return {
      label: "Insurance",
      ethers: Object,
      address: "",
      selectedOption: "GHO",
      faceHash: "",
      amount: null,
      loading: false,
      to: "",
    };
  },
  async mounted() {
    const ethers = new Ethers();
    await ethers.connect();
    this.ethers = ethers;
    this.address = ethers.address;
  },
  methods: {
    toggleLabel() {
      this.label = this.label === "Insurance" ? "Payment Admin" : "Insurance";
    },
    async pay() {
      if (this.selectedOption == "GHO") {
        this.loading = true;
        const value = this.ethers.toWei(this.amount);
        await this.ethers.approveGho(value);
        await this.ethers.sendGhoToFaceHash(
          "0x0664b3bef248fa8e085d6e94332c9ddd0e7a0a52ea025306ddfbde4200adb107",
          value
        );
        this.loading = false;
        alert("Transfer successful");
      } else if (this.selectedOption == "USDC") {
        this.loading = true;
        const value = this.ethers.toWei(this.amount);
        await this.ethers.approveUsdc(value);
        await this.ethers.sendUsdcToFaceHash(
          "0x0664b3bef248fa8e085d6e94332c9ddd0e7a0a52ea025306ddfbde4200adb107",
          value
        );
        this.loading = false;
        alert("Transfer successful");
      }
    },
    async payout() {
      if (this.selectedOption == "GHO") {
        this.loading = true;
        await this.ethers.payoutGhoForFaceHash(
          "0x0664b3bef248fa8e085d6e94332c9ddd0e7a0a52ea025306ddfbde4200adb107",
          this.to
        );
        alert("Transfer successful");
        this.loading = false;
      } else if (this.selectedOption == "USDC") {
        this.loading = true;
        await this.ethers.payoutUsdcForFaceHash("0x0664b3bef248fa8e085d6e94332c9ddd0e7a0a52ea025306ddfbde4200adb107", this.to)
        alert("Transfer successful");
        this.loading = false;
      }
    },
  },
};
</script>

<style>
body {
  background-color: #040e1c;
}
p {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  width: 20% !important;
}
.title {
  color: white;
}
.btn {
  background-color: rgb(56, 9, 127);
  color: white;
  border: 0;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
}
.toggle-btn {
  margin-bottom: 30px;
}
.pay-btn {
  margin-top: 20px;
}
.wallet-btn {
  color: white;
  border: 0;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  border: 1px solid blue;
  background-color: transparent;
}
input {
  background-color: transparent;
  color: white;
  border-radius: 5px;
  border: 1px solid blue;
}
.selection {
  background-color: transparent;
  color: white;
  border-radius: 5px;
  border: 1px solid blue;
}
.spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(
    0,
    0,
    0,
    0.5
  ); /* Add a semi-transparent background to overlay on other views */
  z-index: 9999;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
