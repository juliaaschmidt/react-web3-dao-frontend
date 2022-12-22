import { useEffect, useState, useReducer } from "react";
import "../App.css";
import "../index.css";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";

import TakePart from "../Components/TakePart";
import ReadyToPropose from "../Components/ReadyToPropose";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

import MyNftTokenAbi from "../Contracts/MyNftToken.json";
import MyGovernorAbi from "../Contracts/MyGovernor.json";
import { GOV_CONTRACT, TOKEN_CONTRACT } from "../contracts-config.js";
import SimpleSnackbar from "../Components/SimpleSnackbar";
import "./proposals.css";
import { isAddress } from "ethers/lib/utils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import web3 from "../web3";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {},
}));

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isGovHolder, setIsGovHolder] = useState(null);
  const [isDelegate, setIsDelHolder] = useState(null);
  const [amountRaised, setAmountRaised] = useState(null);
  const [snackbar, setSnackbarAlert] = useState(false);
  const [rejection, setRejection] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txLink, setTxLink] = useState(null);
  const [waitForMint, setWaitForMint] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [isProposer, setIsProposer] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      setRerender(!rerender);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const readNfts = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          TOKEN_CONTRACT,
          MyNftTokenAbi.abi,
          signer
        );

        console.log("Initialize reading wallet");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const balance = await nftContract.balanceOf(accounts[0]);
        if (parseInt(balance) > 0) {
          setIsGovHolder(true);
        }
        if (parseInt(balance) >= 2) {
          setIsProposer(true);
          setIsGovHolder(true);
        }

        if (parseInt(balance) == 0) {
          console.log("Please by some Governance Tokens!");
          setIsGovHolder(false);
          setSnackbarAlert(true);
        }
        console.log("NFT count: ", parseInt(balance));
        console.log("isGovholder: ", isGovHolder);
        console.log("isDelegate", isDelegate);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;
      setIsDisabled(true);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          TOKEN_CONTRACT,
          MyNftTokenAbi.abi,
          signer
        );

        console.log("Initialize payment");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const mint = 1;
        const balance = ethers.BigNumber.from("20000000000000000"); // price in Wei
        // const balance = nftContract.PRICE;

        const estimate = ethers.utils.formatEther(balance);
        const number_estimate = ethers.utils.parseEther(estimate);
        console.log("Estimated gas price is: ", estimate);
        let nftTxn = await nftContract.safeMint(accounts[0], {
          value: number_estimate,
        });
        // });
        // 0.021 ether should be enough to mint the NFT (0.020 NFT price)
        setWaitForMint(true);
        setSnackbarAlert(true);
        console.log("Minting... please wait");
        await nftTxn.wait();

        console.log(
          `Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        setSnackbarAlert(false);
        setTxLink(nftTxn.hash);
        setSnackbarAlert(true);
        setMinted(true);
        readNfts();
        setIsGovHolder(true);
        setIsDisabled(false);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      if (err.code === 4001) {
        //user rejected the transaction
        setRejection(true);
        setSnackbarAlert(true);
      }
      setIsDisabled(false);
      console.log(err);
    }
  };

  const govNftRaised = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        let nftRaised = await provider.getBalance(TOKEN_CONTRACT);
        console.log(nftRaised);
        // 0.021 ether should be enough to mint the NFT (0.020 NFT price)const
        setAmountRaised(ethers.utils.formatEther(nftRaised));

        console.log("Reading $$$ inside NFT contract s");

        console.log(`Raised: https://rinkeby.etherscan.io/tx/${amountRaised}`);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isPersonDelegate = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          TOKEN_CONTRACT,
          MyNftTokenAbi.abi,
          signer
        );

        console.log(currentAccount);
        const returnAddr = await nftContract.delegates(currentAccount);
        console.log("is delegate?", returnAddr);
        if (returnAddr !== "0x0000000000000000000000000000000000000000") {
          console.log("Account has delegated Votes.");
          console.log(returnAddr);
          setIsDelHolder(true);
        } else {
          console.log("No votes have been delegated.");
          setIsDelHolder(false);
        }
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };
  //   const mintNftHandler = () => {};
  const triggerUpdate = async () => {
    let connected = await connectWalletHandler();
    setRerender(!rerender);
  };

  const connectWalletButton = () => {
    return (
      <FormControl>
        <Button
          sx={{ mt: 1, mr: 1 }}
          onClick={triggerUpdate}
          type="wallet connect"
          variant="outlined"
          style={{ width: 600, height: 100, fontSize: "22px" }}
        >
          Connect Wallet
        </Button>
      </FormControl>
    );
    // );
  };

  const delegationFinished = () => {
    setIsDelHolder(true);
  };

  const mintNftButton = () => {
    return (
      <div>
        <FormControl>
          <Button
            sx={
              {
                //   color: "#141E27",
                //   backgroundColor: "#141E27",
                //   borderColor: "blue",
              }
            }
            // sx={{ mt: 1, mr: 1 }}
            disabled={isDisabled}
            onClick={mintNftHandler}
            type="mint button"
            variant="outlined"
            style={{ width: 600, height: 100, fontSize: "22px" }}
          >
            <StyledBadge color="secondary" sx={10}>
              <ShoppingCartIcon />
            </StyledBadge>
            {"  "}
            {"    "}
            Mint Genesis NFT
          </Button>
        </FormControl>
      </div>
    );
  };

  const resetSnackbar = async () => {
    setSnackbarAlert(false);
    setRejection(false);
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, [window.ethereum]);

  useEffect(() => {
    readNfts();
    isPersonDelegate();
    triggerUpdate();
    govNftRaised();
  }, []);

  useEffect(() => {
    readNfts();
    isPersonDelegate();
    triggerUpdate();
    govNftRaised();
  }, [isDelegate, isGovHolder]);

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    console.log("rerender");
  }, [currentAccount]);

  if (isGovHolder === null) {
    readNfts();
    isPersonDelegate();
    return <div>Loading...</div>;
  }
  if (isDelegate === null) {
    isPersonDelegate();
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="main-app">
        <br></br>

        <div className="coolTxt">
          <h1>Welcome</h1>
          <br></br>
          <div className="coolTxt">
            <p>
              {" "}
              NFT sale raised: <div className="hacky">{amountRaised} ETH</div>
            </p>
            <br></br>

            {!isGovHolder ? (
              <div>
                👇 Mint an NFT to become an Infrastructure DAO member.👇
              </div>
            ) : null}
          </div>
        </div>
        <br></br>
        <div>{currentAccount ? mintNftButton() : null}</div>
        <div>
          {snackbar && !isGovHolder ? <SimpleSnackbar name="noNfts" /> : null}
          {snackbar && rejection ? (
            <SimpleSnackbar name="userDeniedTx" />
          ) : null}
          {snackbar && waitForMint ? (
            <SimpleSnackbar name="mintingWait" />
          ) : null}
          {snackbar && minted ? <SimpleSnackbar name="successfulMint" /> : null}
        </div>
        <br></br>
        <div>
          {isGovHolder && isDelegate && currentAccount ? (
            <div className="coolTxt">
              <p>✅ You have enough VP to vote now.</p>
            </div>
          ) : (
            isGovHolder && (
              <div>
                <TakePart callback={delegationFinished} />
              </div>
            )
          )}
        </div>
      </div>
      <div>
        {isGovHolder && isDelegate && isProposer ? (
          <div>
            <div className="coolTxt">
              <p>✅ You have enough VP to submit proposals.</p>
            </div>
            <ReadyToPropose />
          </div>
        ) : (
          isGovHolder &&
          isDelegate &&
          !isProposer && (
            <div className="coolTxt">
              <p>💰 Mint more NFTs to gain enough VP to submit proposals.</p>
            </div>
          )
        )}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}

export default Home;
