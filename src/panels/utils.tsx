import { Snackbar } from "@vkontakte/vkui";
import { ReactNode } from "react";

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