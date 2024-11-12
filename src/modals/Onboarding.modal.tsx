// import { ModalRoot, ModalPage, ModalCard, SplitLayout } from "@vkontakte/vkui";

import { Icon56GavelOutline } from "@vkontakte/icons";
import { Spacing, ButtonGroup, Button, ModalCard } from "@vkontakte/vkui";
import React from "react";
import { DEFAULT_MODALS } from "../routes";

export const WelcomeOnboarding = ({ id, setCurrentModal }: { id: string,  setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id} 
            onClose={() => setCurrentModal(null)}
            style={{ width: 320 }}
            icon={<Icon56GavelOutline />}
            header="О чем игра?"
            subheader="Тут надо крушить и ломать авто на запчасти!"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.DAMAGE_2)}>
                            Круто!
                        </Button>
                        <Button onClick={setCurrentModal} size="l" mode="secondary" stretched>
                            Позже
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const DamageOnboarding = ({ id, setCurrentModal }: { id: string,  setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard 
            id={id} 
            onClose={() => setCurrentModal(null)}
            style={{ width: 320 }}
            icon={<Icon56GavelOutline />}
            header="Как провигаться?"
            subheader="Выбирай авто из своего списка машин и активно тапай"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.BUY_3)}>
                            Неплохо
                        </Button>
                        <Button onClick={setCurrentModal} size="l" mode="secondary" stretched>
                            Позже
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const BuyOnboarding = ({ id, setCurrentModal }: { id: string,  setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard 
            id={id} 
            onClose={() => setCurrentModal(null)}
            style={{ width: 320 }}
            icon={<Icon56GavelOutline />}
            header="А если я все сломаю?"
            subheader="В этом суть! Покупай хлам за кредиты и ломай его для большей прибыли"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.INVITE_4)}>
                            Звучит неплохо
                        </Button>
                        <Button onClick={setCurrentModal} size="l" mode="secondary" stretched>
                            Позже
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const InviteOnboarding = ({ id, setCurrentModal }: { id: string,  setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {


    return (
        <ModalCard 
            id={id} 
            onClose={() => setCurrentModal(null)}
            style={{ width: 320 }}
            icon={<Icon56GavelOutline />}
            header="А вдруг мои лапки устанут?"
            subheader="Приглашай друзей в игру и получай приятный бонус"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.ADS_5)}>
                            Эх, где бы этих самых друзей найти
                        </Button>
                        <Button onClick={setCurrentModal} size="l" mode="secondary" stretched>
                            Позже
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const AdsOnboarding = ({ id, setCurrentModal }: { id: string,  setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}
            style={{ width: 320 }}
            icon={<Icon56GavelOutline />}
            header="Что делать если я лев-тигр нет друзей?"
            subheader="Смотри рекламу, получай бонус и ищи друзей в нашем сообществе!"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button size="l" mode="primary" stretched onClick={() => setCurrentModal(null)}>
                            Ррррр! (по лев-тигриному)
                        </Button>
                        <Button disabled size="l" mode="primary" stretched>
                            В сообщество
                        </Button>
                        <Button onClick={() => setCurrentModal(null)} size="l" mode="secondary" stretched>
                            Позже
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}