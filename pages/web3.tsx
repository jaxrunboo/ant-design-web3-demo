import { parseEther } from "viem";
import { Button, message } from "antd";
import { http, useReadContract, useWriteContract } from "wagmi";
import { Mainnet, WagmiWeb3ConfigProvider, MetaMask, Sepolia } from '@ant-design/web3-wagmi';
import { Address, NFTCard, ConnectButton, Connector, useAccount } from "@ant-design/web3";

const CallTest = () => {
    const { account } = useAccount();//获取当前账户
    const result = useReadContract({
        abi: [
            {
                type: 'function',
                name: 'balanceOf',
                stateMutability: 'view',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ type: 'uint256' }],
            }
        ],
        address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',//nft合约地址
        functionName: 'balanceOf',
        args: [account?.address as `0x${string}`],
    });

    const { writeContract } = useWriteContract();

    return (
        <div>
            {result.data?.toString()}
            <Button onClick={() => {
                writeContract({
                    abi: [{
                        type: 'function',
                        name: 'mint',
                        stateMutability: 'payable',
                        inputs: [{ internalType: 'uint256', name: 'quantity', type: 'uint256' }],
                        //internalType 和 type 在复杂结构入参：如结构体、枚举、自定义结构时会不同，其他时间都是相同的
                        //internalType solidity源码中的数据类型，type是abi json中的数据类型
                        outputs: [],
                    }],
                    address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
                    functionName: 'mint',
                    args: [BigInt(1)],
                    value: parseEther('0.001'),
                },
                    {
                        onSuccess: () => {
                            message.success('mint success');
                        },
                        onError: (err) => {
                            message.error(err.message);
                        },
                    });
            }}>mint</Button>
        </div>
    );
}

export default function Web3() {
    return (
        <WagmiWeb3ConfigProvider
            chains={[Mainnet]}
            transports={{
                [Mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/3d362260a7b84139bc4ccb38280b2f38')
            }}
            wallets={[MetaMask()]}
        >
            <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
            <NFTCard address="0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" tokenId={1} />
            <Connector>
                <ConnectButton />
            </Connector>
            <CallTest />
        </WagmiWeb3ConfigProvider>
    );
}