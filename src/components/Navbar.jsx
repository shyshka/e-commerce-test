import React, {useCallback, useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Web3 from "web3";
import {ethers} from "ethers";

const Navbar = () => {
    const state = useSelector(state => state.handleCart)

    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);

    const connectWallet = useCallback(async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                if (error.code === 4001) {
                    // User rejected request
                    console.log('User denied account access.');
                } else {
                    console.error('Error connecting to wallet:', error);
                }
            }
        } else {
            alert('MetaMask is not installed. Please install it from metamask.io.');
        }
    }, []);

    const updateWalletInfo = useCallback(async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            try {
                const currentAccount = await signer.getAddress();
                setAccount(currentAccount);
            } catch (error) {
                console.error("Could not get account", error);
                setAccount(null);
            }
            const network = await provider.getNetwork();
            setChainId(network.chainId);
        }
    }, []);

    useEffect(async () => {
        if (window.ethereum) {
            await updateWalletInfo();
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                }
            });

            window.ethereum.on('chainChanged', async (_chainId) => {
                setChainId(parseInt(_chainId, 16));
                await updateWalletInfo();
            });
        }
    }, [updateWalletInfo]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        <NavLink to="/login" className="btn btn-outline-dark m-2"><i
                            className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                        <NavLink to="/register" className="btn btn-outline-dark m-2"><i
                            className="fa fa-user-plus mr-1"></i> Register</NavLink>
                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i
                            className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                    </div>
                </div>
            </div>

            <div>
                {account ? (
                    <div>
                        <p>Connected Account: {account}</p>
                        {chainId && <p>Chain ID: {chainId}</p>}
                    </div>
                ) : (
                    <button onClick={connectWallet}>Connect to MetaMask</button>
                )}
            </div>
        </nav>
    )
}

export default Navbar