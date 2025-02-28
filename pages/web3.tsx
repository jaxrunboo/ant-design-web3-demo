import { parseEther } from "viem";
import { mainnet, sepolia, polygon } from "wagmi/chains";
import { Button, message } from "antd";
import { createConfig, http, useReadContract, useWriteContract } from "wagmi";
import { Mainnet, WagmiWeb3ConfigProvider, MetaMask, Sepolia, WalletConnect, Polygon } from '@ant-design/web3-wagmi';
import { Address, NFTCard, ConnectButton, Connector, useAccount, useProvider } from "@ant-design/web3";
import { injected, walletConnect } from "wagmi/connectors";

const config = createConfig({
    chains: [mainnet, sepolia, polygon],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [polygon.id]: http(),
    },
    connectors: [
        injected({
            target: "metaMask"
        }),
        walletConnect({
            projectId: 'c07c0051c2055890eade3556618e38a6',
            showQrModal: false,
        })
    ]
});

const contractInfo = [
    {
        id: 1,
        name: 'Ethereum',
        contractAddress: '0xEcd0D12E21805803f70de03B72B1C162dB0898d9',
    },
    {
        id: 5,
        name: 'Sepolia',
        contractAddress: '0x418325c3979b7f8a17678ec2463a74355bdbe72c',
    },
    {
        id: 137,
        name: 'Polygon',
        contractAddress: '0x418325c3979b7f8a17678ec2463a74355bdbe72c',
    },
];

const CallTest = () => {
    const { account } = useAccount();//获取当前账户
    const { chain } = useProvider();
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
        //nft合约地址
        address: contractInfo.find(item => item.id === chain?.id)?.contractAddress as `0x${string}`,
        //'0x933C4C786DC16B9858D37c2DDE993df98f1Eecc4',
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
                    address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
                    functionName: 'mint',
                    args: [BigInt(1)],
                    value: parseEther('0.01'),
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
};

export default function Web3() {
    return (
        <WagmiWeb3ConfigProvider
            config={config}
            chains={[Sepolia, Polygon]}
            wallets={[MetaMask(), WalletConnect()]}
            eip6963={{
                autoAddInjectedWallets: true
            }}
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