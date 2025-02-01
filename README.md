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
    Maximizing Yields, Minimizing Effort on Supra Move.
    <br />
    <br />
    <!-- <a href="https://youtu.be/n_O28LvNU1I?si=Kdq1D9lt_t9Se_6d">View Demo</a> -->
    ·
    <a href="https://github.com/Devil02070/giga-protocol/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Devil02070/giga-protocol/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
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

[![Giga screenshot][product-screenshot-dark]](https://testnet-giga-ptotol.xyz)

In traditional DeFi yield farming, users must manually compound their liquidity pool (LP) rewards, which leads to:

Gas Inefficiency – Frequent manual compounding results in high transaction fees.
Lost Yield Opportunities – Delayed reinvestment means users miss out on maximizing their APY.
Complexity for Users – Managing LP rewards, harvesting, and reinvesting can be tedious.
Giga Protocol automates LP compounding on the Move language, ensuring optimal returns with minimal user intervention.


<p align="right">(<a href="#readme-top">Back to top</a>)</p>



### Built With

- [Supra Move][Move-url]
- [Nextjs][Next-url]

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up Giga protocol locally on your machine:

### Prerequisites

Ensure you have the following installed:

- Node.js (version 16+)
- Supra CLI for interacting with the Aptos blockchain
- Git for version control

## Installation

Follow these steps to compile, test, and deploy the contract on Aptos:

### 1. Compile the contract:

```bash
supra move tool compile --dev
```

### 2. Run contract tests:

```bash
supra move tool test
```

### 3. Deploy the contract:

Initialize the Supra account:

```bash
supra key generate-profile giga_protocol
```

Publish the contract:

```bash
supra move tool publish --package-dir /supra/configs/ts_workspace/giga-protocol/src/move --profile giga_protocol --url https://rpc-testnet.supra.com 
```


### 4. Start local development:

To run the project locally, follow these steps:

1. **Set up environment variables**: Ensure you have your `.env.local` file configured.
2. **Install dependencies and start the frontend**:

   ```bash
   npm install && npm run dev
   ```
---

Happy coding!

<p align="right">(<a href="#readme-top">Back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

We would like to express our gratitude to the following resources that have significantly contributed to our development journey:

- [Supra Docs](https://supra.com/developers/)

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/ajaythxkur/giga-protocol.svg?style=for-the-badge
[contributors-url]: https://github.com/Devil02070/giga-protocol/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ajaythxkur/giga-protocol.svg?style=for-the-badge
[forks-url]: https://github.com/Devil02070/giga-protocol/network/members
[stars-shield]: https://img.shields.io/github/stars/ajaythxkur/giga-protocol.svg?style=for-the-badge
[stars-url]: https://github.com/Devil02070/giga-protocol/stargazers
[issues-shield]: https://img.shields.io/github/issues/ajaythxkur/giga-protocol.svg?style=for-the-badge
[issues-url]: https://github.com/Devil02070/giga-protocol/issues
[github-url]: https://github.com/Devil02070/giga-protocol
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Move]: media-kit/move.png?style=for-the-badge
[Move-url]: https://github.com/Entropy-Foundation/aptos-core/tree/main/aptos-move
[architecture-screenshot]: media-kit/architecture.jpeg
[product-screenshot-dark]: media-kit/demo.jpeg
