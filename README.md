<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Devil02070/giga-protocol">
    <img src="media-kit/logo.jpeg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Giga Protocol 🦾</h3>

  <p align="center">
    A decentralized yield optimization protocol similar to Beefy.
    <br />
    <br />
    <!-- <a href="https://youtu.be/n_O28LvNU1I?si=Kdq1D9lt_t9Se_6d">View Demo</a> -->
    ·
    <a href="https://github.com/Devil02070/meowfi/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Devil02070/meowfi/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![MeowFi screenshot][product-screenshot]](https://testnet-giga-ptotol.xyz)
[![MeowFi screenshot][product-screenshot-dark]](https://testnet-giga-ptotol.xyz)

Giga Protocol is a decentralized, multi-chain yield optimization platform that helps users maximize returns on their crypto assets. It automates compounding, optimizes gas costs, and provides seamless integration with multiple DeFi platforms.

Key Features:

- Auto-compounding to maximize APY
- Secure smart contracts with audits
- Low fees & gas optimization
- Governance & staking incentives


<p align="right">(<a href="#readme-top">Back to top</a>)</p>



### Built With

- [Aptos Move][Move-url]
- [Nextjs][Next-url]

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up Giga protocol locally on your machine:

### Prerequisites

Ensure you have the following installed:

- Node.js (version 16+)
- Aptos CLI for interacting with the Aptos blockchain
- Git for version control

## Installation

Follow these steps to compile, test, and deploy the contract on Aptos:

### 1. Compile the contract:

```bash
aptos move compile --dev
```

### 2. Run contract tests:

```bash
aptos move test
```

### 3. Deploy the contract:

Initialize the Aptos environment:

```bash
aptos init --network devnet
```

Set the publisher profile and address:

```bash
PUBLISHER_PROFILE=default
PUBLISHER_ADDR=0x$(aptos config show-profiles --profile=$PUBLISHER_PROFILE | grep 'account' | sed -n 's/.*"account": \"\(.*\)\".*/\1/p')
```

Publish the contract by creating an object and deploying the package:

```bash
aptos move create-object-and-publish-package \
   --address-name my_addrx \
   --named-addresses my_addrx=$PUBLISHER_ADDR \
   --profile $PUBLISHER_PROFILE \
   --assume-yes
```

### 4. Update the contract:

Set the contract object address:

```bash
CONTRACT_OBJECT_ADDR="your_contract_object_address_here"
```

Run the following command to upgrade the contract:

```bash
aptos move upgrade-object-package \
   --object-address $CONTRACT_OBJECT_ADDR \
   --named-addresses my_addrx=$CONTRACT_OBJECT_ADDR \
   --profile $PUBLISHER_PROFILE \
   --assume-yes
```

### 4. Start local development:

To run the project locally, follow these steps:

1. **Set up environment variables**: Ensure you have your `.env.local` file configured.
2. **Install dependencies and start the frontend**:

   ```bash
   cd frontend && npm install && npm run dev
   ```
---

Happy coding!

<p align="right">(<a href="#readme-top">Back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

We would like to express our gratitude to the following resources that have significantly contributed to our development journey:

- [Aptos Docs](https://aptos.dev)
- [Aptos Learn](https://learn.aptoslabs.com)

### Specially

- [Aptos dev discussions](https://github.com/aptos-labs/aptos-developer-discussions/discussions)

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/ajaythxkur/wiz_protocol.svg?style=for-the-badge
[contributors-url]: https://github.com/Devil02070/meowfi/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ajaythxkur/meowfi.svg?style=for-the-badge
[forks-url]: https://github.com/Devil02070/meowfi/network/members
[stars-shield]: https://img.shields.io/github/stars/ajaythxkur/meowfi.svg?style=for-the-badge
[stars-url]: https://github.com/Devil02070/meowfi/stargazers
[issues-shield]: https://img.shields.io/github/issues/ajaythxkur/meowfi.svg?style=for-the-badge
[issues-url]: https://github.com/Devil02070/meowfi/issues
[github-url]: https://github.com/Devil02070/meowfi
[product-screenshot]: media-kit/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Move]: media-kit/move.png?style=for-the-badge
[Move-url]: https://aptos.dev/en/build/smart-contracts
[architecture-screenshot]: media-kit/architecture.jpeg
[product-screenshot-dark]: media-kit/demo.jpeg
