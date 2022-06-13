import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { connect, getStarknet } from "get-starknet";
import { Signature } from "starknet";
import { ReactComponent as StarknetIcon } from "./starknet.svg";

export const copyToClipboard = (value: string) => navigator.clipboard.writeText(value);

const sign = async (
    message: string,
    network?: "goerli-alpha" | "mainnet-alpha"
): Promise<Signature | undefined> => {
    const wallet = getStarknet();
    return !wallet.isConnected
        ? undefined
        : wallet.account.signMessage({
              domain: {
                  name: "StarkNet DApp",
                  chainId:
                      (network || "goerli-alpha") === "goerli-alpha"
                          ? "SN_GOERLI"
                          : "SN_MAIN",
                  version: "0.0.1",
              },
              types: {
                  StarkNetDomain: [
                      { name: "name", type: "felt" },
                      { name: "chainId", type: "felt" },
                      { name: "version", type: "felt" },
                  ],
                  Message: [{ name: "message", type: "felt" }],
              },
              primaryType: "Message",
              message: { message },
          });
};

function Sign() {
    const [message, setMessage] = useState<string>("");
    const [signature, setSignature] = useState<string[]>();

    return (
        <Stack spacing={1} width={300}>
            <Typography variant={"body1"}>{"Enter a message to sign"}</Typography>
            <TextField
                value={message}
                onChange={e => {
                    if (signature) {
                        setSignature(undefined);
                    }
                    setMessage(e.currentTarget.value ?? "");
                }}
            />
            <Button
                variant={"contained"}
                disabled={!message?.trim()}
                onClick={() => {
                    sign(message)
                        .then(signature => setSignature(signature))
                        .catch(err => console.error(err));
                }}>
                {"Sign"}
            </Button>
            {!!signature?.length && (
                <Box>
                    <List dense disablePadding>
                        <ListSubheader sx={{ mt: 2 }}>
                            {"Signature"}
                            <IconButton
                                size={"small"}
                                onClick={() => copyToClipboard(signature?.join(" "))}>
                                <ContentCopy fontSize={"small"} />
                            </IconButton>
                        </ListSubheader>

                        {signature.map((val, idx) => (
                            <ListItem key={val.substring(0, 5)}>
                                <ListItemText
                                    primary={val}
                                    secondary={idx === 0 ? "r" : "s"}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Stack>
    );
}

function App() {
    const [isConnected, setIsConnected] = useState<boolean>(getStarknet().isConnected);

    // silently attempt to connect with a pre-authorized wallet
    useEffect(() => {
        connect({ showList: false }).then(wallet => {
            wallet
                ?.enable({ showModal: false })
                .then(account => setIsConnected(!!wallet?.isConnected));
        });
    }, []);

    return (
        <Stack sx={{ height: "50vh" }} direction={"column"} justifyContent={"center"}>
            <Container>
                {isConnected ? (
                    // sign message
                    <Sign />
                ) : (
                    // connect
                    <>
                        <Stack direction={"row"} alignItems={"center"}>
                            <StarknetIcon width={40} />
                            <Typography variant={"h5"}>{"Welcome!"}</Typography>
                        </Stack>

                        <Box>
                            <Typography variant={"body1"} sx={{ mt: 2 }}>
                                {"Please connect with your wallet"}
                            </Typography>
                            <Button
                                sx={{ mt: 1 }}
                                variant={"contained"}
                                onClick={async () => {
                                    try {
                                        const wallet = await connect({
                                            include: ["braavos"],
                                        });
                                        if (wallet) {
                                            await wallet.enable({ showModal: true });
                                            setIsConnected(!!wallet?.isConnected);
                                        }
                                    } catch {}
                                }}>
                                {"Connect Wallet"}
                            </Button>
                        </Box>
                    </>
                )}
            </Container>
        </Stack>
    );
}

export default App;
