import { Icon20DiamondOutline } from "@vkontakte/icons";
import { Button, Snackbar } from "@vkontakte/vkui";
import { ReactNode } from "react";
import { DEFAULT_MODALS } from "../routes";

export const openSnackbar = (setPopout: React.Dispatch<React.SetStateAction<ReactNode>>, message?: string, icon?: ReactNode) => {
    setPopout(
        <Snackbar
            onClick={() => setPopout(null)}
            duration={1000}
            onClose={() => setPopout(null)}
            before={icon ? icon : null}
        >
            {message || 'Что-то пошло не так'}
        </Snackbar>
    );
};


export const BuyCreditButton = ({ credits, setCurrentModal }: { credits: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <Button
            before={<Icon20DiamondOutline />}
            onClick={() => setCurrentModal(DEFAULT_MODALS.PAYMENT_MODAL)}
            mode="outline"
            appearance="positive"
            size="m"
        >
            {credits}
        </Button>
    );
}